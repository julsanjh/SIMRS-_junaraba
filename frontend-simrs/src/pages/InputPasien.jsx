import { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/api';

export default function InputPasien() {
    const navigate = useNavigate();

    // State untuk menampung data formulir input pasien
    const [formData, setFormData] = useState({
        nik: '',
        nama: '',
        tempatLahir: '',
        tanggalLahir: '',
        jk: 'Laki-laki',
        kontak: '',
        alamat: '',
        penjamin: 'Umum / Pribadi',
        namaWali: '',
        noHpWali: ''
    });

    // Fungsi simpan Master Data
    const handleSaveData = async (e) => {
        e.preventDefault(); // Mencegah halaman reload otomatis

        // Validasi sederhana
        if (!formData.nik || !formData.nama) {
            alert('NIK dan Nama Lengkap wajib diisi!');
            return;
        }

        // Generate Nomor RM otomatis (Misal: RM-2610-XXX)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const noRm = `RM-${new Date().getFullYear().toString().slice(-2)}${randomNum}`;

        // Bungkus data pasien baru beserta nomor Rekam Medis otomatis
        const newPatient = {
            noRm: noRm,
            ...formData,
            timestamp: new Date().toISOString()
        };

        // Simpan ke API Backend Cloud & LocalStorage Fallback
        await patientService.create(newPatient);

        alert(`Pasien berhasil didaftarkan!\nNomor RM: ${noRm}\nData disinkronkan ke Database Cloud.`);

        // Reset formulir
        setFormData({
            nik: '',
            nama: '',
            tempatLahir: '',
            tanggalLahir: '',
            jk: 'Laki-laki',
            kontak: '',
            alamat: '',
            penjamin: 'Umum / Pribadi',
            namaWali: '',
            noHpWali: ''
        });

        // Arahkan otomatis ke halaman Pendaftaran Poli (Layanan Kunjungan)
        navigate('/dasbor/pendaftaran-poli');
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

                {/* Header Formulir */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Formulir Pendaftaran Pasien (Standar RS Tipe A)</h2>
                </div>

                {/* Form dihubungkan dengan onSubmit={handleSaveData} */}
                <form onSubmit={handleSaveData} className="space-y-8">

                    {/* Section: Identitas Kependudukan */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">Identitas Kependudukan</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.nik}
                                    onChange={e => setFormData({ ...formData, nik: e.target.value })}
                                    placeholder="16 digit NIK KTP"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                    placeholder="Nama Lengkap"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Tempat/Tanggal Lahir <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.tempatLahir}
                                        onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })}
                                        placeholder="Tempat"
                                        className="w-1/3 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                    <input
                                        type="date"
                                        value={formData.tanggalLahir}
                                        onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })}
                                        className="w-2/3 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Jenis Kelamin <span className="text-red-500">*</span></label>
                                <select
                                    value={formData.jk}
                                    onChange={e => setFormData({ ...formData, jk: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                >
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Nomor HP / WhatsApp <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    value={formData.kontak}
                                    onChange={e => setFormData({ ...formData, kontak: e.target.value })}
                                    placeholder="08xxx"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Alamat Domisili <span className="text-red-500">*</span></label>
                                <textarea
                                    value={formData.alamat}
                                    onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                                    placeholder="Alamat lengkap..."
                                    rows="2"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white resize-y"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section: Data Penjamin / Asuransi */}
                    <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-5">Data Penjamin / Asuransi</h3>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Jenis Penjamin <span className="text-red-500">*</span></label>
                            <select
                                value={formData.penjamin}
                                onChange={e => setFormData({ ...formData, penjamin: e.target.value })}
                                className="w-full md:w-1/2 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 text-sm bg-white"
                            >
                                <option>Umum / Pribadi</option>
                                <option>BPJS Kesehatan</option>
                                <option>Asuransi Swasta</option>
                                <option>Jaminan Perusahaan</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Nama Wali / Kontak Darurat</label>
                                <input
                                    type="text"
                                    value={formData.namaWali}
                                    onChange={e => setFormData({ ...formData, namaWali: e.target.value })}
                                    placeholder="Nama Kerabat"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">No HP Wali</label>
                                <input
                                    type="tel"
                                    value={formData.noHpWali}
                                    onChange={e => setFormData({ ...formData, noHpWali: e.target.value })}
                                    placeholder="08xxx"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 text-sm bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tombol Simpan dengan tipe submit */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-700 transition shadow-md flex justify-center items-center gap-2 mt-4"
                    >
                        <Save size={20} /> SIMPAN DATA PASIEN
                    </button>

                </form>
            </div>
        </div>
    );
}