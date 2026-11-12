import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import KasirPage from './pages/KasirPage';
import TransaksiPage from './pages/TransaksiPage';
import KatalogPage from './pages/KatalogPage';
import KapsterPage from './pages/KapsterPage';
import KeuanganPage from './pages/KeuanganPage';
import LaporanPage from './pages/LaporanPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row w-full text-on-surface">
        {/* Desktop Sidebar (hidden on mobile) */}
        <Sidebar />

        {/* Main Content Area (Responsive Full Width) */}
        <div className="flex-1 flex flex-col min-h-screen w-full relative overflow-x-hidden">
          <Routes>
            <Route path="/" element={<KasirPage />} />
            <Route path="/transaksi" element={<TransaksiPage />} />
            <Route path="/katalog" element={<KatalogPage />} />
            <Route path="/kapster" element={<KapsterPage />} />
            <Route path="/keuangan" element={<KeuanganPage />} />
            <Route path="/laporan" element={<LaporanPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Mobile Bottom Nav (hidden on desktop) */}
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
