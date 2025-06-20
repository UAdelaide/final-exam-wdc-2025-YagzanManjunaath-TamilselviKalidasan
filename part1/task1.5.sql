-- INSERT QUERIES FOR 5 USERS
INSERT INTO Users(username,email,password_hash,role) values ('alice123','alice@example.com','hashed123','owner');
INSERT INTO Users(username,email,password_hash,role) values ('bobwalker','bob@example.com','hashed456','walker');
INSERT INTO Users(username,email,password_hash,role) values ('carol123','carol@example.com','hashed789','owner');
INSERT INTO Users(username,email,password_hash,role) values ('batman','brucewayne@example.com','martha123','owner');
INSERT INTO Users(username,email,password_hash,role) values ('alfred','alfred@example.com','thomas123','walker');



-- INSERT QUERIES FOR 5 DOGS WITH SUBQUERIES

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

-- INSERT QUERIES FOR 5 WALKREQUESTS WITH SUBQUERIES
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

