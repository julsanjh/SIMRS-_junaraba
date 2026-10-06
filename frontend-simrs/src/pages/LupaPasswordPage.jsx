import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, HeartPulse, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LupaPasswordPage() {
    const [identifier, setIdentifier] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Langkah 1: Cek Akun, Langkah 2: Ganti Password
    const [foundUser, setFoundUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    // Langkah 1: Verifikasi apakah username/email terdaftar
    const handleVerifyAccount = (e) => {
        e.preventDefault();
        setErrorMsg('');

        const users = JSON.parse(localStorage.getItem('simrs_database_users') || '[]');
        const key = identifier.trim().toLowerCase();

        const user = users.find(u =>
            (u.username && u.username.toLowerCase() === key) ||
            (u.email && u.email.toLowerCase() === key)
        );

        if (user) {
            setFoundUser(user);
            setStep(2); // Lanjut ke form buat password baru
        } else {
            setErrorMsg('Akun dengan username atau email tersebut tidak ditemukan.');
        }
    };

    // Langkah 2: Simpan Password Baru
    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!newPassword) {
            setErrorMsg('Masukkan password baru Anda.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('simrs_database_users') || '[]');

        // Update password user yang bersangkutan
        const updatedUsers = users.map(u => {
            if (u.id === foundUser.id || u.username === foundUser.username) {
                return { ...u, password: newPassword };
            }
            return u;
        });

        localStorage.setItem('simrs_database_users', JSON.stringify(updatedUsers));
        alert('Password berhasil diubah! Silakan login kembali dengan password baru.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#dcfce7] to-[#ccfbf1] flex items-center justify-center p-4 font-sans text-slate-800">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">

                {/* Header & Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <KeyRound size={26} />
                    </div>
                    <h2 className="text-xl font-bold text-emerald-500 tracking-wide">Reset Kata Sandi</h2>
                    <p className="text-xs text-slate-400 mt-1">SIM RS JUNARABA</p>
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

                {/* Step 1: Input Username/Email */}
                {step === 1 && (
                    <form onSubmit={handleVerifyAccount} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Username atau Email Terdaftar</label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Masukkan username / email..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-md text-sm">
                            Cari Akun
                        </button>
                    </form>
                )}

                {/* Step 2: Input Password Baru */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                            <p className="font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Akun Ditemukan:</p>
                            <p>Nama: <span className="font-semibold">{foundUser?.nama}</span></p>
                            <p>Username: <span className="font-semibold">{foundUser?.username}</span></p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Masukkan Password Baru</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-md text-sm">
                            Perbarui Password
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}