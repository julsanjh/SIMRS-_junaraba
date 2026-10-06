const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ==========================================
// 1. ENDPOINT PASIEN (PATIENTS)
// ==========================================

// GET: Ambil semua data pasien
router.get('/patients', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM patients ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// POST: Tambah data pasien baru
router.post('/patients', async (req, res) => {
    const { noRm, nik, nama, tempatLahir, tanggalLahir, jk, kontak, alamat, penjamin, namaWali, noHpWali } = req.body;
    if (!nik || !nama) {
        return res.status(400).json({ status: 'error', message: 'NIK dan Nama Pasien wajib diisi!' });
    }

    try {
        const query = `
            INSERT INTO patients (noRm, nik, nama, tempatLahir, tanggalLahir, jk, kontak, alamat, penjamin, namaWali, noHpWali)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            noRm, nik, nama, tempatLahir, tanggalLahir, jk, kontak, alamat, penjamin || 'Umum / Pribadi', namaWali, noHpWali
        ]);
        res.json({ status: 'success', message: 'Pasien berhasil ditambahkan', id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// DELETE: Hapus pasien
router.delete('/patients/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM patients WHERE id = ?', [req.params.id]);
        res.json({ status: 'success', message: 'Data pasien berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ==========================================
// 2. ENDPOINT DOKTER (DOCTORS)
// ==========================================

router.get('/doctors', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM doctors ORDER BY nama ASC');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.post('/doctors', async (req, res) => {
    const { nip, nama, spesialis, poli, kontak, status } = req.body;
    try {
        const query = 'INSERT INTO doctors (nip, nama, spesialis, poli, kontak, status) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [nip, nama, spesialis, poli, kontak, status || 'Aktif']);
        res.json({ status: 'success', message: 'Dokter berhasil ditambahkan', id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.delete('/doctors/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM doctors WHERE id = ?', [req.params.id]);
        res.json({ status: 'success', message: 'Dokter berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ==========================================
// 3. ENDPOINT DEPARTEMEN / POLI (DEPARTMENTS)
// ==========================================

router.get('/departments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM departments ORDER BY nama ASC');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.post('/departments', async (req, res) => {
    const { kode, nama, kepala, status } = req.body;
    try {
        const query = 'INSERT INTO departments (kode, nama, kepala, status) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [kode, nama, kepala, status || 'Aktif']);
        res.json({ status: 'success', message: 'Departemen berhasil ditambahkan', id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ==========================================
// 4. ENDPOINT PENDAFTARAN & ANTRIAN (QUEUE)
// ==========================================

router.get('/queue', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM queue ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.post('/queue', async (req, res) => {
    const { noAntrian, noRm, namaPasien, poli, dokter, keluhan, penjamin, status, tanggal } = req.body;
    try {
        const query = `
            INSERT INTO queue (noAntrian, noRm, namaPasien, poli, dokter, keluhan, penjamin, status, tanggal)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const tgl = tanggal || new Date().toISOString().split('T')[0];
        const [result] = await db.query(query, [noAntrian, noRm, namaPasien, poli, dokter, keluhan, penjamin || 'Umum / Pribadi', status || 'Menunggu', tgl]);
        res.json({ status: 'success', message: 'Antrian berhasil ditambahkan', id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.put('/queue/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE queue SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ status: 'success', message: 'Status antrian diperbarui' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ==========================================
// 5. ENDPOINT RAWAT INAP (INPATIENTS)
// ==========================================

router.get('/inpatients', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM inpatients ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.post('/inpatients', async (req, res) => {
    const { noKamar, noRm, namaPasien, kelas, dokterDPJP, tglMasuk, status } = req.body;
    try {
        const query = `
            INSERT INTO inpatients (noKamar, noRm, namaPasien, kelas, dokterDPJP, tglMasuk, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [noKamar, noRm, namaPasien, kelas, dokterDPJP, tglMasuk || new Date().toISOString().split('T')[0], status || 'Dirawat']);
        res.json({ status: 'success', message: 'Data Rawat Inap ditambahkan', id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ==========================================
// 6. ENDPOINT REKAM MEDIS & APOTEK
// ==========================================

router.get('/medical-records', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM medical_records ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.post('/medical-records', async (req, res) => {
    const { noRm, namaPasien, dokter, diagnosa, tindakan, resepObat, catatan, tanggal } = req.body;
    try {
        const query = `
            INSERT INTO medical_records (noRm, namaPasien, dokter, diagnosa, tindakan, resepObat, catatan, tanggal)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [noRm, namaPasien, dokter, diagnosa, tindakan, resepObat, catatan, tanggal || new Date().toISOString().split('T')[0]]);
        res.json({ status: 'success', message: 'Rekam Medis berhasil disimpan', id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ==========================================
// 7. ENDPOINT USER & SINKRONISASI
// ==========================================

router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, role, nama, created_at FROM users ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.post('/sync/patients', async (req, res) => {
    const { queue } = req.body;
    if (!queue || !Array.isArray(queue) || queue.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Tidak ada data antrean untuk disinkronkan.' });
    }

    try {
        let successCount = 0;
        for (const item of queue) {
            const p = item.data || item;
            const query = `
                INSERT INTO patients (noRm, nik, nama, tempatLahir, tanggalLahir, jk, kontak, alamat, penjamin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE nama=VALUES(nama), kontak=VALUES(kontak)
            `;
            await db.query(query, [p.noRm, p.nik, p.nama, p.tempatLahir, p.tanggalLahir, p.jk, p.kontak, p.alamat, p.penjamin]);
            successCount++;
        }
        res.json({ status: 'success', message: `Sinkronisasi berhasil mengintegrasikan ${successCount} data pasien ke database cloud.` });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;