const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Endpoint Sinkronisasi Massal (Menerima antrean dari LocalStorage Frontend)
router.post('/sync/patients', (req, res) => {
    const { queue } = req.body;

    if (!queue || !Array.isArray(queue) || queue.length === 0) {
        return res.status(400).json({ message: 'Tidak ada data antrean untuk disinkronkan.' });
    }

    let successCount = 0;
    queue.forEach(item => {
        const p = item.data || item;
        const query = 'INSERT IGNORE INTO patients (noRm, nik, nama, jk, tglLahir, penjamin, kontak) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [p.noRm, p.nik, p.nama, p.jk, p.tglLahir, p.penjamin, p.kontak], (err) => {
            if (!err) successCount++;
        });
    });

    res.json({
        status: 'success',
        message: `Sinkronisasi berhasil mengintegrasikan data ke server utama.`
    });
});

module.exports = router;