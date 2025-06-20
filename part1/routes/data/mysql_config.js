const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'DogWalkService',
    connectionLimit: 10
});

const query = (sql, args) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection){
            if (err) {
                return reject(err);
            }
            connection.query(sql, args,function (err, result){
                connection.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });

    });
}