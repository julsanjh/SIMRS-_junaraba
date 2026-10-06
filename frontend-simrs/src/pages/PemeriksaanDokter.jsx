import { useState, useEffect } from 'react';
import {
    Stethoscope, Sparkles, Save, User, Activity, FileText, CheckCircle2
} from 'lucide-react';

export default function PemeriksaanDokter() {
    const [queue, setQueue] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // State Rekam Medis
    const [anamnesis, setAnamnesis] = useState('');
    const [tekananDarah, setTekananDarah] = useState('');
    const [diagnosisText, setDiagnosisText] = useState('');
    const [selectedIcd, setSelectedIcd] = useState(null);

    // State AI
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);

    // Ambil pasien yang berstatus 'Dipanggil' dari penyimpanan bersama
    const fetchActivePatients = () => {
        const data = JSON.parse(localStorage.getItem('simrs_queue_data') || '[]');
        setQueue(data.filter(item => item.status === 'Dipanggil'));
    };

    useEffect(() => {
        fetchActivePatients();
        window.addEventListener('storage', fetchActivePatients);
        return () => window.removeEventListener('storage', fetchActivePatients);
    }, []);

    // Simulasi Fungsi AI Pencari Kode ICD-10
    const handleAiSuggest = () => {
        if (!diagnosisText) {
            alert("Silakan ketik diagnosis atau keluhan pasien terlebih dahulu.");
            return;
        }

        setIsAiLoading(true);
        setAiSuggestions([]);

        setTimeout(() => {
            const text = diagnosisText.toLowerCase();
            let suggestions = [];

            if ((text.includes('demam') && text.includes('berdarah')) || text.includes('dengue')) {
                suggestions = [
                    { code: 'A91', desc: 'Dengue haemorrhagic fever' },
                    { code: 'A90', desc: 'Dengue fever [classical dengue]' }
                ];
            } else if (text.includes('kepala') || text.includes('headache') || text.includes('pusing')) {
                suggestions = [
                    { code: 'R51', desc: 'Headache' },
                    { code: 'G44.2', desc: 'Tension-type headache' }
                ];
            } else if (text.includes('batuk') && text.includes('darah')) {
                suggestions = [
                    { code: 'R04.2', desc: 'Haemoptysis' },
                    { code: 'A15.0', desc: 'Tuberculosis of lung' }
                ];
            } else {
                suggestions = [
                    { code: 'J06.9', desc: 'Acute upper respiratory infection, unspecified' },
                    { code: 'R50.9', desc: 'Fever, unspecified' }
                ];
            }

            setAiSuggestions(suggestions);
            setIsAiLoading(false);
        }, 1500);
    };

    const handleSimpanPemeriksaan = (e) => {
        e.preventDefault();
        if (!selectedIcd) {
            alert("Pilih setidaknya satu kode diagnosis ICD-10!");
            return;
        }

        // Perbarui status di LocalStorage menjadi 'Selesai' dan simpan diagnosis
        const data = JSON.parse(localStorage.getItem('simrs_queue_data') || '[]');
        const updated = data.map(item =>
            item.idDaftar === selectedPatient.idDaftar
                ? { ...item, status: 'Selesai', diagnosisCode: selectedIcd.code, diagnosisDesc: selectedIcd.desc }
                : item
        );
        localStorage.setItem('simrs_queue_data', JSON.stringify(updated));

        alert(`Pemeriksaan selesai!\nPasien: ${selectedPatient.pasien.nama}\nDiagnosis: ${selectedIcd.code} - ${selectedIcd.desc}`);

        // Reset form dan perbarui daftar antrean aktif
        fetchActivePatients();
        setSelectedPatient(null);
        resetForm();
    };

    const resetForm = () => {
        setAnamnesis('');
        setTekananDarah('');
        setDiagnosisText('');
        setSelectedIcd(null);
        setAiSuggestions([]);
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Ruang Pemeriksaan Dokter</h2>
                    <p className="text-sm text-slate-500 mt-1">Lakukan anamnesis dan tentukan diagnosis dibantu AI</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                    <Stethoscope size={20} className="text-emerald-600" />
                    <span className="font-bold text-emerald-700">Poli Penyakit Dalam</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* KOLOM KIRI: Daftar Antrean Poli (Pasien Dipanggil) */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Sedang Dipanggil ({queue.length})</h3>
                        <div className="space-y-3">
                            {queue.map(pasien => (
                                <div
                                    key={pasien.idDaftar}
                                    onClick={() => setSelectedPatient(pasien)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPatient?.idDaftar === pasien.idDaftar
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-lg">{pasien.nomorAntrean}</p>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                                            {pasien.pasien.noRm}
                                        </span>
                                    </div>
                                    <p className="font-semibold">{pasien.pasien.nama}</p>
                                </div>
                            ))}
                            {queue.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">Belum ada pasien dipanggil.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: Form Pemeriksaan & AI */}
                <div className="xl:col-span-3">
                    {selectedPatient ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                            {/* Info Pasien Aktif */}
                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{selectedPatient.pasien.nama}</h4>
                                        <p className="text-sm text-slate-500">No. RM: <span className="font-bold text-emerald-600">{selectedPatient.pasien.noRm}</span> • Antrean: {selectedPatient.nomorAntrean}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form EMR */}
                            <form onSubmit={handleSimpanPemeriksaan} className="p-6 space-y-6">

                                {/* Pemeriksaan Fisik */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-700 flex items-center gap-2"><Activity size={18} className="text-emerald-500" /> Tanda Vital & Anamnesis</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Tekanan Darah (mmHg)</label>
                                            <input type="text" value={tekananDarah} onChange={(e) => setTekananDarah(e.target.value)} placeholder="120/80" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Keluhan Utama & Riwayat</label>
                                            <input type="text" value={anamnesis} onChange={(e) => setAnamnesis(e.target.value)} placeholder="Pasien mengeluh..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* AI Asisten Diagnosis */}
                                <div className="space-y-4 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                                        <Sparkles size={18} className="text-indigo-600" /> Penentuan Diagnosis (ICD-10) dengan AI
                                    </h4>

                                    <div className="flex gap-3">
                                        <textarea
                                            value={diagnosisText}
                                            onChange={(e) => setDiagnosisText(e.target.value)}
                                            placeholder="Ketik diagnosis dokter di sini (bisa bahasa Indonesia, Inggris, atau sekadar gejala seperti 'Demam berdarah')..."
                                            className="flex-1 px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm resize-none h-20"
                                        ></textarea>
                                        <button
                                            type="button"
                                            onClick={handleAiSuggest}
                                            disabled={isAiLoading}
                                            className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm flex flex-col items-center justify-center w-32 shrink-0 disabled:opacity-50"
                                        >
                                            {isAiLoading ? (
                                                <span className="animate-pulse">Berpikir...</span>
                                            ) : (
                                                <>
                                                    <Sparkles size={20} className="mb-1" />
                                                    <span className="text-xs text-center">Cari Kode ICD</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Hasil Rekomendasi AI */}
                                    {aiSuggestions.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-xs font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Rekomendasi Kode ICD-10 Teratas:</p>
                                            <div className="space-y-2">
                                                {aiSuggestions.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSelectedIcd(item)}
                                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${selectedIcd?.code === item.code
                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                                            : 'bg-white text-slate-700 border-indigo-100 hover:border-indigo-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`font-black text-lg ${selectedIcd?.code === item.code ? 'text-white' : 'text-indigo-600'}`}>
                                                                {item.code}
                                                            </span>
                                                            <span className="font-semibold text-sm">{item.desc}</span>
                                                        </div>
                                                        {selectedIcd?.code === item.code && <CheckCircle2 size={20} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-md flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Simpan Rekam Medis & Selesai
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p className="font-semibold text-slate-600">Belum Ada Pasien Terpilih</p>
                            <p className="text-xs mt-2">Silakan pilih pasien dari daftar antrean di sebelah kiri untuk memulai pemeriksaan.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}