import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft, HeartPulse, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Paksa perbarui/timpa database user di LocalStorage agar selalu memiliki struktur terbaru yang valid
    useEffect(() => {
        const defaultUsers = [
            { id: 1, nama: 'Administrator', username: 'admin', email: 'admin@junaraba.rs', password: '123456', role: 'Administrator', status: 'Aktif' },
            { id: 2, nama: 'dr. Budi Santoso, Sp.PD', username: 'dokter', email: 'budi@junaraba.rs', password: '123', role: 'Dokter', status: 'Aktif' },
            { id: 3, nama: 'Pasien Umum', username: 'pasien', email: 'pasien@junaraba.rs', password: '456', role: 'Pasien', status: 'Aktif' }
        ];

        // Gunakan setItem langsung tanpa kondisi agar data lama yang rusak tertimpa bersih
        localStorage.setItem('simrs_database_users', JSON.stringify(defaultUsers));
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMsg('');

        const registeredUsers = JSON.parse(localStorage.getItem('simrs_database_users') || '[]');
        const inputKey = username.trim().toLowerCase();

        // Pencarian sangat toleran: mencocokkan username, email, atau bagian depan nama
        const foundUser = registeredUsers.find(u => {
            const matchUsername = u.username && u.username.toLowerCase() === inputKey;
            const matchEmail = u.email && u.email.toLowerCase() === inputKey;
            const matchName = u.nama && u.nama.toLowerCase().includes(inputKey);
            return matchUsername || matchEmail || matchName;
        });

        if (foundUser) {
            // Jika user lama tidak punya password, berikan default '123456' atau 'password123'
            const userPassword = foundUser.password || '123456';

            if (password === userPassword) {
                localStorage.setItem('userRole', foundUser.role.toLowerCase());
                localStorage.setItem('userName', foundUser.nama);
                navigate('/dasbor');
            } else {
                setErrorMsg('Password yang Anda masukkan salah.');
            }
        } else {
            setErrorMsg('Username atau Email tidak ditemukan di database rumah sakit.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#dcfce7] to-[#ccfbf1] flex items-center justify-center p-4 font-sans text-slate-800">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">

                {/* Header & Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <HeartPulse size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-emerald-500 tracking-wide">SIM RS JUNARABA</h2>
                    <p className="text-xs text-slate-400 mt-1">Sistem Informasi Manajemen Terpadu</p>
                </div>

                {/* Tautan Kembali */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-emerald-500 text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft size={16} /> Kembali ke Halaman Utama
                    </Link>
                </div>

                {/* Notifikasi Error */}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                        <AlertCircle size={16} />
                        {errorMsg}
                    </div>
                )}

                {/* Formulir Login */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Username atau Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin / dokter / pasien"
                                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white text-center font-bold py-3 rounded-lg mt-4 hover:bg-emerald-700 transition shadow-md">
                        Masuk Sistem
                    </button>
                </form>

                {/* Footer Link */}
                <div className="flex justify-between items-center mt-6 text-sm">
                    <Link to="/lupa-password" className="text-slate-400 hover:text-emerald-600 transition font-medium">Lupa Password?</Link>
                    <Link to="/daftar" className="text-emerald-600 font-bold hover:underline transition">Daftar Akun</Link>
                </div>

                {/* Info Default Login */}
                <div className="mt-4 text-center text-[10px] text-slate-400">
                    <p>Akses Admin: Username <b>admin</b> | Password <b>123456</b></p>
                </div>
            </div>
        </div>
    );
}