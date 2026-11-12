import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Kasir', icon: 'point_of_sale' },
  { to: '/transaksi', label: 'Transaksi', icon: 'receipt_long' },
  { to: '/katalog', label: 'Katalog', icon: 'content_cut' },
  { to: '/kapster', label: 'Kapster', icon: 'badge' },
  { to: '/keuangan', label: 'Kas', icon: 'account_balance_wallet' },
  { to: '/laporan', label: 'Laporan', icon: 'bar_chart' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container shadow-[0_-4px_20px_rgba(0,104,96,0.08)]">
      <div className="flex items-center justify-around h-16 px-space-xs max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[50px] h-12 rounded-full transition-all ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'font-bold' : ''
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
