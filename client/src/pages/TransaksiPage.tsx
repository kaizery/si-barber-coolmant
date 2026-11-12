import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

interface Transaction {
  id: number;
  invoiceCode: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  barber?: { name: string };
  items: Array<{ name: string; quantity: number }>;
}

export const TransaksiPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ totalOmzet: 0, countTrx: 0, avgTicket: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [payFilter, setPayFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, payFilter]);

  const fetchTransactions = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (payFilter !== 'all') params.paymentMethod = payFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const filteredTransactions = transactions.filter((trx) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const inCode = trx.invoiceCode.toLowerCase().includes(q);
    const inCustomer = trx.customerName.toLowerCase().includes(q);
    const inBarber = trx.barber?.name.toLowerCase().includes(q);
    return inCode || inCustomer || inBarber;
  });

  return (
    <div className="flex flex-col min-h-screen bg-surface select-none pb-28 md:pb-8">
      <Header title="Riwayat Transaksi" badge="Hari Ini" subtitle="GentStyle Barbershop - Cabang Pusat" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Metric Highlights Bento (Responsive 1 col mobile, 3 cols desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Hero Total Omzet Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
                Total Omzet Terkumpul
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                +14.8%
              </span>
            </div>

            <div className="my-2 flex items-baseline justify-between">
              <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                Rp {summary.totalOmzet.toLocaleString('id-ID')}
              </h2>
              <span className="text-[11px] font-semibold text-on-surface-variant">Target 3.0 Jt</span>
            </div>

            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((summary.totalOmzet / 3000000) * 100))}%` }}
              ></div>
            </div>
          </div>

          {/* Secondary Metric: Total Tiket */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Total Tiket</span>
              <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-extrabold text-on-surface">{summary.countTrx}</p>
              <span className="text-[11px] text-on-surface-variant">Pelanggan Terlayani</span>
            </div>
          </div>

          {/* Secondary Metric: Rata-rata per Tiket */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Rata-rata Tiket</span>
              <div className="w-7 h-7 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[16px]">analytics</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-extrabold text-on-surface">
                Rp {summary.avgTicket.toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] text-on-surface-variant">Per Kursi Kapster</span>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID transaksi, nama pelanggan, atau kapster..."
              className="w-full h-10 pl-9 pr-3 bg-surface-container-low rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {/* Filter Status */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              {[
                { id: 'all', label: 'Semua Status' },
                { id: 'completed', label: 'Selesai' },
                { id: 'pending', label: 'Pending' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === st.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Filter Payment */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              {[
                { id: 'all', label: 'Semua Bayar' },
                { id: 'qris', label: 'QRIS' },
                { id: 'cash', label: 'Tunai' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayFilter(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    payFilter === p.id
                      ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Transaction Cards Grid (Responsive 1 col mobile, 2 col tablet, 3 col desktop) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredTransactions.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-surface-container-lowest rounded-2xl border border-slate-100">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">receipt_long</span>
              <p className="text-sm font-bold text-on-surface">Tidak ada data transaksi</p>
              <span className="text-xs text-on-surface-variant">Coba sesuaikan kata kunci pencarian atau filter Anda.</span>
            </div>
          ) : (
            filteredTransactions.map((trx) => (
              <article
                key={trx.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 relative overflow-hidden transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    trx.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                ></div>

                <div className="flex flex-col gap-2.5 pl-1.5">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-primary">{trx.invoiceCode}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            trx.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {trx.status === 'COMPLETED' ? 'Selesai' : 'Pending'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-on-surface mt-1">{trx.customerName}</h3>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-extrabold text-sm text-primary">
                        Rp {Number(trx.totalAmount).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5 mt-0.5">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {new Date(trx.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Detail Info Slab */}
                  <div className="p-2.5 bg-surface-container-low rounded-xl flex items-center justify-between text-on-surface">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-primary shadow-xs flex-shrink-0">
                        <span className="material-symbols-outlined text-[16px]">content_cut</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-on-surface truncate">
                          {trx.items && trx.items.length > 0
                            ? trx.items.map((it) => it.name).join(', ')
                            : 'Layanan Haircut'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant truncate">
                          Kapster: {trx.barber?.name || 'Budi'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs flex-shrink-0 ml-2">
                      <span className="material-symbols-outlined text-[12px] text-primary">
                        {trx.paymentMethod === 'QRIS' ? 'qr_code_2' : 'payments'}
                      </span>
                      {trx.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* Action Footer Buttons */}
                <div className="mt-3 pt-2 flex items-center justify-end gap-2 border-t border-slate-50 pl-1.5">
                  <button
                    type="button"
                    onClick={() => alert(`Mencetak struk ${trx.invoiceCode}...`)}
                    className="h-8 px-3 rounded-full bg-surface-container text-primary text-[11px] font-bold flex items-center gap-1 hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">print</span>
                    Cetak
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Kirim struk WA ke ${trx.customerName}...`)}
                    className="h-8 px-3 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">chat</span>
                    Kirim WA
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default TransaksiPage;
