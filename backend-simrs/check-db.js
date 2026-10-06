const db = require('./config/database');

async function checkDatabaseData() {
    console.log('\n==================================================');
    console.log('📊 SIMRS JUNARABA - CEK ISI DATABASE AIVEN CLOUD');
    console.log('==================================================\n');

    try {
        // 1. Data Pasien
        const [patients] = await db.query('SELECT * FROM patients');
        console.log(`👨‍⚕️ 1. DATA PASIEN (${patients.length} data):`);
        console.table(patients.map(p => ({
            "No RM": p.noRm,
            "NIK": p.nik,
            "Nama": p.nama,
            "Jenis Kelamin": p.jk,
            "Penjamin": p.penjamin,
            "Kontak": p.kontak
        })));

        // 2. Data Dokter
        const [doctors] = await db.query('SELECT * FROM doctors');
        console.log(`\n🩺 2. DATA DOKTER (${doctors.length} data):`);
        console.table(doctors.map(d => ({
            "NIP": d.nip,
            "Nama": d.nama,
            "Spesialis": d.spesialis,
            "Poli": d.poli,
            "Status": d.status
        })));

        // 3. Data Departemen / Poli
        const [departments] = await db.query('SELECT * FROM departments');
        console.log(`\n🏢 3. DATA DEPARTEMEN / POLI (${departments.length} data):`);
        console.table(departments.map(dp => ({
            "Kode": dp.kode,
            "Nama Poli": dp.nama,
            "Kepala": dp.kepala,
            "Status": dp.status
        })));

        // 4. Data Antrian Poli
        const [queue] = await db.query('SELECT * FROM queue');
        console.log(`\n📋 4. DATA ANTRIAN POLI (${queue.length} data):`);
        console.table(queue.map(q => ({
            "No Antrian": q.noAntrian,
            "No RM": q.noRm,
            "Nama Pasien": q.namaPasien,
            "Poli": q.poli,
            "Status": q.status
        })));

        console.log('\n==================================================\n');
    } catch (err) {
        console.error('❌ Gagal membaca database:', err.message);
    } finally {
        process.exit(0);
    }
}

checkDatabaseData();
