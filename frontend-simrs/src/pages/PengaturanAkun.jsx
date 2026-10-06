import { User, ShieldCheck, Mail, Lock, Save } from 'lucide-react';

export default function PengaturanAkun() {
    // Mengambil data pengguna yang sedang login dari localStorage
    const userName = localStorage.getItem('userName') || '';
    const role = localStorage.getItem('userRole') || 'admin';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Header Profil */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-5 bg-slate-50/50">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-red-600 shadow-sm"></div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Pengaturan Akun</h2>
                        <p className="text-sm text-slate-500">Kelola informasi profil dan keamanan Anda.</p>
                    </div>
                </div>

                {/* Formulir Pengaturan */}
                <div className="p-8 space-y-8">

                    {/* Seksi Informasi Dasar */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Informasi Dasar</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        defaultValue={userName}
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Role / Jabatan</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        defaultValue={role.toUpperCase()}
                                        disabled
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed font-semibold"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1.5">*Role tidak dapat diubah sembarangan.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Masukkan alamat email Anda"
                                    className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Seksi Keamanan */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Keamanan (Opsional)</h3>
                        <p className="text-xs text-slate-500 mb-5">Kosongkan jika tidak ingin mengubah password.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password Baru</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-slate-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ulangi Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-slate-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end pt-4">
                        <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-700 transition shadow-sm">
                            <Save size={18} /> Simpan Perubahan
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}