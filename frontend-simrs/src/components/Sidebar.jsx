import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Volume2, UserPlus, Users, Stethoscope, Building2, Bed, Pill, Settings, LogOut, HeartPulse } from 'lucide-react';

export default function Sidebar() {
    const role = localStorage.getItem('userRole') || 'admin';
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Daftar menu lengkap. (Nantinya bisa kita filter berdasarkan role)
    const menus = [
        { path: '/dasbor', name: 'Dashboard Admin', icon: Activity, roles: ['admin'] },
        { path: '/dasbor/antrian', name: 'Antrian & Panggil', icon: Volume2, roles: ['admin', 'pasien'] },
        { path: '/dasbor/input-pasien', name: 'Input Pasien Baru', icon: UserPlus, roles: ['admin'] },
        { path: '/dasbor/pasien', name: 'Data Pasien', icon: Users, roles: ['admin', 'dokter'] },
        { path: '/dasbor/dokter', name: 'Data Dokter', icon: Stethoscope, roles: ['admin', 'pasien'] },
        { path: '/dasbor/departemen', name: 'Departemen / Poli', icon: Building2, roles: ['admin'] },
        { path: '/dasbor/rawat-inap', name: 'Rawat Inap', icon: Bed, roles: ['admin', 'dokter'] },
        { path: '/dasbor/apotek', name: 'Apotek & Obat', icon: Pill, roles: ['admin', 'dokter', 'pasien'] },
        { path: '/dasbor/pengaturan', name: 'Pengaturan Akun', icon: Settings, roles: ['admin', 'dokter', 'pasien'] },
    ];

    // Menyaring menu yang hanya boleh dilihat oleh role yang sedang login
    const filteredMenus = menus.filter(menu => menu.roles.includes(role));

    return (
        <div className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
            {/* Area Logo Gelap */}
            <div className="bg-[#1e293b] h-20 flex items-center px-6">
                <HeartPulse className="text-emerald-500 mr-3" size={24} />
                <div>
                    <h2 className="text-white font-bold text-lg leading-tight tracking-wide">SIM RS</h2>
                    <p className="text-emerald-400 text-[10px] tracking-widest font-bold">JUNARABA</p>
                </div>
            </div>

            {/* Daftar Menu Dinamis */}
            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {filteredMenus.map((menu, index) => {
                    const isActive = location.pathname === menu.path;
                    const Icon = menu.icon;
                    return (
                        <Link
                            key={index}
                            to={menu.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
                                }`}
                        >
                            <Icon size={18} />
                            {menu.name}
                        </Link>
                    );
                })}
            </div>

            {/* Tombol Keluar */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-500 hover:bg-red-50 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                    <LogOut size={18} />
                    Keluar
                </button>
            </div>
        </div>
    );
}