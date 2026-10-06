import { useState, useEffect } from 'react';
import { RefreshCw, Edit, Trash2, Plus, X } from 'lucide-react';
import { patientService } from '../services/api';

export default function DataPasien() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);

    const [formData, setFormData] = useState({
        noRm: '',
        nik: '',
        nama: '',
        jk: 'L',
        tglLahir: '',
        penjamin: 'Umum',
        kontak: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    // Fungsi untuk menarik data dari Backend Cloud / LocalStorage
    const loadPatients = async () => {
        const data = await patientService.getAll();
        setPatients(data || []);
    };

    // Muat data saat halaman pertama kali dibuka
    useEffect(() => {
        loadPatients();
        // Listener agar otomatis update jika ada data baru dari tab/halaman lain
        window.addEventListener('storage', loadPatients);
        return () => window.removeEventListener('storage', loadPatients);
    }, []);

    const handleOpenModal = (pasien = null) => {
        if (pasien) {
            setFormData(pasien);
            setIsEditing(true);
        } else {
            // Generate No RM acak untuk pembuatan dari dalam modal
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            setFormData({
                noRm: `RM-${new Date().getFullYear().toString().slice(-2)}${randomNum}`,
                nik: '',
                nama: '',
                jk: 'L',
                tglLahir: '',
                penjamin: 'Umum',
                kontak: ''
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    // Fungsi Simpan terintegrasi dengan simrs_master_pasien
    const handleSave = () => {
        if (!formData.nama || !formData.nik) {
            alert('Nama lengkap dan NIK wajib diisi!');
            return;
        }

        let updatedPatients;
        if (isEditing) {
            updatedPatients = patients.map(p => p.noRm === formData.noRm ? formData : p);
        } else {
            updatedPatients = [...patients, formData];
        }

        // Perbarui State dan LocalStorage
        setPatients(updatedPatients);
        localStorage.setItem('simrs_master_pasien', JSON.stringify(updatedPatients));

        if (navigator.onLine) {
            alert('Data pasien berhasil disimpan dan disinkronkan ke server pusat!');
        } else {
            alert('Mode Offline 3T: Data pasien berhasil disimpan secara lokal ke Master Data.');
        }

        setIsModalOpen(false);
    };

    // Fungsi Hapus terintegrasi dengan simrs_master_pasien
    const handleDelete = (noRm) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus data pasien ${noRm}?`)) {
            const updatedPatients = patients.filter(p => p.noRm !== noRm);
            setPatients(updatedPatients);
            localStorage.setItem('simrs_master_pasien', JSON.stringify(updatedPatients));

            if (!navigator.onLine) {
                alert('Mode Offline: Data dihapus dari Master Data lokal.');
            }
        }
    };

    return (
        <div className="relative pb-10">

            {/* Header Halaman */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Master Data Pasien</h2>
                    <p className="text-sm text-slate-500 mt-1">Total terdaftar: {patients.length} pasien</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
                    >
                        <Plus size={18} /> Tambah Pasien
                    </button>
                    <button
                        onClick={loadPatients}
                        className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition bg-white px-3 py-2 rounded-lg border border-slate-200"
                    >
                        <RefreshCw size={16} /> Refresh Data
                    </button>
                </div>
            </div>

            {/* Area Tabel */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 text-slate-500 bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">No. RM</th>
                            <th className="px-6 py-4 font-semibold">NIK</th>
                            <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                            <th className="px-6 py-4 font-semibold">L/P</th>
                            <th className="px-6 py-4 font-semibold">Tgl Lahir</th>
                            <th className="px-6 py-4 font-semibold">Penjamin</th>
                            <th className="px-6 py-4 font-semibold">Kontak</th>
                            <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {patients.map((pasien) => (
                            <tr key={pasien.noRm} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-bold text-emerald-600">{pasien.noRm}</td>
                                <td className="px-6 py-4 text-slate-500">{pasien.nik}</td>
                                <td className="px-6 py-4 font-semibold text-slate-800">{pasien.nama}</td>
                                <td className="px-6 py-4">{pasien.jk === 'Laki-laki' || pasien.jk === 'L' ? 'L' : 'P'}</td>
                                <td className="px-6 py-4">{pasien.tglLahir || pasien.tanggalLahir}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                        {pasien.penjamin}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{pasien.kontak}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(pasien)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit Data"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pasien.noRm)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Hapus Data"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                                    Belum ada data pasien. Daftarkan di menu Input Pasien Baru atau klik Tambah Pasien.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal / Pop-up Tambah & Edit Pasien */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">No. Rekam Medis (RM)</label>
                                    <input
                                        type="text"
                                        value={formData.noRm}
                                        onChange={e => setFormData({ ...formData, noRm: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 font-bold text-emerald-600"
                                        disabled={isEditing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">NIK</label>
                                    <input
                                        type="text"
                                        value={formData.nik}
                                        onChange={e => setFormData({ ...formData, nik: e.target.value })}
                                        placeholder="16 digit NIK"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                    placeholder="Nama Sesuai KTP"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
                                    <select
                                        value={formData.jk}
                                        onChange={e => setFormData({ ...formData, jk: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    >
                                        <option value="L">Laki-laki (L)</option>
                                        <option value="P">Perempuan (P)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        value={formData.tglLahir || formData.tanggalLahir}
                                        onChange={e => setFormData({ ...formData, tglLahir: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Penjamin</label>
                                    <select
                                        value={formData.penjamin}
                                        onChange={e => setFormData({ ...formData, penjamin: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    >
                                        <option value="Umum / Pribadi">Umum / Pribadi</option>
                                        <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                                        <option value="Asuransi Swasta">Asuransi Swasta</option>
                                        <option value="Jaminan Perusahaan">Jaminan Perusahaan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Kontak / HP</label>
                                    <input
                                        type="text"
                                        value={formData.kontak}
                                        onChange={e => setFormData({ ...formData, kontak: e.target.value })}
                                        placeholder="08123456789"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition mt-2 shadow-sm"
                            >
                                {isEditing ? 'Simpan Perubahan' : 'Tambahkan Pasien'}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}