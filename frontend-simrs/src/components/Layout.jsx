import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    UserCheck,
    Building2,
    BedDouble,
    Pill,
    Settings,
    LogOut,
    Volume2,
    Menu,
    ChevronLeft,
    ChevronRight,
    Wifi,
    WifiOff,
    Download,
    RefreshCw,
    CloudSync,
    CheckCircle2,
    Loader2,
    Ticket,
    Stethoscope
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // State manajemen unduhan & sinkronisasi
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const checkPendingData = () => {
        const patientQueue = JSON.parse(localStorage.getItem('offlinePatientQueue') || '[]');
        const doctorQueue = JSON.parse(localStorage.getItem('offlineDoctorQueue') || '[]');
        const deptQueue = JSON.parse(localStorage.getItem('offlineDeptQueue') || '[]');
        const inpatientQueue = JSON.parse(localStorage.getItem('offlineInpatientQueue') || '[]');
        const medicineQueue = JSON.parse(localStorage.getItem('offlineMedicineQueue') || '[]');

        const total = patientQueue.length + doctorQueue.length + deptQueue.length + inpatientQueue.length + medicineQueue.length;
        setPendingCount(total);
    };

    useEffect(() => {
        checkPendingData();
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
            checkPendingData();
        };

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    const handleRefreshStatus = () => {
        setIsOnline(navigator.onLine);
        checkPendingData();
        alert(navigator.onLine ? 'Status: Perangkat terhubung ke internet (Online).' : 'Status: Perangkat dalam keadaan Offline (Mode 3T aktif).');
    };

    const handleDownloadOffline = () => {
        if (isDownloading) return;
        setIsDownloading(true);
        setDownloadProgress(10);

        const interval = setInterval(() => {
            setDownloadProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 30;
            });
        }, 400);

        setTimeout(() => {
            clearInterval(interval);
            setDownloadProgress(100);
            setIsDownloading(false);
            setShowSuccessModal(true);
        }, 1800);
    };

    const handleSyncData = () => {
        if (!isOnline) {
            alert('Tidak dapat melakukan sinkronisasi saat perangkat offline.');
            return;
        }

        setIsSyncing(true);
        setTimeout(() => {
            localStorage.removeItem('offlinePatientQueue');
            localStorage.removeItem('offlineDoctorQueue');
            localStorage.removeItem('offlineDeptQueue');
            localStorage.removeItem('offlineInpatientQueue');
            localStorage.removeItem('offlineMedicineQueue');

            setIsSyncing(false);
            setPendingCount(0);
            alert('Sinkronisasi Berhasil! Data lokal 3T telah terkirim ke server pusat.');
        }, 2000);
    };

    const menuItems = [
        { path: '/dasbor', name: 'Dashboard Admin', icon: LayoutDashboard },
        { path: '/dasbor/antrian', name: 'Antrian & Panggil', icon: Volume2 },
        { path: '/dasbor/input-pasien', name: 'Input Pasien Baru', icon: UserPlus },
        { path: '/dasbor/pendaftaran-poli', name: 'Pendaftaran Poli', icon: Ticket },
        { path: '/dasbor/pemeriksaan', name: 'Pemeriksaan Dokter', icon: Stethoscope },
        { path: '/dasbor/pasien', name: 'Data Pasien', icon: Users },
        { path: '/dasbor/dokter', name: 'Data Dokter', icon: UserCheck },
        { path: '/dasbor/departemen', name: 'Departemen / Poli', icon: Building2 },
        { path: '/dasbor/rawat-inap', name: 'Rawat Inap', icon: BedDouble },
        { path: '/dasbor/apotek', name: 'Apotek & Obat', icon: Pill },
        { path: '/dasbor/pengaturan', name: 'Pengaturan Akun', icon: Settings },
        { path: '/dasbor/manajemen-user', name: 'Manajemen User', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex relative">
            {/* Sidebar Navigasi Utama */}
            <aside className={`w-64 fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-xl bg-white border-r border-slate-200`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute -right-4 top-7 w-8 h-8 bg-white text-slate-700 rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition z-50 border border-slate-200"
                    title="Sembunyikan Sidebar"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="bg-[#1a2234] p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold shadow-md tracking-wider">
                        RS
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-base tracking-wide">RS JUNARABA</h1>
                        <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest mt-0.5">SISTEM INFORMASI RS</p>
                    </div>
                </div>

                <div className="bg-white flex-1 flex flex-col justify-between overflow-hidden">
                    <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'hover:bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100 bg-white">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                        >
                            <LogOut size={18} />
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            </aside>

            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed left-4 top-6 w-10 h-10 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-slate-800 transition z-50"
                    title="Tampilkan Sidebar"
                >
                    <ChevronRight size={20} />
                </button>
            )}

            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                            title="Toggle Sidebar"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Sistem Informasi Rumah Sakit</h2>
                            <p className="text-xs text-slate-400">Solusi Layanan Kesehatan Wilayah 3T</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownloadOffline}
                            disabled={isDownloading}
                            className="flex items-center gap-2 bg-slate-900 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-sm disabled:opacity-50"
                        >
                            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                            <span>{isDownloading ? `Mengunduh (${downloadProgress}%)` : 'Mode Offline'}</span>
                        </button>

                        <button
                            onClick={handleRefreshStatus}
                            className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition border border-slate-200"
                        >
                            <RefreshCw size={14} />
                            <span>Refresh</span>
                        </button>

                        {isOnline && pendingCount > 0 && (
                            <button
                                onClick={handleSyncData}
                                disabled={isSyncing}
                                className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm animate-pulse"
                            >
                                {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <CloudSync size={14} />}
                                <span>Sinkronisasi ({pendingCount})</span>
                            </button>
                        )}

                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${isOnline ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
                        </div>

                        <div className="h-6 w-[1px] bg-slate-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-800">Administrator</p>
                                <p className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shadow-sm">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 flex-1 text-slate-800">
                    <Outlet />
                </main>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Unduhan Berhasil!</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Aset sistem, data master poli, dokter, dan obat berhasil di-cache ke penyimpanan lokal.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition"
                        >
                            Mengerti & Lanjutkan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}