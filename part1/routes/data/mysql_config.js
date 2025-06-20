const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'DogWalkService',
    connectionLimit: 10
});

const query = (sql,args) =>{
    return new Promise((resolve,reject))
}