const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password:"root@123",
//     database: "rentify",
// });
// pool.query("select * from user",(err,rec,field) => {
//     if(err) {
//         console.log(err);
//         return;
//     }
//     console.log(rec);
//     console.log(field);
// })

module.exports = pool.promise();
