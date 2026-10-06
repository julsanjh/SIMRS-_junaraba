import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen & Layout
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';

// Import Halaman (Pages)
import Antrian from './pages/Antrian';
import PendaftaranPoli from './pages/PendaftaranPoli';
import InputPasien from './pages/InputPasien';
import PemeriksaanDokter from './pages/PemeriksaanDokter';
import Apotek from './pages/Apotek';
import DataPasien from './pages/DataPasien';
import Departemen from './pages/Departemen';
import DataDokter from './pages/DataDokter';
import LandingPage from './pages/LandingPage';
import PengaturanAkun from './pages/PengaturanAkun'; // <-- Diperbarui di sini
import Dashboard from './pages/Dashboard';
import RawatInap from './pages/RawatInap';
import ManajemenUser from './pages/ManajemenUser';
import DaftarPage from './pages/DaftarPage';
import LupaPasswordPage from './pages/LupaPasswordPage';

// Placeholder untuk halaman yang belum dibuat
const PlaceholderPage = ({ title }) => (
  <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
    <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
    <p>Halaman ini sedang dalam tahap pengembangan.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/daftar" element={<DaftarPage />} />
        <Route path="/lupa-password" element={<LupaPasswordPage />} />

        {/* Redirect otomatis dari root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rute Privat (Dibungkus oleh Layout) */}
        <Route path="/dasbor" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="antrian" element={<Antrian />} />
          <Route path="input-pasien" element={<InputPasien />} />
          <Route path="pendaftaran-poli" element={<PendaftaranPoli />} />
          <Route path="pemeriksaan" element={<PemeriksaanDokter />} />
          <Route path="apotek" element={<Apotek />} />

          {/* Rute Modul Master Data */}
          <Route path="pasien" element={<DataPasien />} />
          <Route path="dokter" element={<DataDokter />} />
          <Route path="departemen" element={<Departemen />} />
          <Route path="manajemen-user" element={<ManajemenUser />} />

          {/* Rute Modul Lainnya */}
          <Route path="rawat-inap" element={<RawatInap />} />
          <Route path="pengaturan" element={<PengaturanAkun />} /> {/* <-- Diperbarui di sini */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}