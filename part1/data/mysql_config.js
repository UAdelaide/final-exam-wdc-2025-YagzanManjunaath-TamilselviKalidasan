const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'DogWalkService',
    connectionLimit: 10
});

const query = (sql, args) => new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            return reject(err);
        }
        connection.query(sql, args, function (result_err, result) {
            connection.release();
            if (result_err) {
                return reject(result_err);
            }
            return resolve(result);
        });
    });
});

module.exports = { query };
