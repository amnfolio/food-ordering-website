// db.js - MySQL connection pool
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_ordering_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// promise wrapper so we can use async/await
const db = pool.promise();

module.exports = db;
