// PERBAIKAN: Menambahkan useEffect pada import react
import { useState, useEffect } from 'react';
import { Plus, X, Clock, Edit, Trash2, Building, Users, Activity, CheckCircle } from 'lucide-react';

export default function Departemen() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departments, setDepartments] = useState([]);

    // Muat data dari LocalStorage
    const loadPoli = () => {
        // Data default awal jika aplikasi baru dijalankan (termasuk kode antrean)
        const defaultData = [
            { id: 1, nama: 'Poli Penyakit Dalam', kategori: 'Poli / Klinik', deskripsi: 'Layanan spesialisasi organ dalam.', jadwal: 'Senin - Jumat', jamMulai: '08:00', jamSelesai: '16:00', kode: 'A', stats: { sedang: 3, antri: 5, selesai: 12 } },
            { id: 2, nama: 'Poli Anak (Pediatri)', kategori: 'Poli / Klinik', deskripsi: 'Layanan kesehatan anak.', jadwal: 'Senin - Jumat', jamMulai: '08:00', jamSelesai: '15:00', kode: 'B', stats: { sedang: 2, antri: 4, selesai: 15 } },
            { id: 3, nama: 'Poli Jantung', kategori: 'Poli / Klinik', deskripsi: 'Penanganan kardiovaskular.', jadwal: 'Senin - Kamis', jamMulai: '08:00', jamSelesai: '16:00', kode: 'C', stats: { sedang: 1, antri: 2, selesai: 8 } }
        ];

        const data = localStorage.getItem('simrs_master_poli');
        if (data) {
            setDepartments(JSON.parse(data));
        } else {
            setDepartments(defaultData);
            localStorage.setItem('simrs_master_poli', JSON.stringify(defaultData));
        }
    };

    useEffect(() => {
        loadPoli();
    }, []);

    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        kode: '',
        kategori: 'Poli / Klinik',
        deskripsi: '',
        jadwal: 'Senin - Jumat',
        jamMulai: '08:00',
        jamSelesai: '16:00',
        stats: { sedang: 0, antri: 0, selesai: 0 }
    });

    // Membuka modal
    const handleOpenModal = (dept = null) => {
        if (dept) setFormData(dept);
        else setFormData({ id: null, nama: '', kode: '', kategori: 'Poli / Klinik', deskripsi: '', jadwal: 'Senin - Jumat', jamMulai: '08:00', jamSelesai: '16:00', stats: { sedang: 0, antri: 0, selesai: 0 } });
        setIsModalOpen(true);
    };

    // Fungsi Simpan dengan Logika Offline-First (Wilayah 3T)
    const handleSave = () => {
        if (!formData.nama || !formData.kode) {
            alert('Nama Poli dan Kode Prefix Antrean harus diisi!');
            return;
        }

        let updatedDepartments;
        if (formData.id) {
            updatedDepartments = departments.map(d => d.id === formData.id ? formData : d);
        } else {
            updatedDepartments = [...departments, { ...formData, id: Date.now() }];
        }

        setDepartments(updatedDepartments);
        localStorage.setItem('simrs_master_poli', JSON.stringify(updatedDepartments));

        alert('Data departemen/poli berhasil disimpan!');
        setIsModalOpen(false);
    };

    // Fungsi Hapus dengan Dukungan Offline
    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus poli ini?')) {
            const updatedDepartments = departments.filter(d => d.id !== id);
            setDepartments(updatedDepartments);
            localStorage.setItem('simrs_master_poli', JSON.stringify(updatedDepartments));
        }
    };

    return (
        <div className="relative space-y-6">

            {/* Header Halaman */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Departemen & Poli</h2>
                <p className="text-sm text-slate-500 mb-6">Kelola informasi layanan medis SIM RS JUNARABA</p>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
                >
                    <Plus size={18} /> Tambah Poli / Unit
                </button>
            </div>

            {/* Grid Data Departemen */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                    <Building size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{dept.nama}</h3>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600">{dept.kategori}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{dept.deskripsi}</p>

                        {/* Statistik Pasien Hari Ini */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-center">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Sedang Diperiksa</p>
                                <p className="text-base font-bold text-blue-600 flex items-center justify-center gap-1 mt-0.5">
                                    <Activity size={14} /> {dept.stats?.sedang || 0}
                                </p>
                            </div>
                            <div className="border-x border-slate-200">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Akan Diperiksa</p>
                                <p className="text-base font-bold text-amber-600 flex items-center justify-center gap-1 mt-0.5">
                                    <Users size={14} /> {dept.stats?.antri || 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Selesai</p>
                                <p className="text-base font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                                    <CheckCircle size={14} /> {dept.stats?.selesai || 0}
                                </p>
                            </div>
                        </div>

                        {/* Bagian Bawah Kartu */}
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                <Clock size={14} className="shrink-0" />
                                <span>{dept.jadwal}, {dept.jamMulai} - {dept.jamSelesai}</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleOpenModal(dept)}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Edit Poli"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Hapus Poli"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal / Pop-up Tambah & Edit Poli */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">{formData.id ? 'Edit Poli' : 'Tambah Layanan/Poli'}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Poli / Layanan</label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    placeholder="Cth: Poli Mata"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Kode Prefix Antrean</label>
                                <input
                                    type="text"
                                    maxLength="1"
                                    value={formData.kode || ''}
                                    onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                                    placeholder="Contoh: A, B, atau C"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm font-bold uppercase"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Satu huruf. Antrean akan menjadi: A-01, A-02, dst.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Layanan</label>
                                <textarea
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    placeholder="Jelaskan spesialisasi..."
                                    rows="3"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
                                <select
                                    value={formData.kategori}
                                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                >
                                    <option>Poli / Klinik</option>
                                    <option>Instalasi Gawat Darurat</option>
                                    <option>Rawat Inap</option>
                                    <option>Penunjang Medis</option>
                                </select>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Jadwal Operasional</label>
                                <select
                                    value={formData.jadwal}
                                    onChange={(e) => setFormData({ ...formData, jadwal: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white mb-3"
                                >
                                    <option>Senin - Jumat</option>
                                    <option>Senin - Sabtu</option>
                                    <option>Setiap Hari (24 Jam)</option>
                                </select>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="time"
                                            value={formData.jamMulai}
                                            onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                                            className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                        />
                                        <Clock size={14} className="absolute right-3 top-2.5 text-slate-400" />
                                    </div>
                                    <span className="text-slate-400">-</span>
                                    <div className="relative flex-1">
                                        <input
                                            type="time"
                                            value={formData.jamSelesai}
                                            onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                                            className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                        />
                                        <Clock size={14} className="absolute right-3 top-2.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition mt-2 shadow-sm"
                            >
                                {formData.id ? 'Simpan Perubahan' : 'Tambahkan Data'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}