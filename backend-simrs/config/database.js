const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database MySQL gagal:', err);
        return;
    }
    console.log('Berhasil terhubung ke database MySQL SIM RS JUNARABA.');
});

module.exports = db;