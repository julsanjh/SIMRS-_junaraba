// Base API URL dari environment variable (misal: Render/Backend Cloud URL) atau fallback local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper API Service untuk Pasien
export const patientService = {
    getAll: async () => {
        try {
            const res = await fetch(`${API_URL}/patients`);
            if (!res.ok) throw new Error('Gagal mengambil data dari server');
            const data = await res.json();
            return data.data;
        } catch (err) {
            console.warn('⚠️ Server backend tidak terhubung, memuat data lokal...', err.message);
            return JSON.parse(localStorage.getItem('simrs_master_pasien') || '[]');
        }
    },

    create: async (patientData) => {
        const existingLocal = JSON.parse(localStorage.getItem('simrs_master_pasien') || '[]');
        localStorage.setItem('simrs_master_pasien', JSON.stringify([...existingLocal, patientData]));

        try {
            const res = await fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });
            if (!res.ok) throw new Error('Gagal menyimpan ke database cloud');
            return await res.json();
        } catch (err) {
            console.warn('⚠️ Gagal terhubung ke database cloud, data disimpan secara lokal.', err.message);
            return { status: 'offline', message: 'Data disimpan di penyimpanan lokal' };
        }
    },

    delete: async (id) => {
        try {
            await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.warn('⚠️ Gagal menghapus dari cloud:', err.message);
        }
    },

    syncLocalToServer: async () => {
        const localData = JSON.parse(localStorage.getItem('simrs_master_pasien') || '[]');
        if (localData.length === 0) return { message: 'Tidak ada data lokal untuk disinkronkan' };

        try {
            const res = await fetch(`${API_URL}/sync/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queue: localData })
            });
            return await res.json();
        } catch (err) {
            throw new Error('Gagal melakukan sinkronisasi: ' + err.message);
        }
    }
};

// Helper API Service untuk Antrian / Pendaftaran Poli
export const queueService = {
    getAll: async () => {
        try {
            const res = await fetch(`${API_URL}/queue`);
            if (!res.ok) throw new Error('Gagal mengambil antrian');
            const data = await res.json();
            return data.data;
        } catch (err) {
            return JSON.parse(localStorage.getItem('simrs_pendaftaran_poli') || '[]');
        }
    },
    create: async (queueData) => {
        const existing = JSON.parse(localStorage.getItem('simrs_pendaftaran_poli') || '[]');
        localStorage.setItem('simrs_pendaftaran_poli', JSON.stringify([...existing, queueData]));

        try {
            const res = await fetch(`${API_URL}/queue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queueData)
            });
            return await res.json();
        } catch (err) {
            return { status: 'offline', message: 'Tersimpan lokal' };
        }
    }
};

// Helper API Service untuk Dokter
export const doctorService = {
    getAll: async () => {
        try {
            const res = await fetch(`${API_URL}/doctors`);
            if (!res.ok) throw new Error('Gagal mengambil data dokter');
            const data = await res.json();
            return data.data;
        } catch (err) {
            return JSON.parse(localStorage.getItem('simrs_master_dokter') || '[]');
        }
    },
    create: async (doctorData) => {
        const existing = JSON.parse(localStorage.getItem('simrs_master_dokter') || '[]');
        localStorage.setItem('simrs_master_dokter', JSON.stringify([...existing, doctorData]));

        try {
            const res = await fetch(`${API_URL}/doctors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doctorData)
            });
            return await res.json();
        } catch (err) {
            return { status: 'offline', message: 'Tersimpan lokal' };
        }
    }
};

// Helper API Service untuk Departemen
export const departmentService = {
    getAll: async () => {
        try {
            const res = await fetch(`${API_URL}/departments`);
            if (!res.ok) throw new Error('Gagal mengambil data departemen');
            const data = await res.json();
            return data.data;
        } catch (err) {
            return JSON.parse(localStorage.getItem('simrs_master_poli') || '[]');
        }
    },
    create: async (departmentData) => {
        const existing = JSON.parse(localStorage.getItem('simrs_master_poli') || '[]');
        localStorage.setItem('simrs_master_poli', JSON.stringify([...existing, departmentData]));

        try {
            const res = await fetch(`${API_URL}/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(departmentData)
            });
            return await res.json();
        } catch (err) {
            return { status: 'offline', message: 'Tersimpan lokal' };
        }
    }
};
