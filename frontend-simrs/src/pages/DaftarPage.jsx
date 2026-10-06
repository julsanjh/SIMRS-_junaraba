import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowLeft, HeartPulse, AlertCircle, Shield } from 'lucide-react';

export default function DaftarPage() {
    const [nama, setNama] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Dokter');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!nama || !username || !password) {
            setErrorMsg('Nama, Username, dan Password wajib diisi.');
            return;
        }

        // Ambil data user yang sudah ada di LocalStorage
        const existingUsers = JSON.parse(localStorage.getItem('simrs_database_users') || '[]');

        // Cek apakah username sudah terdaftar
        const isExist = existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
        if (isExist) {
            setErrorMsg('Username tersebut sudah digunakan. Silakan pilih username lain.');
            return;
        }

        // Buat objek user baru
        const newUser = {
            id: Date.now(),
            nama,
            username: username.toLowerCase(),
            email: email || `${username.toLowerCase()}@junaraba.rs`,
            password,
            role,
            status: 'Aktif'
        };

        // Simpan kembali ke database LocalStorage
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('simrs_database_users', JSON.stringify(updatedUsers));

        alert('Pendaftaran Akun Berhasil! Silakan masuk menggunakan akun baru Anda.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#dcfce7] to-[#ccfbf1] flex items-center justify-center p-4 font-sans text-slate-800">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">

                {/* Header & Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <HeartPulse size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-emerald-500 tracking-wide">Pendaftaran Akun Baru</h2>
                    <p className="text-xs text-slate-400 mt-1">SIM RS JUNARABA - Wilayah 3T</p>
                </div>

                {/* Tautan Kembali */}
                <div className="text-center mb-6">
                    <Link to="/login" className="text-emerald-500 text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft size={16} /> Kembali ke Halaman Login
                    </Link>
                </div>

                {/* Notifikasi Error */}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                        <AlertCircle size={16} />
                        {errorMsg}
                    </div>
                )}

                {/* Formulir Pendaftaran */}
                <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Contoh: dr. Siti Rahma, Sp.A"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="siti_rahma"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email Staf</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="siti@junaraba.rs"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Hak Akses (Role)</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white font-semibold"
                        >
                            <option>Dokter</option>
                            <option>Apoteker</option>
                            <option>Perawat / Staf</option>
                            <option>Administrator</option>
                            <option>Pasien</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white text-center font-bold py-3 rounded-lg mt-2 hover:bg-emerald-700 transition shadow-md text-sm">
                        Daftar Sekarang
                    </button>
                </form>

            </div>
        </div>
    );
}