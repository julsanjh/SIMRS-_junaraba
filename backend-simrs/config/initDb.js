const db = require('./database');

async function initDatabase() {
    try {
        console.log('🔄 Memeriksa & menginisialisasi tabel-tabel database...');

        // 1. Tabel Users
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('Admin', 'Dokter', 'Perawat', 'Apoteker', 'Kasir') DEFAULT 'Perawat',
                nama VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Tabel Patients
        await db.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                noRm VARCHAR(20) UNIQUE NOT NULL,
                nik VARCHAR(20) UNIQUE NOT NULL,
                nama VARCHAR(100) NOT NULL,
                tempatLahir VARCHAR(50),
                tanggalLahir DATE,
                jk ENUM('Laki-laki', 'Perempuan') NOT NULL,
                kontak VARCHAR(20),
                alamat TEXT,
                penjamin VARCHAR(50) DEFAULT 'Umum / Pribadi',
                namaWali VARCHAR(100),
                noHpWali VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Tabel Doctors
        await db.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nip VARCHAR(30) UNIQUE NOT NULL,
                nama VARCHAR(100) NOT NULL,
                spesialis VARCHAR(100) NOT NULL,
                poli VARCHAR(50) NOT NULL,
                kontak VARCHAR(20),
                status ENUM('Aktif', 'Cuti', 'Non-Aktif') DEFAULT 'Aktif',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. Tabel Departments
        await db.query(`
            CREATE TABLE IF NOT EXISTS departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                kode VARCHAR(10) UNIQUE NOT NULL,
                nama VARCHAR(100) NOT NULL,
                kepala VARCHAR(100),
                status ENUM('Aktif', 'Non-Aktif') DEFAULT 'Aktif',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. Tabel Queue / Pendaftaran Poli
        await db.query(`
            CREATE TABLE IF NOT EXISTS queue (
                id INT AUTO_INCREMENT PRIMARY KEY,
                noAntrian VARCHAR(20) NOT NULL,
                noRm VARCHAR(20) NOT NULL,
                namaPasien VARCHAR(100) NOT NULL,
                poli VARCHAR(50) NOT NULL,
                dokter VARCHAR(100) NOT NULL,
                keluhan TEXT,
                penjamin VARCHAR(50) DEFAULT 'Umum / Pribadi',
                status ENUM('Menunggu', 'Dipanggil', 'Sedang Diperiksa', 'Selesai', 'Batal') DEFAULT 'Menunggu',
                tanggal DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. Tabel Medical Records
        await db.query(`
            CREATE TABLE IF NOT EXISTS medical_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                noRm VARCHAR(20) NOT NULL,
                namaPasien VARCHAR(100) NOT NULL,
                dokter VARCHAR(100) NOT NULL,
                diagnosa TEXT NOT NULL,
                tindakan TEXT,
                resepObat TEXT,
                catatan TEXT,
                tanggal DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 7. Tabel Pharmacy
        await db.query(`
            CREATE TABLE IF NOT EXISTS pharmacy (
                id INT AUTO_INCREMENT PRIMARY KEY,
                noResep VARCHAR(20) UNIQUE NOT NULL,
                noRm VARCHAR(20) NOT NULL,
                namaPasien VARCHAR(100) NOT NULL,
                namaObat VARCHAR(100) NOT NULL,
                jumlah INT NOT NULL DEFAULT 1,
                dosis VARCHAR(50),
                status ENUM('Diproses', 'Siap', 'Diambil') DEFAULT 'Diproses',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 8. Tabel Rawat Inap (Inpatient)
        await db.query(`
            CREATE TABLE IF NOT EXISTS inpatients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                noKamar VARCHAR(20) NOT NULL,
                noRm VARCHAR(20) NOT NULL,
                namaPasien VARCHAR(100) NOT NULL,
                kelas VARCHAR(20) NOT NULL,
                dokterDPJP VARCHAR(100) NOT NULL,
                tglMasuk DATE NOT NULL,
                status ENUM('Dirawat', 'Pulang', 'Rujuk') DEFAULT 'Dirawat',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Semua tabel database SIMRS berhasil disiapkan!');
    } catch (err) {
        console.warn('⚠️ Gagal inisialisasi tabel: Database MySQL belum terhubung.');
    }
}

module.exports = initDatabase;
