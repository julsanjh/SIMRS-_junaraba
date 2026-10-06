import { useState, useEffect } from 'react';
import {
    Users,
    BedDouble,
    Stethoscope,
    DollarSign,
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Wifi,
    ShieldCheck,
    Database,
    Clock,
    HeartPulse,
    FileText,
    Layers
} from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalPasien: 0,
        dokterAktif: 0,
        pasienDirawat: 0,
        pendapatan: 'Rp 14.850.000',
        borPercentage: 78,
    });

    const [recentActivities, setRecentActivities] = useState([]);

    // Muat data dinamis dari LocalStorage (jika ada data pasien/inpatient/dokter yang tersimpan)
    useEffect(() => {
        const patients = JSON.parse(localStorage.getItem('offlinePatientQueue') || '[]');
        const inpaents = JSON.parse(localStorage.getItem('offlineInpatientQueue') || '[]');
        const doctors = JSON.parse(localStorage.getItem('simrs_database_users') || '[]').filter(u => u.role === 'Dokter');

        setStats(prev => ({
            ...prev,
            totalPasien: patients.length > 0 ? patients.length + 42 : 42, // Angka dasar simulasi RS Tipe A
            pasienDirawat: inpaents.length > 0 ? inpaents.length + 18 : 18,
            dokterAktif: doctors.length > 0 ? doctors.length : 8,
        }));

        // Simulasi Log Aktivitas Rumah Sakit Real-Time
        setRecentActivities([
            { id: 1, waktu: 'Baru saja', jenis: 'Pendaftaran Poli', desc: 'Pasien An. Budi (Poli Umum) terdaftar.', status: 'Sukses' },
            { id: 2, waktu: '5 menit lalu', jenis: 'Farmasi FEFO', desc: 'Pengeluaran obat Amoxicillin (Batch #AX-99).', status: 'Tervalidasi' },
            { id: 3, waktu: '12 menit lalu', jenis: 'Rawat Inap', desc: 'Pasien Ny. Siti masuk ke Bangsal Melati Ruang 204.', status: 'Terisi' },
            { id: 4, waktu: '25 menit lalu', jenis: 'AI Diagnosis', desc: 'Mapping ICD-10 J02.9 (Faringitis Akut) berhasil.', status: 'Selesai' },
        ]);
    }, []);

    return (
        <div className="space-y-6">

            {/* Header Selamat Datang Eksekutif */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        <ShieldCheck size={14} /> Pusat Komando RS Tipe A - Akreditasi Paripurna
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Executive Command Dashboard</h1>
                    <p className="text-slate-300 text-sm max-w-xl">
                        Sistem Informasi Manajemen Rumah Sakit (SIM RS JUNARABA) terintegrasi modul offline-first wilayah 3T & asisten diagnostik AI.
                    </p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60 flex items-center gap-4 relative z-10 shadow-lg">
                    <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                        <Activity size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Status BOR Rumah Sakit</p>
                        <p className="text-xl font-extrabold text-white">{stats.borPercentage}% <span className="text-xs font-normal text-emerald-400">(Tinggi / Optimal)</span></p>
                    </div>
                </div>
            </div>

            {/* Kartu Metrik Utama (KPI Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Total Pasien */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Kunjungan Hari Ini</p>
                        <h3 className="text-2xl font-extrabold text-slate-800">{stats.totalPasien} <span className="text-xs font-medium text-emerald-600">Pasien</span></h3>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> +12% dari kemarin
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                        <Users size={28} />
                    </div>
                </div>

                {/* Dokter Aktif */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dokter & Spesialis Aktif</p>
                        <h3 className="text-2xl font-extrabold text-slate-800">{stats.dokterAktif} <span className="text-xs font-medium text-blue-600">Dokter</span></h3>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">
                            Semua poliklinik terlayani
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                        <Stethoscope size={28} />
                    </div>
                </div>

                {/* Pasien Rawat Inap */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pasien Rawat Inap / ICU</p>
                        <h3 className="text-2xl font-extrabold text-slate-800">{stats.pasienDirawat} <span className="text-xs font-medium text-purple-600">Orang</span></h3>
                        <p className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-1">
                            <Layers size={12} /> 4 Bed ICU Tersedia
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                        <BedDouble size={28} />
                    </div>
                </div>

                {/* Pendapatan Operasional */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pendapatan Harian</p>
                        <h3 className="text-xl font-extrabold text-slate-800">{stats.pendapatan}</h3>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                            <CheckCircle2 size={12} /> Kasir & BPJS Terverifikasi
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                        <DollarSign size={28} />
                    </div>
                </div>

            </div>

            {/* Bagian Grid Bawah: Statistik Ruangan & Log Aktivitas Realtime */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Kolom Kiri & Tengah: Status Hunian Bangsal (BOR Tipe A) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Tingkat Okupansi Bangsal (Bed Occupancy Rate)</h2>
                            <p className="text-xs text-slate-400">Distribusi keterisian kamar rawat inap berdasarkan kelas perawatan</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">Standar Tipe A</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>VIP & Suite Room (Kapasitas: 20 Bed)</span>
                                <span className="text-emerald-600">85% Terisi (17 Bed)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Kelas I (Kapasitas: 45 Bed)</span>
                                <span className="text-blue-600">78% Terisi (35 Bed)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Kelas II & III - BPJS (Kapasitas: 120 Bed)</span>
                                <span className="text-purple-600">82% Terisi (98 Bed)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: '82%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>ICU / ICCU (Kapasitas: 15 Bed)</span>
                                <span className="text-amber-600 font-extrabold">73% Terisi (11 Bed)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '73%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <Database size={18} className="text-emerald-600" />
                            <span>Cache Database Offline 3T: <strong className="text-slate-800">Sinkron (Aktif)</strong></span>
                        </div>
                        <span className="text-slate-400">Pembaruan otomatis tiap 30 detik</span>
                    </div>
                </div>

                {/* Kolom Kanan: Log Aktivitas Medis Realtime */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-800 text-base">Aktivitas Sistem & Medis</h3>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                        </div>

                        <div className="space-y-3.5 overflow-y-auto max-h-[280px] pr-1">
                            {recentActivities.map((act) => (
                                <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:bg-slate-100/60 transition">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-emerald-600">{act.jenis}</span>
                                        <span className="text-slate-400 flex items-center gap-1"><Clock size={10} /> {act.waktu}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700">{act.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-400">SIM RS JUNARABA v2.5 Enterprise Edition</p>
                    </div>
                </div>

            </div>

        </div>
    );
}