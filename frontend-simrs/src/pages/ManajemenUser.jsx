import { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, X, Shield, CheckCircle, Key, User } from 'lucide-react';

export default function ManajemenUser() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Form Tambah / Edit User (disesuaikan dengan halaman login)
    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        username: '',
        email: '',
        password: '',
        role: 'Dokter',
        status: 'Aktif'
    });

    // Memuat data user dari LocalStorage (tersinkronisasi dengan LoginPage)
    const loadUsers = () => {
        const defaultUsers = [
            { id: 1, nama: 'Administrator', username: 'admin', email: 'admin@junaraba.rs', password: '123456', role: 'Administrator', status: 'Aktif' },
            { id: 2, nama: 'dr. Budi Santoso, Sp.PD', username: 'dokter', email: 'budi@junaraba.rs', password: '123', role: 'Dokter', status: 'Aktif' },
            { id: 3, nama: 'Pasien Umum', username: 'pasien', email: 'pasien@junaraba.rs', password: '456', role: 'Pasien', status: 'Aktif' }
        ];

        const saved = localStorage.getItem('simrs_database_users');
        if (saved) {
            setUsers(JSON.parse(saved));
        } else {
            setUsers(defaultUsers);
            localStorage.setItem('simrs_database_users', JSON.stringify(defaultUsers));
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleOpenModal = (user = null) => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({ id: null, nama: '', username: '', email: '', password: '', role: 'Dokter', status: 'Aktif' });
        }
        setIsModalOpen(true);
    };

    // Fungsi Simpan (Tambah / Edit) User ke LocalStorage Database Utama
    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.nama || !formData.username || !formData.password) {
            alert('Nama, Username, dan Password wajib diisi untuk keperluan login!');
            return;
        }

        let updatedUsers;
        if (formData.id) {
            updatedUsers = users.map(u => u.id === formData.id ? formData : u);
        } else {
            updatedUsers = [...users, { ...formData, id: Date.now() }];
        }

        setUsers(updatedUsers);
        localStorage.setItem('simrs_database_users', JSON.stringify(updatedUsers));
        setIsModalOpen(false);
        alert('Data user berhasil disimpan! Akun kini sudah bisa digunakan untuk login ke sistem.');
    };

    // Fungsi Hapus User
    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus akun user ini?')) {
            const updatedUsers = users.filter(u => u.id !== id);
            setUsers(updatedUsers);
            localStorage.setItem('simrs_database_users', JSON.stringify(updatedUsers));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Users size={24} /></div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Manajemen Pengguna (User Accounts)</h2>
                        <p className="text-sm text-slate-500">Kelola akun dan kredensial login staf yang terdaftar di SIM RS JUNARABA</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm text-sm"
                >
                    <UserPlus size={18} /> Tambah User Baru
                </button>
            </div>

            {/* Tabel Data User */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 text-slate-400 bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nama Pengguna</th>
                            <th className="px-6 py-4 font-semibold">Username Login</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Hak Akses (Role)</th>
                            <th className="px-6 py-4 font-semibold">Status Akun</th>
                            <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {users.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Belum ada user terdaftar.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                                            {user.nama.charAt(0)}
                                        </div>
                                        {user.nama}
                                    </td>
                                    <td className="px-6 py-4 font-mono font-semibold text-emerald-600">{user.username}</td>
                                    <td className="px-6 py-4 text-slate-600">{user.email || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                                            <Shield size={12} /> {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                                            <CheckCircle size={12} /> {user.status || 'Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah / Edit User */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">{formData.id ? 'Edit Data User' : 'Tambah User Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                                <input type="text" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} placeholder="Contoh: Dr. H. Ahmad, Sp.THT" required className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Username (Untuk Login)</label>
                                    <div className="relative flex items-center">
                                        <User size={14} className="absolute left-3 text-slate-400" />
                                        <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="username" required className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                                    <div className="relative flex items-center">
                                        <Key size={14} className="absolute left-3 text-slate-400" />
                                        <input type="text" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="password" required className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Staf</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@junaraba.rs" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Hak Akses (Role)</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white font-semibold">
                                    <option>Administrator</option>
                                    <option>Dokter</option>
                                    <option>Apoteker</option>
                                    <option>Perawat / Staf</option>
                                    <option>Pasien</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition shadow-sm mt-4">
                                Simpan & Daftarkan Akun
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}