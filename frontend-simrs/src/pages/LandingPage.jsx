import { Link } from 'react-router-dom';
import { Phone, Moon, Search, Stethoscope, ShieldCheck, HeartPulse, Ambulance, Image as ImageIcon } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            {/* Top Banner Info Darurat */}
            <div className="bg-emerald-700 text-white text-xs sm:text-sm py-2 px-4 text-center truncate">
                🚨 INFO DARURAT: Layanan IGD tetap buka 24 Jam selama libur nasional • Jadwal Dokter Spesialis Saraf tersedia setiap hari Sabtu pukul 08.00 - 12.00 • Tetap jaga protokol kesehatan di area rumah sakit.
            </div>

            {/* Navbar */}
            <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100">
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-emerald-600 tracking-wide">SIM RS</span>
                    <span className="text-xs font-semibold text-slate-500 tracking-widest">JUNARABA</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full font-semibold text-sm hover:bg-red-100 transition">
                        <Phone size={16} /> Emergency: 1-500-911
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                        <Moon size={18} />
                    </button>
                    <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-emerald-700 transition flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white rounded-full flex justify-center items-center text-[10px]">👤</span> Masuk Sistem
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-[#e6fcf5] text-center pt-24 pb-32 px-4 relative">
                <h1 className="text-5xl font-bold text-slate-800 mb-4">
                    Pelayanan Prima, <span className="text-emerald-600">Senyum Sehat<br />Anda</span>
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto mt-6">
                    Menghadirkan solusi kesehatan terpadu dengan standar medis nasional dan<br />dukungan tenaga medis profesional.
                </p>
            </section>

            {/* Floating Search & Filter Card */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 -mt-16 relative z-10">
                <div className="flex gap-8 border-b mb-6 text-sm font-bold text-slate-400">
                    <button className="text-emerald-600 border-b-2 border-emerald-600 pb-3 px-2">DOKTER</button>
                    <button className="pb-3 px-2 hover:text-slate-600">LOKASI RS</button>
                    <button className="pb-3 px-2 hover:text-slate-600">LAYANAN</button>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <Search size={20} className="text-slate-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Cari nama dokter atau spesialisasi..."
                            className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400"
                        />
                    </div>
                    <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
                        CARI
                    </button>
                </div>
            </div>

            {/* Quick Services Cards */}
            <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-20 px-4">
                {[
                    { icon: <Stethoscope size={32} className="text-indigo-600" />, title: "Jadwal Dokter" },
                    { icon: <ShieldCheck size={32} className="text-emerald-500" />, title: "Layanan Unggulan" },
                    { icon: <HeartPulse size={32} className="text-red-500" />, title: "Medical Checkup" },
                    { icon: <Ambulance size={32} className="text-orange-500" />, title: "Layanan IGD" }
                ].map((item, index) => (
                    <div key={index} className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition cursor-pointer">
                        <div className="bg-slate-50 p-4 rounded-2xl">{item.icon}</div>
                        <span className="font-bold text-slate-700 text-sm">{item.title}</span>
                    </div>
                ))}
            </section>

            {/* Edukasi Kesehatan Section */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Edukasi Kesehatan</h2>
                            <p className="text-slate-500">Informasi terpercaya untuk hidup lebih sehat.</p>
                        </div>
                        <button className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1">
                            Lihat Semua Artikel <span className="text-lg">›</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { category: "KESEHATAN UMUM", title: "Tips Menjaga Kesehatan Jantung di Usia Produktif", date: "20 April 2026" },
                            { category: "LAYANAN UNGGULAN", title: "Mengenal Metode Bedah Minimal Invasif", date: "18 April 2026" },
                            { category: "POLI ANAK", title: "Pentingnya Nutrisi Bagi Tumbuh Kembang Anak", date: "15 April 2026" }
                        ].map((article, index) => (
                            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                                <div className="h-48 bg-[#cbd5e1] flex items-center justify-center text-slate-400">
                                    <ImageIcon size={48} />
                                </div>
                                <div className="p-6">
                                    <span className="text-emerald-600 font-bold text-xs tracking-wider uppercase mb-2 block">{article.category}</span>
                                    <h3 className="font-bold text-slate-800 text-lg leading-snug mb-4">{article.title}</h3>
                                    <div className="flex items-center text-slate-400 text-xs gap-2">
                                        <span>📅</span> {article.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f172a] py-16 text-center text-slate-400">
                <h2 className="text-white text-xl font-bold mb-2">SIM RS JUNARABA</h2>
                <p className="mb-8 text-sm">Melayani dengan Hati, Menyembuhkan dengan Kasih.</p>
                <div className="flex justify-center gap-6 text-sm">
                    <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
                    <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
                    <a href="#" className="hover:text-white transition">Karir</a>
                </div>
            </footer>
        </div>
    );
}