import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

export const KeuanganPage: React.FC = () => {
  const [cashFlows, setCashFlows] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCashFlow();
  }, []);

  const fetchCashFlow = async () => {
    try {
      const res = await api.get('/cash-flow');
      if (res.data.success) {
        setCashFlows(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCashFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) {
      alert('Kategori dan nominal wajib diisi.');
      return;
    }

    try {
      const res = await api.post('/cash-flow', {
        type,
        category,
        amount: Number(amount),
        description,
      });

      if (res.data.success) {
        setIsModalOpen(false);
        setCategory('');
        setAmount('');
        setDescription('');
        fetchCashFlow();
      }
    } catch (err) {
      alert('Gagal mencatat transaksi kas.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface select-none pb-28 md:pb-8">
      <Header title="Kas & Keuangan" badge="Kasir" subtitle="GentStyle Barbershop - Cabang Pusat" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Top Metric Highlights (Responsive 3 Columns on Desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-primary text-on-primary rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-primary-fixed font-semibold">Sisa Kas Fisik di Laci (Petty Cash)</span>
            <div className="my-2">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Rp {summary.balance.toLocaleString('id-ID')}
              </h2>
              <span className="text-[11px] text-white/80">Saldo kas riil untuk operasional</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-1"></div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant">Total Kas Masuk</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                +Rp {summary.totalIncome.toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Modal awal & penerimaan</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">arrow_downward</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant">Total Kas Keluar</span>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">
                -Rp {summary.totalExpense.toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Biaya operasional & belanja</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
            </div>
          </div>
        </section>

        {/* Action Header */}
        <section className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-sm md:text-base font-extrabold text-on-surface">Riwayat Arus Kas Masuk & Keluar</h3>
            <span className="text-xs text-on-surface-variant">Catatan pembukuan kas kecil harian</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Catat Kas Baru
          </button>
        </section>

        {/* Cash Flow List (Responsive Grid on Desktop) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {cashFlows.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-surface-container-lowest rounded-2xl border border-slate-100">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">account_balance_wallet</span>
              <p className="text-sm font-bold text-on-surface">Belum ada pencatatan kas</p>
              <span className="text-xs text-on-surface-variant">Klik tombol di atas untuk mencatat kas masuk atau keluar.</span>
            </div>
          ) : (
            cashFlows.map((cf) => (
              <div
                key={cf.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      cf.type === 'INCOME'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {cf.type === 'INCOME' ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-on-surface truncate">{cf.category}</span>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      {cf.description || 'Operasional toko'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0 ml-2">
                  <span
                    className={`text-sm font-extrabold ${
                      cf.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {cf.type === 'INCOME' ? '+' : '-'}Rp {Number(cf.amount).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(cf.date || cf.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Modal Catat Kas */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-extrabold text-base text-on-surface">Catat Transaksi Kas</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCashFlow} className="flex flex-col gap-3">
              <div className="flex p-1 bg-surface-container-low rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                    type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Kas Keluar (Pengeluaran)
                </button>
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                    type === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Kas Masuk (Pemasukan)
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Kategori</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Contoh: Beli Silet, Listrik, Modal Kasir..."
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="50000"
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Keterangan / Catatan</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Catatan tambahan (opsional)..."
                  rows={2}
                  className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md mt-1"
              >
                Simpan Catatan Kas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeuanganPage;
