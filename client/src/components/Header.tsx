import React, { useState } from 'react';
import ResetDataModal from './ResetDataModal';

interface HeaderProps {
  title: string;
  badge?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  badge = 'POS',
  subtitle = 'GentStyle Barbershop - Cabang Pusat',
}) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,104,96,0.04)] w-full">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Logo Icon for Mobile */}
            <div className="md:hidden w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">content_cut</span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-[16px] md:text-lg text-on-surface truncate tracking-tight">
                  {title}
                </h1>
                {badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] md:text-xs text-on-surface-variant truncate">
                {subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online & Siap Kasir
            </div>

            {/* Quick Reset Data Button (Visible in Header on Mobile & Desktop) */}
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              title="Reset Data Sistem"
              className="w-9 h-9 flex items-center justify-center rounded-full text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>

            <button
              type="button"
              aria-label="Notifikasi"
              className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>

            <div className="md:hidden w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Modal Dialog */}
      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </>
  );
};

export default Header;
