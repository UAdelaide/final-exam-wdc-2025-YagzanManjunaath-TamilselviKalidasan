var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
    try {
        // Connect to MySQL without specifying a database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '' // Set your MySQL root password
        });

        // Create the database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
        await connection.end();

        // Now connect to the created database
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService'
        });

        const table_queries = [
            `CREATE TABLE Users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('owner', 'walker') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE Dogs (
                dog_id INT AUTO_INCREMENT PRIMARY KEY,
                owner_id INT NOT NULL,
                name VARCHAR(50) NOT NULL,
                size ENUM('small', 'medium', 'large') NOT NULL,
                FOREIGN KEY (owner_id) REFERENCES Users(user_id)
            );`,
            `CREATE TABLE WalkRequests (
                request_id INT AUTO_INCREMENT PRIMARY KEY,
                dog_id INT NOT NULL,
                requested_time DATETIME NOT NULL,
                duration_minutes INT NOT NULL,
                location VARCHAR(255) NOT NULL,
                status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
            );`,
            `CREATE TABLE WalkApplications (
                application_id INT AUTO_INCREMENT PRIMARY KEY,
                request_id INT NOT NULL,
                walker_id INT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
                FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
                FOREIGN KEY (walker_id) REFERENCES Users(user_id),
                CONSTRAINT unique_application UNIQUE (request_id, walker_id)
            );`,
            `            CREATE TABLE WalkRatings (
                rating_id INT AUTO_INCREMENT PRIMARY KEY,
                request_id INT NOT NULL,
                walker_id INT NOT NULL,
                owner_id INT NOT NULL,
                rating INT CHECK (rating BETWEEN 1 AND 5),
                comments TEXT,
                rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
                FOREIGN KEY (walker_id) REFERENCES Users(user_id),
                FOREIGN KEY (owner_id) REFERENCES Users(user_id),
                CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
            );`

        ];
        // Create a table if it doesn't exist
        table_queries.forEach();query->{await db.execute(query)};

        // Insert data if table is empty
        const [user_rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
        if (user_rows[0].count === 0) {
            await db.execute(`
                INSERT INTO Users(username,email,password_hash,role) values ('alice123','alice@example.com','hashed123','owner');
                INSERT INTO Users(username,email,password_hash,role) values ('bobwalker','bob@example.com','hashed456','walker');
                INSERT INTO Users(username,email,password_hash,role) values ('carol123','carol@example.com','hashed789','owner');
                INSERT INTO Users(username,email,password_hash,role) values ('batman','brucewayne@example.com','martha123','owner');
                INSERT INTO Users(username,email,password_hash,role) values ('alfred','alfred@example.com','thomas123','walker');
            `);
        }
        // Insert Dogs
        const [dog_rows] = await db.execute('SELECT COUNT(*) AS count FROM Dogs');
        if (dog_rows[0].count === 0) {
            await db.execute(`
                    INSERT INTO Dogs(name,size,owner_id) values ('Max','medium',
                        (SELECT Users.user_id from Users where Users.username  = 'alice123' LIMIT 1)
                    );

                    INSERT INTO Dogs(name,size,owner_id) values ('Bella','small',
                        (SELECT Users.user_id from Users where Users.username  = 'carol123' LIMIT 1)
                    );

                    INSERT INTO Dogs(name,size,owner_id) values ('Ace','large',
                        (SELECT Users.user_id from Users where Users.username  = 'batman' LIMIT 1)
                    );

                    INSERT INTO Dogs(name,size,owner_id) values ('Krypto','medium',
                        (SELECT Users.user_id from Users where Users.username  = 'batman' LIMIT 1)
                    );

                    INSERT INTO Dogs(name,size,owner_id) values ('Sugar','medium',
                        (SELECT Users.user_id from Users where Users.username  = 'alice123' LIMIT 1)
                    );
                `);
        }

        // Insert WalkRequests
        const [walkRequest_rows] = await db.execute('SELECT COUNT(*) AS count FROM WalkRequests');
        if (walkRequest_rows[0].count === 0) {
            await db.execute(`
                    INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
                        (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Max' LIMIT 1),'2025-06-10 08:00:00',30,'Parklands','open'
                    );
                    INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
                        (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Bella' LIMIT 1),'2025-06-10 09:30:00',45,'Beachside Ave','accepted'
                    );

                    INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
                        (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Krypto' LIMIT 1),'2025-06-12 10:30:00',30,'Metropolis','open'
                    );

                    INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
                        (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Ace' LIMIT 1),'2025-06-11 18:30:00',45,'Wayne Manor grounds','completed'
                    );

                    INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
                        (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Sugar' LIMIT 1),'2025-06-12 11:30:00',20,'Egmore grounds','open'
                    );
                `);
        }

        // Insert WalkRatings
        const [wallRatings_rows] = await db.execute('SELECT COUNT(*) AS count FROM WalkRatings');
        if (walkRequest_rows[0].count === 0) {
            await db.execute(`
                INSERT INTO DogWalkService.WalkRatings
                        ( request_id, walker_id, owner_id, rating, comments)
                        VALUES(
                        (SELECT w_req.request_id from WalkRequests w_req
                        inner join Dogs d on w_req.dog_id = d.dog_id
                        where d.name  = 'Max' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'bobwalker' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'alice123' LIMIT 1),
                         4,
                         'Good job,Bob');

                INSERT INTO DogWalkService.WalkRatings
                        ( request_id, walker_id, owner_id, rating, comments)
                        VALUES(
                        (SELECT w_req.request_id from WalkRequests w_req
                        inner join Dogs d on w_req.dog_id = d.dog_id
                        where d.name  = 'Ace' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'bobwalker' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'batman' LIMIT 1),
                         2,
                         'He left Ace hungry');

                INSERT INTO DogWalkService.WalkRatings
                        ( request_id, walker_id, owner_id, rating, comments)
                        VALUES(
                        (SELECT w_req.request_id from WalkRequests w_req
                        inner join Dogs d on w_req.dog_id = d.dog_id
                        where d.name  = 'Ace' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'alfred' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'batman' LIMIT 1),
                         5,
                         'Alfred, you are the best');
                                INSERT INTO DogWalkService.WalkRatings
                        ( request_id, walker_id, owner_id, rating, comments)
                        VALUES(
                        (SELECT w_req.request_id from WalkRequests w_req
                        inner join Dogs d on w_req.dog_id = d.dog_id
                        where d.name  = 'Krypto' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'alfred' LIMIT 1),
                         (SELECT Users.user_id from Users where Users.username  = 'batman' LIMIT 1),
                         4,
                         'Krypto was hurt during the walk');

                `);
        }


    } catch (err) {
        console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }
})();

// Route to return books as JSON
app.get('/', async (req, res) => {
    try {
        const [books] = await db.execute('SELECT * FROM books');
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;