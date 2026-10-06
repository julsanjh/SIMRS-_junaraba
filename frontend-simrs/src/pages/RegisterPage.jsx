import { Link } from 'react-router-dom';
import { User, Mail, Lock, Building, ArrowLeft, HeartPulse } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#dcfce7] to-[#ccfbf1] flex items-center justify-center p-4 font-sans text-slate-800 py-10">
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

                <div className="text-center mb-6">
                    <h3 className="text-emerald-700 font-bold">Pendaftaran Akun Baru</h3>
                </div>

                {/* Formulir Pendaftaran */}
                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Nama sesuai KTP"
                                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email Aktif</label>
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

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Akun</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Building size={18} />
                            </div>
                            <select className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm appearance-none bg-white">
                                <option value="pasien">Pasien (Umum)</option>
                                <option value="dokter">Dokter</option>
                                <option value="perawat">Perawat / Staf Medis</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Password Baru</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="Minimal 6 karakter"
                                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <button type="button" className="w-full bg-emerald-600 text-white text-center font-bold py-3 rounded-lg mt-2 hover:bg-emerald-700 transition shadow-md">
                        Daftar Sekarang
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center mt-6">
                    <Link to="/login" className="text-slate-500 text-sm hover:text-emerald-600 transition flex items-center justify-center gap-1">
                        <ArrowLeft size={14} /> Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}