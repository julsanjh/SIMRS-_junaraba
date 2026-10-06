const mysql = require('mysql2');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const isCloud = dbHost.includes('aivencloud.com') || process.env.DB_SSL === 'true';

// Gunakan connection pool dengan SSL otomatis jika menghubungkan ke Cloud (Aiven)
const pool = mysql.createPool({
    host: dbHost,
    port: parseInt(dbPort),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: isCloud ? { rejectUnauthorized: false } : false
});

// Konversi ke promise wrapper untuk async/await
const db = pool.promise();

// Cek koneksi awal
pool.getConnection((err, connection) => {
    if (err) {
        console.warn('\n❌ [GAGAL] Tidak dapat terhubung ke MySQL:');
        console.warn(`📌 Host: ${dbHost}:${dbPort}`);
        console.warn(`⚠️ Error Detail: ${err.message}\n`);
    } else {
        console.log(`✅ [SUKSES] Berhasil terhubung ke Database MySQL (${dbHost}:${dbPort})!`);
        connection.release();
    }
});

module.exports = db;