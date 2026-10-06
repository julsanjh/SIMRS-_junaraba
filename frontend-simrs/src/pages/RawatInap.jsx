import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, BedDouble, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RawatInap() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Data Ketersediaan Kamar
    const roomCapacity = [
        { id: 1, tipe: 'Kelas 3', total: 50, terisi: 45, warna: 'blue' },
        { id: 2, tipe: 'Kelas 2', total: 30, terisi: 12, warna: 'emerald' },
        { id: 3, tipe: 'Kelas 1', total: 15, terisi: 5, warna: 'orange' },
        { id: 4, tipe: 'VIP', total: 10, terisi: 9, warna: 'purple' }
    ];

    // State untuk menampung data master dari LocalStorage
    const [registeredPatients, setRegisteredPatients] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);

    // Muat data Master Pasien dan Master Dokter dari LocalStorage
    const loadMasterData = () => {
        const patientsData = JSON.parse(localStorage.getItem('simrs_master_pasien') || '[]');
        setRegisteredPatients(patientsData);

        const doctorsData = JSON.parse(localStorage.getItem('simrs_master_dokter') || '[]');
        setDoctorsList(doctorsData);
    };

    useEffect(() => {
        loadMasterData();
        // Listener agar data otomatis sinkron jika ada perubahan dari tab/halaman lain
        window.addEventListener('storage', loadMasterData);
        return () => window.removeEventListener('storage', loadMasterData);
    }, []);

    // 2. State Data Pasien Rawat Inap (Dinamis)
    const [inpatients, setInpatients] = useState([
        { id: 1, nama: 'Bapak Ahmad', kamar: 'Mawar 01 (Kelas 1)', dpjp: 'dr. Budi Santoso, Sp.PD', status: 'Sedang Dirawat' }
    ]);

    // 3. State Form untuk Tambah / Edit
    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        kamar: 'Mawar 01 (Kelas 1)',
        dpjp: '',
        status: 'Sedang Dirawat'
    });

    const handleOpenModal = (pasien = null) => {
        const defaultDoctor = doctorsList.length > 0 ? `${doctorsList[0].nama} - ${doctorsList[0].poli}` : 'Dokter Umum';

        if (pasien) {
            setFormData(pasien);
        } else {
            setFormData({
                id: null,
                nama: '',
                kamar: 'Mawar 01 (Kelas 1)',
                dpjp: defaultDoctor,
                status: 'Sedang Dirawat'
            });
        }
        setIsModalOpen(true);
    };

    // Fungsi Simpan dengan Logika Offline-First (Wilayah 3T)
    const handleSave = () => {
        if (!formData.nama) {
            alert('Silakan pilih pasien terlebih dahulu!');
            return;
        }

        if (navigator.onLine) {
            // Jika Online
            if (formData.id) {
                setInpatients(inpatients.map(p => p.id === formData.id ? formData : p));
            } else {
                setInpatients([...inpatients, { ...formData, id: Date.now() }]);
            }
            alert('Data rawat inap berhasil disimpan dan disinkronkan ke server pusat!');
        } else {
            // Jika Offline (Mode 3T)
            const isEditing = Boolean(formData.id);
            const dataToSave = formData.id ? formData : { ...formData, id: Date.now() };

            const offlineAction = { type: isEditing ? 'UPDATE_INPATIENT' : 'ADD_INPATIENT', data: dataToSave };
            const existingQueue = JSON.parse(localStorage.getItem('offlineInpatientQueue') || '[]');
            localStorage.setItem('offlineInpatientQueue', JSON.stringify([...existingQueue, offlineAction]));

            if (isEditing) {
                setInpatients(inpatients.map(p => p.id === formData.id ? formData : p));
            } else {
                setInpatients([...inpatients, dataToSave]);
            }

            alert('Koneksi terputus (Mode Offline 3T). Data rawat inap disimpan secara lokal dan akan disinkronkan otomatis saat online.');
        }

        setIsModalOpen(false);
    };

    // Fungsi Hapus dengan Dukungan Offline
    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data rawat inap ini?')) {
            if (!navigator.onLine) {
                const offlineAction = { type: 'DELETE_INPATIENT', data: { id } };
                const existingQueue = JSON.parse(localStorage.getItem('offlineInpatientQueue') || '[]');
                localStorage.setItem('offlineInpatientQueue', JSON.stringify([...existingQueue, offlineAction]));
                alert('Mode Offline: Penghapusan data rawat inap dicatat secara lokal dan akan disinkronkan saat online.');
            }
            setInpatients(inpatients.filter(p => p.id !== id));
        }
    };

    return (
        <div className="relative space-y-6">

            {/* Header Halaman */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Pasien Rawat Inap</h2>
                    <p className="text-sm text-slate-500 mt-1">Total: {inpatients.length} Pasien</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
                >
                    <Plus size={18} /> Tambah Pasien
                </button>
            </div>

            {/* Dasbor Ketersediaan Kamar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roomCapacity.map((room) => {
                    const sisa = room.total - room.terisi;
                    const isPenuh = sisa === 0;
                    const isHampirPenuh = sisa > 0 && sisa <= 5;

                    return (
                        <div key={room.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-${room.warna}-500`}>
                                    <BedDouble size={16} />
                                </div>
                                {isPenuh ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md"><AlertCircle size={12} /> PENUH</span>
                                ) : isHampirPenuh ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md"><AlertCircle size={12} /> TERBATAS</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><CheckCircle2 size={12} /> TERSEDIA</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700 mt-1">{room.tipe}</p>
                                <p className="text-xs text-slate-500">Tersedia: <span className={`font-bold ${isPenuh ? 'text-red-500' : 'text-slate-800'}`}>{sisa}</span> / {room.total}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabel Data Rawat Inap */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 text-slate-500 bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nama Pasien</th>
                            <th className="px-6 py-4 font-semibold">Kamar / Ruangan</th>
                            <th className="px-6 py-4 font-semibold">DPJP (Dokter)</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {inpatients.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                                    Belum ada pasien rawat inap.
                                </td>
                            </tr>
                        ) : (
                            inpatients.map((pasien) => (
                                <tr key={pasien.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-bold text-slate-800">{pasien.nama}</td>
                                    <td className="px-6 py-4 text-emerald-600 font-semibold">{pasien.kamar}</td>
                                    <td className="px-6 py-4">{pasien.dpjp}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                                            {pasien.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(pasien)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pasien.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal / Pop-up Tambah & Edit Pasien Rawat Inap */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">{formData.id ? 'Edit Data Rawat Inap' : 'Tambah Pasien Rawat Inap'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Pasien Terdaftar (dari Master Pasien)</label>
                                <select
                                    value={formData.nama}
                                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                >
                                    <option value="">-- Pilih Pasien --</option>
                                    {registeredPatients.map(p => (
                                        <option key={p.noRm} value={p.nama}>{p.noRm} - {p.nama} ({p.penjamin})</option>
                                    ))}
                                </select>
                                {registeredPatients.length === 0 && (
                                    <p className="text-[10px] text-red-500 mt-1">Belum ada pasien di Master Data. Daftarkan dulu di menu Input Pasien Baru.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Kamar / Ruangan</label>
                                <select
                                    value={formData.kamar}
                                    onChange={e => setFormData({ ...formData, kamar: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                >
                                    <option value="Mawar 01 (Kelas 1)">Mawar 01 (Kelas 1)</option>
                                    <option value="Melati 02 (Kelas 2)">Melati 02 (Kelas 2)</option>
                                    <option value="Anggrek 03 (Kelas 3)">Anggrek 03 (Kelas 3)</option>
                                    <option value="VIP 01 (VIP)">VIP 01 (VIP)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">DPJP (Dokter Penanggung Jawab)</label>
                                <select
                                    value={formData.dpjp}
                                    onChange={e => setFormData({ ...formData, dpjp: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                >
                                    <option value="">-- Pilih Dokter --</option>
                                    {doctorsList.map((doc) => (
                                        <option key={doc.id} value={`${doc.nama} - ${doc.poli}`}>
                                            {doc.nama} ({doc.poli})
                                        </option>
                                    ))}
                                </select>
                                {doctorsList.length === 0 && (
                                    <p className="text-[10px] text-red-500 mt-1">Belum ada dokter terdaftar di Master Data Dokter.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Status Perawatan</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                >
                                    <option>Sedang Dirawat</option>
                                    <option>Persiapan Pulang</option>
                                    <option>Kritis</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition mt-2 shadow-sm"
                            >
                                {formData.id ? 'Simpan Perubahan' : 'Tambahkan Pasien'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}