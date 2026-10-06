import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, HeartPulse } from 'lucide-react';

export default function ForgotPasswordPage() {
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

                {/* Tautan Kembali ke Utama */}
                <div className="text-center mb-6">
                    <Link to="/" className="text-emerald-500 text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft size={16} /> Kembali ke Halaman Utama
                    </Link>
                </div>

                {/* Bagian Instruksi Reset */}
                <div className="text-center mb-6">
                    <h3 className="text-emerald-700 font-bold mb-2">Reset Password</h3>
                    <p className="text-xs text-slate-500 px-4">
                        Masukkan email yang terdaftar. Kami akan mengirimkan instruksi untuk mereset password Anda.
                    </p>
                </div>

                {/* Formulir Reset */}
                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email Terdaftar</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="contoh@email.com"
                                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <button type="button" className="w-full bg-emerald-600 text-white text-center font-bold py-3 rounded-lg mt-2 hover:bg-emerald-700 transition shadow-md">
                        Kirim Link Reset
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center mt-6">
                    <Link to="/login" className="text-slate-500 text-sm hover:text-emerald-600 transition">
                        Batal, kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}