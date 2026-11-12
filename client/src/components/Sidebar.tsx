import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ResetDataModal from './ResetDataModal';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Kasir POS', icon: 'point_of_sale' },
  { to: '/transaksi', label: 'Riwayat Transaksi', icon: 'receipt_long' },
  { to: '/katalog', label: 'Katalog & Layanan', icon: 'content_cut' },
  { to: '/kapster', label: 'Staf & Kapster', icon: 'badge' },
  { to: '/keuangan', label: 'Kas & Keuangan', icon: 'account_balance_wallet' },
  { to: '/laporan', label: 'Laporan Rekapan', icon: 'bar_chart' },
];

export const Sidebar: React.FC = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-surface-container-lowest border-r border-surface-container h-screen sticky top-0 z-40 p-4 justify-between flex-shrink-0 select-none">
        <div className="flex flex-col gap-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">content_cut</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[15px] text-on-surface tracking-tight truncate">
                  GentStyle
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                  POS
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant truncate">
                Cabang Pusat
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <span className="px-3 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-1">
              Menu Operasional
            </span>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm scale-102'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'font-bold' : ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Tombol Reset Data di Sidebar */}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-rose-600">restart_alt</span>
                <span>Reset Data Sistem</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Session Footer */}
        <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between border border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface truncate">Admin Kasir</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Shift Aktif
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            title="Pengaturan & Reset Data"
            className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </aside>

      {/* Modal Dialog */}
      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
