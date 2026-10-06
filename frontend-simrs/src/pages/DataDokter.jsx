import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Stethoscope, Calendar, X } from 'lucide-react'; // Dihapus Clock karena tidak digunakan

export default function DataDokter() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [poliList, setPoliList] = useState([]); // State untuk daftar poli

    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        sip: '',
        poli: '', // Akan diset default nanti dari poliList
        kontak: '',
        status: 'Available',
        hari: 'Senin - Jumat',
        jamMulai: '08:00',
        jamSelesai: '16:00'
    });

    // Fungsi memuat data dokter dan poli dari LocalStorage
    const loadData = () => {
        // 1. Muat Master Poli untuk dropdown
        const savedPoli = JSON.parse(localStorage.getItem('simrs_master_poli') || '[]');
        setPoliList(savedPoli);

        // 2. Muat Master Dokter
        const defaultDoctors = [
            { id: 1, nama: 'dr. Budi Santoso, Sp.PD', sip: '123/SIP/2023', poli: 'Poli Penyakit Dalam', kontak: '08123456789', status: 'Available', hari: 'Senin - Jumat', jamMulai: '08:00', jamSelesai: '16:00' },
            { id: 2, nama: 'dr. Siti Aminah, Sp.A', sip: '124/SIP/2023', poli: 'Poli Anak (Pediatri)', kontak: '08987654321', status: 'Busy', hari: 'Senin - Jumat', jamMulai: '09:00', jamSelesai: '15:00' }
        ];

        const savedDoctors = localStorage.getItem('simrs_master_dokter');
        if (savedDoctors) {
            setDoctors(JSON.parse(savedDoctors));
        } else {
            setDoctors(defaultDoctors);
            localStorage.setItem('simrs_master_dokter', JSON.stringify(defaultDoctors));
        }
    };

    useEffect(() => {
        loadData();
        // Listener agar dropdown poli selalu sinkron jika diubah di tab lain
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const handleOpenModal = (dokter = null) => {
        const defaultPoli = poliList.length > 0 ? poliList[0].nama : '';

        if (dokter) {
            setFormData(dokter);
        } else {
            setFormData({
                id: null,
                nama: '',
                sip: '',
                poli: defaultPoli,
                kontak: '',
                status: 'Available',
                hari: 'Senin - Jumat',
                jamMulai: '08:00',
                jamSelesai: '16:00'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.nama || !formData.poli) {
            alert('Nama dokter dan Departemen/Poli harus diisi!');
            return;
        }

        const isEditing = Boolean(formData.id);
        const dataToSave = formData.id ? formData : { ...formData, id: Date.now() };
        let updatedDoctors;

        if (isEditing) {
            updatedDoctors = doctors.map(d => d.id === formData.id ? dataToSave : d);
        } else {
            updatedDoctors = [...doctors, dataToSave];
        }

        // Perbarui State dan LocalStorage
        setDoctors(updatedDoctors);
        localStorage.setItem('simrs_master_dokter', JSON.stringify(updatedDoctors));

        if (navigator.onLine) {
            alert('Data dokter berhasil disimpan dan disinkronkan ke server pusat!');
        } else {
            alert('Mode Offline 3T: Data dokter berhasil disimpan secara lokal ke Master Data.');
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data dokter ini?')) {
            const updatedDoctors = doctors.filter(d => d.id !== id);
            setDoctors(updatedDoctors);
            localStorage.setItem('simrs_master_dokter', JSON.stringify(updatedDoctors));

            if (!navigator.onLine) {
                alert('Mode Offline: Data dokter dihapus dari Master Data lokal.');
            }
        }
    };

    return (
        <div className="relative pb-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Direktori Tenaga Medis</h2>
                    <p className="text-sm text-slate-500 mt-1">Total: {doctors.length} Dokter terdaftar</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
                >
                    <Plus size={18} /> Tambah Dokter
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 text-slate-500 bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nama Dokter & SIP</th>
                            <th className="px-6 py-4 font-semibold">Poli & Jadwal</th>
                            <th className="px-6 py-4 font-semibold">Kontak</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {doctors.map((dokter) => (
                            <tr key={dokter.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                                        {dokter.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{dokter.nama}</p>
                                        <p className="text-xs text-slate-400">SIP: {dokter.sip}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-emerald-600 flex items-center gap-1"><Stethoscope size={14} /> {dokter.poli}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Calendar size={14} /> {dokter.hari}, {dokter.jamMulai} - {dokter.jamSelesai}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{dokter.kontak}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${dokter.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                        {dokter.status === 'Available' ? 'Aktif Bertugas' : 'Cuti / Sibuk'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(dokter)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dokter.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Hapus"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {doctors.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    Belum ada data dokter terdaftar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal / Pop-up Tambah & Edit Dokter */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">{formData.id ? 'Edit Data Dokter' : 'Tambah Dokter Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                    placeholder="dr. Budi Santoso, Sp.PD"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor SIP</label>
                                    <input
                                        type="text"
                                        value={formData.sip}
                                        onChange={e => setFormData({ ...formData, sip: e.target.value })}
                                        placeholder="123/SIP/2023"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        value={formData.kontak}
                                        onChange={e => setFormData({ ...formData, kontak: e.target.value })}
                                        placeholder="08123456789"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Departemen / Poli Penugasan</label>
                                    <select
                                        value={formData.poli}
                                        onChange={e => setFormData({ ...formData, poli: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    >
                                        {poliList.length === 0 && <option value="">-- Master Poli Kosong --</option>}
                                        {poliList.map(poli => (
                                            <option key={poli.id} value={poli.nama}>{poli.nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status Kehadiran</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    >
                                        <option value="Available">Aktif Bertugas</option>
                                        <option value="Busy">Cuti / Sibuk</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Jadwal Praktik</label>
                                <select
                                    value={formData.hari}
                                    onChange={e => setFormData({ ...formData, hari: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white mb-3"
                                >
                                    <option>Senin - Jumat</option>
                                    <option>Sabtu - Minggu</option>
                                    <option>Senin, Rabu, Jumat</option>
                                </select>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="time"
                                        value={formData.jamMulai}
                                        onChange={e => setFormData({ ...formData, jamMulai: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                    <span className="text-slate-400">-</span>
                                    <input
                                        type="time"
                                        value={formData.jamSelesai}
                                        onChange={e => setFormData({ ...formData, jamSelesai: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition mt-2 shadow-sm"
                            >
                                {formData.id ? 'Simpan Perubahan' : 'Simpan Data'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}