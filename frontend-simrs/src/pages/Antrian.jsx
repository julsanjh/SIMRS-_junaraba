import { useState, useEffect } from 'react';
import {
    Volume2, MonitorPlay, X, Users, BellRing,
    SkipForward, SkipBack, XCircle, CheckCircle2, History
} from 'lucide-react';

export default function Antrian() {
    const [isTvMode, setIsTvMode] = useState(false);

    // State 1: Antrean yang saat ini sedang dipanggil
    const [currentCall, setCurrentCall] = useState(null);

    const [waitingList, setWaitingList] = useState([]);
    const [history, setHistory] = useState([]);

    // Tarik data dari LocalStorage yang diisi oleh Pendaftaran Poli
    const fetchQueue = () => {
        const data = JSON.parse(localStorage.getItem('simrs_queue_data') || '[]');
        setWaitingList(data.filter(item => item.status === 'Menunggu'));
        setHistory(data.filter(item => item.status === 'Selesai' || item.status === 'Dilewati'));

        // Mempertahankan panggilan yang sedang aktif di layar jika direfresh
        const dipanggil = data.find(item => item.status === 'Dipanggil');
        if (dipanggil && !currentCall) {
            setCurrentCall({
                ...dipanggil,
                loket: 'LOKET ' + (Math.floor(Math.random() * 3) + 1)
            });
        }
    };

    useEffect(() => {
        fetchQueue();
        // Mendengarkan perubahan data jika pendaftaran dilakukan di tab/jendela lain
        window.addEventListener('storage', fetchQueue);
        return () => window.removeEventListener('storage', fetchQueue);
    }, []);

    // Fungsi untuk mengubah status pasien (Menunggu -> Dipanggil -> Selesai)
    const updatePatientStatus = (idDaftar, newStatus) => {
        const data = JSON.parse(localStorage.getItem('simrs_queue_data') || '[]');
        const updated = data.map(item => item.idDaftar === idDaftar ? { ...item, status: newStatus } : item);
        localStorage.setItem('simrs_queue_data', JSON.stringify(updated));
        fetchQueue(); // Refresh tampilan setelah update status
    };

    // Fungsi Fullscreen Mode TV
    const toggleTvMode = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                setIsTvMode(true);
            } else {
                await document.exitFullscreen();
                setIsTvMode(false);
            }
        } catch (err) {
            console.error("Gagal beralih ke layar penuh:", err);
            setIsTvMode(!isTvMode);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) setIsTvMode(false);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Web Speech API (Suara Panggilan)
    const panggilSuara = (nomor, loket) => {
        if (!nomor) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const nomorDieja = nomor.split('').join(' ').replace('-', '');
            const teksPanggilan = `Nomor antrean, ${nomorDieja}, silakan menuju ke, ${loket}`;
            const utterance = new SpeechSynthesisUtterance(teksPanggilan);
            utterance.lang = 'id-ID';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Browser tidak mendukung fitur suara.");
        }
    };

    // --- LOGIKA MANAJEMEN ANTREAN PROFESIONAL ---

    // 1. Panggil Pasien Manual dari Tabel
    const handlePanggilManual = (antrian) => {
        // Jika ada panggilan sebelumnya, ubah statusnya menjadi Selesai agar masuk ke riwayat
        if (currentCall && currentCall.idDaftar) {
            updatePatientStatus(currentCall.idDaftar, 'Selesai');
        }

        const loketAcak = 'LOKET ' + (Math.floor(Math.random() * 3) + 1);

        // Membentuk objek panggilan baru, mengambil data dari antrian yang diklik
        const newCall = {
            ...antrian, // membawa properti asli dari simrs_queue_data
            loket: loketAcak
        };

        setCurrentCall(newCall);

        // Lempar pasien ke Pemeriksaan Dokter dengan mengubah statusnya di LocalStorage
        updatePatientStatus(antrian.idDaftar, 'Dipanggil');
        panggilSuara(newCall.nomorAntrean, newCall.loket); // Memanggil dengan nomorAntrean yang benar
    };

    // 2. Panggil Antrean Selanjutnya (Berdasarkan urutan teratas)
    const handleNext = () => {
        if (waitingList.length === 0) {
            alert('Antrean sudah habis.');
            return;
        }
        // Panggil pasien teratas di daftar tunggu menggunakan fungsi manual yang sudah kita sesuaikan
        handlePanggilManual(waitingList[0]);
    };

    // 3. Kembali ke Antrean Sebelumnya
    const handlePrevious = () => {
        if (history.length === 0) {
            alert('Tidak ada riwayat antrean sebelumnya.');
            return;
        }

        const previousPatient = history[history.length - 1]; // Ambil data riwayat terakhir

        // Kembalikan currentCall saat ini ke status Menunggu (masuk lagi ke daftar tunggu)
        if (currentCall && currentCall.idDaftar) {
            updatePatientStatus(currentCall.idDaftar, 'Menunggu');
        }

        // Set status pasien riwayat terakhir menjadi Dipanggil
        updatePatientStatus(previousPatient.idDaftar, 'Dipanggil');

        const newCall = {
            ...previousPatient,
            loket: previousPatient.loket || 'LOKET ' + (Math.floor(Math.random() * 3) + 1)
        };

        setCurrentCall(newCall);
        panggilSuara(newCall.nomorAntrean, newCall.loket);
    };

    // 4. Lewati Antrean (Skip) - Pasien tidak datang
    const handleSkip = () => {
        if (!currentCall || !currentCall.idDaftar) {
            alert('Tidak ada pasien yang sedang dipanggil saat ini.');
            return;
        }

        // Ubah status pasien saat ini menjadi Dilewati
        updatePatientStatus(currentCall.idDaftar, 'Dilewati');
        setCurrentCall(null);

        // Langsung panggil pasien selanjutnya jika ada
        if (waitingList.length > 0) {
            handleNext();
        }
    };

    // 5. Selesai Semua (Tutup Panggilan Saat Ini)
    const handleSelesaiSemua = () => {
        if (currentCall && currentCall.idDaftar) {
            updatePatientStatus(currentCall.idDaftar, 'Selesai');
            setCurrentCall(null);
            alert('Sesi panggilan untuk pasien ini diselesaikan.');
        } else {
            alert('Tidak ada panggilan aktif untuk diselesaikan.');
        }
    };

    return (
        <div className="space-y-6">

            {/* ========================================== */}
            {/* RENDER 1: TAMPILAN MODE TV (FULLSCREEN)    */}
            {/* ========================================== */}
            {isTvMode && (
                <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col font-sans overflow-hidden animate-in fade-in duration-500">
                    <div className="bg-[#1a2234] border-b border-slate-800 p-6 flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg">RS</div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-wider">RS JUNARABA</h1>
                                <p className="text-emerald-400 font-semibold tracking-widest text-sm uppercase">Sistem Antrean Poliklinik</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-right">
                            <div>
                                <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Tanggal & Waktu</p>
                                <p className="text-white font-bold text-xl">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <button onClick={toggleTvMode} className="p-3 bg-slate-800 text-slate-400 rounded-full hover:bg-red-500 hover:text-white transition opacity-20 hover:opacity-100" title="Keluar Layar Penuh">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex bg-slate-900">
                        <div className="flex-[2] p-12 flex flex-col justify-center items-center text-center border-r border-slate-800 relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                            <div className="animate-pulse mb-8"><BellRing size={64} className="text-emerald-400 mx-auto" /></div>
                            <h2 className="text-3xl font-bold text-slate-400 uppercase tracking-widest mb-4">Nomor Antrean</h2>
                            {/* Pemanggilan Data: nomorAntrean */}
                            <div className="text-[12rem] leading-none font-black text-white tracking-tighter drop-shadow-2xl mb-6">{currentCall?.nomorAntrean || '-'}</div>
                            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-3xl px-12 py-4 mb-8">
                                <h3 className="text-5xl font-bold text-emerald-400">{currentCall?.loket || '-'}</h3>
                            </div>
                            <p className="text-3xl font-semibold text-slate-300">{currentCall?.poli || 'Menunggu Pasien'}</p>
                        </div>

                        <div className="flex-1 bg-[#1a2234]/50 p-8 flex flex-col">
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-slate-700 pb-4">
                                <Users size={28} className="text-emerald-400" /> Antrean Selanjutnya
                            </h3>
                            <div className="space-y-4">
                                {waitingList.slice(0, 5).map((item, index) => (
                                    <div key={item.idDaftar || index} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex justify-between items-center shadow-md">
                                        <div>
                                            <p className="text-slate-400 text-sm font-semibold uppercase">{item.poli}</p>
                                            {/* Pemanggilan Data: nomorAntrean */}
                                            <p className="text-4xl font-bold text-white mt-1">{item.nomorAntrean}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-bold">Menunggu</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-600 text-white font-bold text-xl py-4 overflow-hidden whitespace-nowrap shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
                        <div className="inline-block animate-[marquee_20s_linear_infinite]">
                            Selamat Datang di RS JUNARABA • Siapkan Kartu Identitas dan Kartu Penjamin Anda Sebelum Menuju Loket • Tetap Patuhi Protokol Kesehatan
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* RENDER 2: TAMPILAN ADMIN (MANAJEMEN)       */}
            {/* ========================================== */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Manajemen Antrean</h2>
                    <p className="text-sm text-slate-500 mt-1">Sistem kendali panggil pasien poliklinik</p>
                </div>
                <button onClick={toggleTvMode} className="flex items-center gap-2 bg-slate-900 text-emerald-400 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-md">
                    <MonitorPlay size={20} />
                    <span>Buka Display TV</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Panel Kendali Utama */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-md p-8 text-white relative overflow-hidden">
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-sm mb-6">Status Panggilan Aktif</h3>
                        <div className="text-center mb-6">
                            {/* Pemanggilan Data: nomorAntrean */}
                            <p className="text-6xl font-black mb-2 text-emerald-400 drop-shadow-md">{currentCall?.nomorAntrean || '-'}</p>
                            <p className="text-xl font-bold text-white">{currentCall?.loket || '-'}</p>
                        </div>

                        <div className="space-y-3 bg-white/5 p-5 rounded-xl border border-white/10 mb-6">
                            <div><p className="text-xs text-slate-400">Poliklinik</p><p className="font-bold">{currentCall?.poli || '-'}</p></div>
                            {/* Pemanggilan Data: pasien.nama */}
                            <div><p className="text-xs text-slate-400">Nama Pasien</p><p className="font-bold">{currentCall?.pasien?.nama || '-'}</p></div>
                        </div>

                        <button
                            onClick={() => currentCall && panggilSuara(currentCall.nomorAntrean, currentCall.loket)}
                            className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-700 disabled:text-slate-500"
                            disabled={!currentCall}
                        >
                            <Volume2 size={20} /> Panggil Ulang Suara
                        </button>
                    </div>

                    {/* Tombol Kontrol Cepat */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 grid grid-cols-2 gap-3">
                        <button onClick={handlePrevious} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition border border-slate-200">
                            <SkipBack size={20} />
                            <span className="text-xs font-bold">Sebelumnya</span>
                        </button>
                        <button onClick={handleNext} className="flex flex-col items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 hover:text-emerald-800 transition border border-emerald-200">
                            <SkipForward size={20} />
                            <span className="text-xs font-bold">Selanjutnya</span>
                        </button>
                        <button onClick={handleSkip} className="flex flex-col items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition border border-amber-200">
                            <XCircle size={20} />
                            <span className="text-xs font-bold">Pasien Lewat</span>
                        </button>
                        <button onClick={handleSelesaiSemua} className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition border border-blue-200">
                            <CheckCircle2 size={20} />
                            <span className="text-xs font-bold">Selesai Semua</span>
                        </button>
                    </div>
                </div>

                {/* Tabel Daftar Tunggu & Riwayat */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-emerald-600" /> Daftar Tunggu</h3>
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{waitingList.length} Menunggu</span>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white text-slate-400 sticky top-0 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Nomor</th>
                                        <th className="px-6 py-3 font-semibold">Poliklinik</th>
                                        {/* Menambahkan Header Nama Pasien */}
                                        <th className="px-6 py-3 font-semibold">Nama Pasien</th>
                                        <th className="px-6 py-3 font-semibold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {waitingList.map((antrian) => (
                                        <tr key={antrian.idDaftar} className="hover:bg-slate-50 transition">
                                            {/* Pemanggilan Data: nomorAntrean */}
                                            <td className="px-6 py-3 font-bold text-slate-800 text-base">{antrian.nomorAntrean}</td>
                                            <td className="px-6 py-3 font-semibold text-slate-600">{antrian.poli}</td>
                                            {/* Pemanggilan Data: pasien.nama */}
                                            <td className="px-6 py-3 font-semibold text-slate-600">{antrian.pasien?.nama}</td>
                                            <td className="px-6 py-3 text-center">
                                                <button onClick={() => handlePanggilManual(antrian)} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-600 hover:text-white transition">
                                                    <Volume2 size={14} /> Panggil
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {waitingList.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Belum ada pasien yang masuk daftar tunggu.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabel Riwayat Panggilan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col opacity-80">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-600 flex items-center gap-2"><History size={16} /> Riwayat Panggilan</h3>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <tbody className="divide-y divide-slate-100">
                                    {history.slice().reverse().map((item) => (
                                        <tr key={item.idDaftar} className="text-slate-500 hover:bg-slate-50">
                                            {/* Pemanggilan Data: nomorAntrean */}
                                            <td className="px-6 py-3 font-bold">{item.nomorAntrean}</td>
                                            <td className="px-6 py-3 text-xs">{item.poli}</td>
                                            {/* Pemanggilan Data: pasien.nama */}
                                            <td className="px-6 py-3 text-xs font-semibold">{item.pasien?.nama}</td>
                                            <td className="px-6 py-3 text-right">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'Dilewati' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-6 text-center text-xs text-slate-400">Belum ada riwayat.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}