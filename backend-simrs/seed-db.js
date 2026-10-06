const db = require('./config/database');

async function seedDatabase() {
    console.log('\n==================================================');
    console.log('🌱 MENGISI SAMPLE DATA KE AIVEN MYSQL CLOUD...');
    console.log('==================================================\n');

    try {
        // 1. Seed Pasien Sample
        const samplePatients = [
            ['RM-260101', '3171010101900001', 'Budi Santoso', 'Jakarta', '1990-05-15', 'Laki-laki', '08123456789', 'Jl. Merdeka No. 10', 'BPJS Kesehatan'],
            ['RM-260102', '3171010202950002', 'Siti Rahmawati', 'Bandung', '1995-08-20', 'Perempuan', '08987654321', 'Jl. Mawar No. 45', 'Umum / Pribadi'],
            ['RM-260103', '3171010303880003', 'Ahmad Hidayat', 'Surabaya', '1988-12-10', 'Laki-laki', '081311223344', 'Jl. Pemuda No. 88', 'Asuransi Swasta']
        ];

        for (const p of samplePatients) {
            await db.query(`
                INSERT INTO patients (noRm, nik, nama, tempatLahir, tanggalLahir, jk, kontak, alamat, penjamin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE nama=VALUES(nama)
            `, p);
        }
        console.log('✅ 3 Data Pasien Sample berhasil dimasukkan!');

        // 2. Seed Dokter Sample
        const sampleDoctors = [
            ['198501012010011001', 'dr. Budi Santoso, Sp.PD', 'Spesialis Penyakit Dalam', 'Poli Penyakit Dalam', '081234567890', 'Aktif'],
            ['198802152012022002', 'drg. Maya Indah', 'Dokter Gigi', 'Poli Gigi', '081298765432', 'Aktif'],
            ['199003202015031003', 'dr. Siti Rahma, Sp.A', 'Spesialis Anak', 'Poli Anak', '081311223344', 'Aktif']
        ];

        for (const d of sampleDoctors) {
            await db.query(`
                INSERT INTO doctors (nip, nama, spesialis, poli, kontak, status)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE nama=VALUES(nama)
            `, d);
        }
        console.log('✅ 3 Data Dokter Sample berhasil dimasukkan!');

        // 3. Seed Antrian Sample
        const today = new Date().toISOString().split('T')[0];
        const sampleQueue = [
            ['POL-001', 'RM-260101', 'Budi Santoso', 'Poli Penyakit Dalam', 'dr. Budi Santoso, Sp.PD', 'Demam & Sakit Kepala', 'BPJS Kesehatan', 'Dipanggil', today],
            ['POL-002', 'RM-260102', 'Siti Rahmawati', 'Poli Anak', 'dr. Siti Rahma, Sp.A', 'Batuk Pilek Anak', 'Umum / Pribadi', 'Menunggu', today]
        ];

        for (const q of sampleQueue) {
            await db.query(`
                INSERT INTO queue (noAntrian, noRm, namaPasien, poli, dokter, keluhan, penjamin, status, tanggal)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, q);
        }
        console.log('✅ 2 Data Antrian Poli Sample berhasil dimasukkan!');

        console.log('\n==================================================');
        console.log('🎉 SEEDING SELESAI! Silakan jalankan node check-db.js untuk melihat hasilnya.');
        console.log('==================================================\n');

    } catch (err) {
        console.error('❌ Gagal melakukan seed data:', err.message);
    } finally {
        process.exit(0);
    }
}

seedDatabase();
