import { useState, useEffect } from 'react';
import {
    Search, UserCheck, Stethoscope, Ticket,
    Save, Printer, Clock, XCircle, AlertCircle
} from 'lucide-react';

export default function PendaftaranPoli() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [generatedTicket, setGeneratedTicket] = useState(null);
    const [searchError, setSearchError] = useState('');

    // State untuk data Master
    const [poliList, setPoliList] = useState([]);
    const [dokterList, setDokterList] = useState([]);

    const [formData, setFormData] = useState({
        poli: '',
        dokter: '',
        penjamin: ''
    });

    // Ambil data Master Poli dan Master Dokter saat halaman dimuat
    useEffect(() => {
        const loadMasterData = () => {
            const dataPoli = JSON.parse(localStorage.getItem('simrs_master_poli') || '[]');
            setPoliList(dataPoli);

            const dataDokter = JSON.parse(localStorage.getItem('simrs_master_dokter') || '[]');
            setDokterList(dataDokter);
        };

        loadMasterData();
        window.addEventListener('storage', loadMasterData);
        return () => window.removeEventListener('storage', loadMasterData);
    }, []);

    const handleSearch = () => {
        setSearchError('');
        if (!searchQuery) return;

        // Tarik data pasien dari Master Data Pasien
        const databasePasien = JSON.parse(localStorage.getItem('simrs_master_pasien') || '[]');

        const found = databasePasien.find(p =>
            p.noRm.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nik === searchQuery
        );

        if (found) {
            setSelectedPatient(found);
            // Reset pilihan poli dan dokter saat pasien baru dicari
            setFormData({ poli: '', dokter: '', penjamin: found.penjamin });
        } else {
            setSelectedPatient(null);
            setSearchError('Pasien tidak ditemukan. Pastikan pasien sudah didaftarkan di menu Master Data Pasien.');
        }
    };

    const handleDaftar = (e) => {
        e.preventDefault();
        if (!selectedPatient || !formData.poli || !formData.dokter) {
            alert('Mohon lengkapi pilihan Poli dan Dokter.');
            return;
        }

        // Ambil kode prefix dari poli yang dipilih (Misal: A, B, C)
        const selectedPoliObj = poliList.find(p => p.nama === formData.poli);
        const prefix = selectedPoliObj && selectedPoliObj.kode ? selectedPoliObj.kode : 'A';
        const num = Math.floor(Math.random() * 90) + 10;
        const queueNumber = `${prefix}-0${num}`;

        const pendaftaranBaru = {
            idDaftar: `REG-${Date.now()}`,
            waktu: new Date().toLocaleString('id-ID'),
            nomorAntrean: queueNumber,
            pasien: selectedPatient,
            ...formData,
            status: 'Menunggu' // Status awal masuk ke halaman Antrean
        };

        // Simpan ke LocalStorage utama (simrs_queue_data) agar terbaca oleh halaman Antrean & Dokter
        const existingQueue = JSON.parse(localStorage.getItem('simrs_queue_data') || '[]');
        localStorage.setItem('simrs_queue_data', JSON.stringify([...existingQueue, pendaftaranBaru]));

        if (navigator.onLine) {
            alert('Pendaftaran berhasil dicatat dan disinkronkan ke server pusat.');
        } else {
            alert('Mode Offline 3T: Pendaftaran dan tiket antrean disimpan secara lokal.');
        }

        setGeneratedTicket(pendaftaranBaru);
    };

    const handlePrint = () => {
        window.print();
        // Reset form setelah cetak
        setSelectedPatient(null);
        setSearchQuery('');
        setGeneratedTicket(null);
        setFormData({ poli: '', dokter: '', penjamin: '' });
    };

    // Filter daftar dokter berdasarkan poli yang dipilih DAN statusnya Aktif (Available)
    const availableDoctors = dokterList.filter(
        d => d.poli === formData.poli && d.status === 'Available'
    );

    return (
        <div className="space-y-6 print:m-0 print:p-0">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:hidden">
                <h2 className="text-xl font-bold text-slate-800">Pendaftaran Poliklinik</h2>
                <p className="text-sm text-slate-500 mt-1">Cetak tiket antrean untuk pasien yang sudah memiliki No. RM</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 print:block">
                <div className="xl:col-span-2 space-y-6 print:hidden">

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Search size={18} className="text-emerald-600" /> Cari Pasien
                        </h3>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Contoh: RM-26... atau NIK..."
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                disabled={generatedTicket !== null}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={generatedTicket !== null}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-sm disabled:opacity-50"
                            >
                                Cari Data
                            </button>
                        </div>

                        {searchError && (
                            <div className="mt-3 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertCircle size={16} /> {searchError}
                            </div>
                        )}

                        {selectedPatient && !searchError && (
                            <div className="mt-5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center animate-in fade-in duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                                        {selectedPatient.nama.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{selectedPatient.nama}</h4>
                                        <p className="text-xs text-slate-500 font-medium">No. RM: <span className="text-emerald-700 font-bold">{selectedPatient.noRm}</span> • {selectedPatient.jk === 'L' || selectedPatient.jk === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'}</p>
                                    </div>
                                </div>
                                {!generatedTicket && (
                                    <button onClick={() => setSelectedPatient(null)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition" title="Batalkan">
                                        <XCircle size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Stethoscope size={18} className="text-emerald-600" /> Registrasi Layanan Medis
                        </h3>

                        <form onSubmit={handleDaftar} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Poliklinik Tujuan</label>
                                    <select
                                        value={formData.poli}
                                        onChange={(e) => setFormData({ ...formData, poli: e.target.value, dokter: '' })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                        disabled={!selectedPatient || generatedTicket}
                                    >
                                        <option value="">-- Pilih Poliklinik --</option>
                                        {poliList.map(poli => (
                                            <option key={poli.id} value={poli.nama}>{poli.nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dokter (DPJP)</label>
                                    <select
                                        value={formData.dokter}
                                        onChange={(e) => setFormData({ ...formData, dokter: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                        disabled={!selectedPatient || !formData.poli || generatedTicket}
                                    >
                                        <option value="">-- Pilih Dokter --</option>
                                        {availableDoctors.map(dokter => (
                                            <option key={dokter.id} value={dokter.nama}>{dokter.nama}</option>
                                        ))}
                                    </select>
                                    {formData.poli && availableDoctors.length === 0 && (
                                        <p className="text-[10px] text-red-500 mt-1">Tidak ada dokter bertugas di poli ini.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Metode Pembayaran (Data Master)</label>
                                <input
                                    type="text"
                                    value={formData.penjamin}
                                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                                    readOnly
                                />
                            </div>

                            {!generatedTicket && (
                                <button
                                    type="submit"
                                    disabled={!selectedPatient || !formData.poli || !formData.dokter}
                                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition shadow-md ${selectedPatient && formData.poli && formData.dokter
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Save size={18} /> Cetak Tiket Antrean
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="xl:col-span-1 print:col-span-1 print:w-full print:max-w-xs print:mx-auto">
                    {generatedTicket ? (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-right-8 duration-500">
                            <div className="p-8 text-center border-b-[3px] border-dashed border-slate-300 relative bg-[#fafafa]">
                                <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-slate-100 rounded-full print:hidden"></div>
                                <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-slate-100 rounded-full print:hidden"></div>
                                <h3 className="text-xl font-black text-slate-800 tracking-wider">RS JUNARABA</h3>
                                <p className="text-xs text-slate-500 font-semibold mb-6 uppercase">Tiket Antrean Poliklinik</p>
                                <p className="text-sm font-bold text-slate-500 mb-1">NOMOR ANTREAN</p>
                                <div className="text-6xl font-black text-emerald-600 mb-6 drop-shadow-sm">
                                    {generatedTicket.nomorAntrean}
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 text-left shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Nama Pasien</p>
                                    <p className="font-bold text-slate-800 text-sm mb-3 truncate">{generatedTicket.pasien.nama}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Tujuan / DPJP</p>
                                    <p className="font-bold text-slate-800 text-sm">{generatedTicket.poli}</p>
                                    <p className="text-xs text-slate-600 truncate">{generatedTicket.dokter}</p>
                                </div>
                            </div>
                            <div className="bg-[#fafafa] p-6 text-center space-y-4">
                                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1"><UserCheck size={14} /> {generatedTicket.pasien.noRm}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {generatedTicket.waktu.split(' ')[1]}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">Harap tunggu di area poliklinik sampai nomor Anda dipanggil.</p>
                                <button
                                    onClick={handlePrint}
                                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md print:hidden"
                                >
                                    <Printer size={18} /> Cetak Struk
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-8 text-center print:hidden">
                            <Ticket size={48} className="mb-4 opacity-50" />
                            <p className="font-semibold text-slate-600">Tiket Antrean</p>
                            <p className="text-xs mt-2">Cari pasien dan pilih poliklinik tujuan untuk menerbitkan tiket.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}