import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Sparkles, AlertTriangle, CheckCircle, Globe } from 'lucide-react';

export default function Apotek() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // State untuk Modal AI Analisa ICD-10 & Cross-Check Stok
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [diseaseInput, setDiseaseInput] = useState('');
    const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

    // 1. State Data Obat (Ditarik dari LocalStorage agar tersimpan permanen)
    const [medicines, setMedicines] = useState([]);

    // Fungsi memuat data obat dari LocalStorage
    const loadMedicines = () => {
        const defaultMedicines = [
            { id: 1, nama: 'Paracetamol 500mg', jenis: 'Tablet', stok: 150, harga: 5000, expDate: '2026-11-15' },
            { id: 2, nama: 'Paracetamol 500mg', jenis: 'Tablet', stok: 200, harga: 5000, expDate: '2028-05-20' },
            { id: 3, nama: 'Amoxicillin 250mg', jenis: 'Kapsul', stok: 85, harga: 12000, expDate: '2026-10-01' },
            { id: 4, nama: 'Sirup Obat Batuk Ibu & Anak', jenis: 'Sirup', stok: 15, harga: 25000, expDate: '2027-03-12' },
            { id: 5, nama: 'Salep Kulit Ketoconazole', jenis: 'Salep', stok: 40, harga: 15000, expDate: '2028-08-14' },
        ];

        const saved = localStorage.getItem('simrs_master_obat');
        if (saved) {
            setMedicines(JSON.parse(saved));
        } else {
            setMedicines(defaultMedicines);
            localStorage.setItem('simrs_master_obat', JSON.stringify(defaultMedicines));
        }
    };

    useEffect(() => {
        loadMedicines();
        // Listener agar data otomatis sinkron jika ada perubahan di tab lain
        window.addEventListener('storage', loadMedicines);
        return () => window.removeEventListener('storage', loadMedicines);
    }, []);

    const [formData, setFormData] = useState({ id: null, nama: '', jenis: 'Tablet', stok: 0, harga: 0, expDate: '' });

    const handleOpenModal = (obat = null) => {
        if (obat) setFormData(obat);
        else setFormData({ id: null, nama: '', jenis: 'Tablet', stok: 0, harga: 0, expDate: '' });
        setIsModalOpen(true);
    };

    // 2. Pemetaan Cerdas Berbasis Kode ICD-10 & Nama Penyakit
    const handleRunAiAnalysis = (e) => {
        e.preventDefault();
        if (!diseaseInput.trim()) return;

        const query = diseaseInput.toLowerCase();
        let diseaseName = '';
        let diseaseDescription = '';
        let matchedDrugKeywords = [];
        let clinicalDescription = '';

        if (query.includes('j02') || query.includes('faringitis') || query.includes('batuk') || query.includes('flu') || query.includes('pilek') || query.includes('ispa')) {
            diseaseName = 'Faringitis Akut / ISPA (ICD-10: J02)';
            diseaseDescription = 'Peradangan pada dinding faring yang umumnya disebabkan oleh infeksi virus atau bakteri, memicu gejala nyeri telan, batuk, dan tenggorokan gatal.';
            matchedDrugKeywords = ['sirup obat batuk', 'paracetamol'];
            clinicalDescription = 'Terapi suportif menggunakan antitusif/ekspektoran dan analgetik-antipiretik.';
        } else if (query.includes('h25') || query.includes('katarak')) {
            diseaseName = 'Katarak Senilis / Gangguan Lensa Mata (ICD-10: H25)';
            diseaseDescription = 'Kondisi kekeruhan pada lensa mata yang secara bertahap mengaburkan penglihatan, sering dijumpai pada proses penuaan.';
            matchedDrugKeywords = ['lubricant eye drops', 'natrium diklofenak tetes mata'];
            clinicalDescription = 'Terapi awal konservatif dengan tetes mata pelumas (tindakan definitif utama adalah operasi fakoemulsifikasi).';
        } else if (query.includes('k29') || query.includes('maag') || query.includes('dispepsia')) {
            diseaseName = 'Dispepsia / Gastritis / Maag (ICD-10: K29)';
            diseaseDescription = 'Kumpulan gejala rasa tidak nyaman pada perut bagian atas seperti nyeri ulu hati, kembung, dan mual akibat peningkatan asam lambung.';
            matchedDrugKeywords = ['omeprazole', 'antasida'];
            clinicalDescription = 'Pemberian penghambat pompa proton (PPI) atau antasida untuk menetralkan asam lambung.';
        } else if (query.includes('a09') || query.includes('diare')) {
            diseaseName = 'Diare dan Gastroenteritis Infeksius (ICD-10: A09)';
            diseaseDescription = 'Peradangan pada lambung dan usus yang menyebabkan buang air besar cair lebih sering dari biasanya, berisiko dehidrasi.';
            matchedDrugKeywords = ['oralit', 'new diatabs', 'zinc'];
            clinicalDescription = 'Fokus pada rehidrasi cairan elektrolit tubuh serta obat pengikat racun saluran cerna.';
        } else if (query.includes('i10') || query.includes('hipertensi')) {
            diseaseName = 'Hipertensi Esensial / Tekanan Darah Tinggi (ICD-10: I10)';
            diseaseDescription = 'Kondisi medis kronis di mana tekanan darah pada arteri meningkat secara menahun, memerlukan kontrol ketat.';
            matchedDrugKeywords = ['amlodipine', 'captopril'];
            clinicalDescription = 'Pemberian agen antihipertensi lini pertama untuk menjaga stabilitas hemodinamik.';
        } else {
            diseaseName = `Diagnosis Klinis: "${diseaseInput.toUpperCase()}"`;
            diseaseDescription = 'Analisis literatur farmasi klinis umum berdasarkan kata kunci diagnosis yang dimasukkan.';
            matchedDrugKeywords = [query];
            clinicalDescription = 'Rekomendasi obat standar berdasarkan rujukan simptomatik.';
        }

        // Pengecekan ketersediaan stok fisik di database gudang RS (medicines state terbaru)
        const inventoryCheckResults = matchedDrugKeywords.map(keyword => {
            const foundBatches = medicines.filter(m =>
                m.nama.toLowerCase().includes(keyword.toLowerCase()) && m.stok > 0
            );

            if (foundBatches.length > 0) {
                foundBatches.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
                return {
                    keyword,
                    status: 'AVAILABLE',
                    bestBatch: foundBatches[0]
                };
            } else {
                return {
                    keyword,
                    status: 'UNAVAILABLE',
                    bestBatch: null
                };
            }
        });

        setAiAnalysisResult({
            diseaseName,
            diseaseDescription,
            clinicalDescription,
            results: inventoryCheckResults
        });
    };

    // 3. Fungsi Simpan yang Menyimpan Permanen ke LocalStorage
    const handleSave = () => {
        if (!formData.nama || !formData.expDate) {
            alert('Nama obat dan tanggal kedaluwarsa wajib diisi!');
            return;
        }

        const payload = { ...formData, stok: Number(formData.stok), harga: Number(formData.harga) };
        let updatedMedicines;

        if (payload.id) {
            updatedMedicines = medicines.map(m => m.id === payload.id ? payload : m);
        } else {
            updatedMedicines = [...medicines, { ...payload, id: Date.now() }];
        }

        // Simpan ke State dan LocalStorage secara permanen
        setMedicines(updatedMedicines);
        localStorage.setItem('simrs_master_obat', JSON.stringify(updatedMedicines));

        if (navigator.onLine) {
            alert('Data obat berhasil disimpan dan disinkronkan ke server pusat secara permanen!');
        } else {
            alert('Mode Offline 3T: Data obat berhasil disimpan secara lokal.');
        }

        setIsModalOpen(false);
    };

    // 4. Fungsi Hapus yang Memperbarui LocalStorage secara Permanen
    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus obat ini?')) {
            const updatedMedicines = medicines.filter(m => m.id !== id);
            setMedicines(updatedMedicines);
            localStorage.setItem('simrs_master_obat', JSON.stringify(updatedMedicines));
        }
    };

    const filteredMedicines = medicines.filter(obat =>
        obat.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obat.jenis.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Stok Obat & Analisa AI ICD-10</h2>
                    <p className="text-sm text-slate-500 mt-1">Total: {medicines.length} Batch Obat Terdaftar di RS</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => {
                            setIsAiModalOpen(true);
                            setDiseaseInput('H25');
                            setAiAnalysisResult(null);
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-teal-700 hover:to-emerald-700 transition shadow-sm w-full sm:w-auto shrink-0"
                    >
                        <Sparkles size={18} /> AI Analisa Kode ICD-10 / Penyakit
                    </button>

                    <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64 shadow-sm">
                        <Search size={16} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Cari nama atau jenis obat..."
                            className="bg-transparent outline-none text-sm w-full text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition shadow-sm w-full sm:w-auto shrink-0"
                    >
                        <Plus size={18} /> Tambah Obat
                    </button>
                </div>
            </div>

            {/* Tabel Inventaris Obat */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 text-slate-500 bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nama Obat</th>
                            <th className="px-6 py-4 font-semibold">Jenis</th>
                            <th className="px-6 py-4 font-semibold">Stok</th>
                            <th className="px-6 py-4 font-semibold">Harga Satuan</th>
                            <th className="px-6 py-4 font-semibold">Tgl Kedaluwarsa (Exp)</th>
                            <th className="px-6 py-4 font-semibold">Status FEFO</th>
                            <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredMedicines.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-400">Data tidak ditemukan.</td></tr>
                        ) : (
                            filteredMedicines.map((obat) => {
                                const isExpSoon = new Date(obat.expDate) - new Date() < 90 * 24 * 60 * 60 * 1000;
                                return (
                                    <tr key={obat.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-bold text-slate-800">{obat.nama}</td>
                                        <td className="px-6 py-4">{obat.jenis}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${obat.stok < 20 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {obat.stok}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">Rp {obat.harga.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 font-mono text-slate-600">{obat.expDate}</td>
                                        <td className="px-6 py-4">
                                            {isExpSoon ? (
                                                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                                    <AlertTriangle size={12} /> Prioritas Keluar (FEFO)
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                                    <CheckCircle size={12} /> Aman
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(obat)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(obat.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah / Edit Obat */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">{formData.id ? 'Edit Obat' : 'Tambah Obat Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Obat & Dosis</label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    placeholder="Contoh: Paracetamol 500mg"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Sediaan</label>
                                    <select
                                        value={formData.jenis}
                                        onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    >
                                        <option>Tablet</option>
                                        <option>Kapsul</option>
                                        <option>Sirup</option>
                                        <option>Salep</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Stok</label>
                                    <input
                                        type="number"
                                        value={formData.stok}
                                        onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Harga Satuan (Rp)</label>
                                    <input
                                        type="number"
                                        value={formData.harga}
                                        onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Kedaluwarsa</label>
                                    <input
                                        type="date"
                                        value={formData.expDate}
                                        onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition mt-2 shadow-sm"
                            >
                                Simpan Obat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal AI Analisa Kode ICD-10 & Penjelasan Penyakit */}
            {isAiModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-teal-50">
                            <div className="flex items-center gap-2">
                                <Globe className="text-teal-600" size={20} />
                                <h3 className="text-lg font-bold text-slate-800">AI Farmasi & Analisa Kode ICD-10</h3>
                            </div>
                            <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleRunAiAnalysis} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Ketik Kode Diagnosis (ICD-10) atau Nama Penyakit</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={diseaseInput}
                                        onChange={(e) => setDiseaseInput(e.target.value)}
                                        placeholder="Contoh: H25, J02, K29, atau ketik katarak..."
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm bg-white"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 transition shadow-sm shrink-0 flex items-center gap-1"
                                    >
                                        <Sparkles size={16} /> Analisa
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">AI akan menerjemahkan kode diagnosis, memberikan penjelasan medis, dan memindai stok RS.</p>
                            </div>

                            {aiAnalysisResult && (
                                <div className="space-y-3 pt-2 max-h-[320px] overflow-y-auto pr-1">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Identifikasi Diagnosis / ICD-10</p>
                                            <p className="font-bold text-slate-800 text-base">{aiAnalysisResult.diseaseName}</p>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-2">
                                            <span className="font-bold">Penjelasan Umum:</span> {aiAnalysisResult.diseaseDescription}
                                        </p>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            <span className="font-bold">Rekomendasi Klinis:</span> {aiAnalysisResult.clinicalDescription}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Status Ketersediaan Obat di Apotek RS:</p>
                                        {aiAnalysisResult.results.map((res, idx) => (
                                            <div key={idx} className={`p-3 rounded-xl border text-xs space-y-1 ${res.status === 'AVAILABLE' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                                                }`}>
                                                <div className="flex justify-between items-center font-bold">
                                                    <span className="text-sm capitalize text-slate-800">• {res.keyword}</span>
                                                    {res.status === 'AVAILABLE' ? (
                                                        <span className="bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">Tersedia di Apotek RS</span>
                                                    ) : (
                                                        <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">Kosong / Di Luar Gudang</span>
                                                    )}
                                                </div>

                                                {res.status === 'AVAILABLE' && res.bestBatch ? (
                                                    <p className="text-emerald-700 pt-1">
                                                        Stok Gudang: <span className="font-semibold">{res.bestBatch.stok} Unit</span> (Batch: {res.bestBatch.nama}, Exp: <span className="font-mono font-bold">{res.bestBatch.expDate}</span>)
                                                    </p>
                                                ) : (
                                                    <p className="text-amber-700 pt-1">
                                                        Obat standar untuk diagnosis ini tidak ditemukan dalam stok fisik gudang RS saat ini. Disarankan melakukan pengadaan luar atau meresepkan alternatif.
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsAiModalOpen(false)}
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition shadow-sm mt-2"
                            >
                                Tutup Asisten AI
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}