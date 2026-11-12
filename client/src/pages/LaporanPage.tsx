import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

export const LaporanPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get('/reports');
      if (res.data.success) {
        setReport(res.data.summary);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalRev = Number(report?.totalRevenue || 0);
  const totalComm = Number(report?.totalCommission || 0);
  const netInc = Number(report?.netIncome || 0);
  const trxCount = Number(report?.totalTransactions || 0);

  return (
    <div className="flex flex-col min-h-screen bg-surface select-none pb-28 md:pb-8">
      <Header title="Laporan & Rekap" badge="Owner" subtitle="GentStyle Barbershop - Cabang Pusat" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Top 4 Metrics Grid (Responsive 1 col mobile, 2 col tablet, 4 col desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Hero Laba Bersih */}
          <div className="bg-primary text-on-primary rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-primary-fixed font-semibold">Estimasi Laba Bersih Owner</span>
            <div className="my-1">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                Rp {netInc.toLocaleString('id-ID')}
              </h2>
              <span className="text-[11px] text-white/80">Setelah dipotong bagi hasil kapster</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-200 mt-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Kas Bersih Siap Tarik
            </span>
          </div>

          {/* Omzet Kotor */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Total Omzet Kotor (Gross)</span>
            <div className="my-1">
              <p className="text-2xl font-extrabold text-on-surface">
                Rp {totalRev.toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] text-on-surface-variant">Dari seluruh penjualan & jasa</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Bagi Hasil Kapster */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Bagi Hasil Staf (40%)</span>
            <div className="my-1">
              <p className="text-2xl font-extrabold text-rose-600">
                Rp {totalComm.toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] text-on-surface-variant">Hak komisi kapster hari ini</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          {/* Tiket Terlayani */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Total Pelanggan Kasir</span>
            <div className="my-1">
              <p className="text-2xl font-extrabold text-on-surface">{trxCount} Transaksi</p>
              <span className="text-[11px] text-on-surface-variant">
                Rata-rata: Rp {trxCount > 0 ? Math.round(totalRev / trxCount).toLocaleString('id-ID') : 0} / tiket
              </span>
            </div>
            <span className="text-[10px] font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              Performa Kursi Stabil
            </span>
          </div>
        </section>

        {/* Analytics Breakdown Grid (Responsive 1 col mobile, 2 cols desktop) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Payment Method Distribution */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">pie_chart</span>
                <h3 className="text-sm font-extrabold text-on-surface">Distribusi Metode Pembayaran</h3>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">Hari Ini</span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  label: 'QRIS (Gopay/OVO/BCA/Dana)',
                  amount: report?.paymentBreakdown?.QRIS || 0,
                  icon: 'qr_code_2',
                  barColor: 'bg-emerald-500',
                  badge: 'Paling Populer',
                },
                {
                  label: 'Uang Tunai (Cash Kasir)',
                  amount: report?.paymentBreakdown?.CASH || 0,
                  icon: 'payments',
                  barColor: 'bg-primary',
                  badge: 'Masuk Kas Fisik',
                },
                {
                  label: 'Kartu Debit / EDC BCA',
                  amount: report?.paymentBreakdown?.DEBIT || 0,
                  icon: 'credit_card',
                  barColor: 'bg-amber-500',
                  badge: 'Non-Tunai',
                },
              ].map((m) => {
                const percent = totalRev > 0 ? Math.round((m.amount / totalRev) * 100) : 0;
                return (
                  <div key={m.label} className="flex flex-col gap-1.5 p-3 bg-surface-container-low rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">{m.icon}</span>
                        <span className="text-xs font-bold text-on-surface">{m.label}</span>
                      </div>
                      <span className="text-xs font-extrabold text-primary">
                        Rp {Number(m.amount).toLocaleString('id-ID')} ({percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`${m.barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Insights & Export */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">insights</span>
                  <h3 className="text-sm font-extrabold text-on-surface">Analisis Operasional Barbershop</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  Sangat Baik
                </span>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">verified</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">Layanan Terlaris</span>
                    <span className="text-on-surface-variant mt-0.5">
                      Paket <strong>Gentleman Grooming</strong> dan <strong>Haircut Reguler</strong> menyumbang lebih dari 70% omzet.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">timer</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">Jam Ramai Pengunjung</span>
                    <span className="text-on-surface-variant mt-0.5">
                      Puncak kunjungan pelanggan terjadi antara pukul <strong>13:00 - 15:30</strong> dan <strong>19:00 - 21:00</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => alert('Mengekspor laporan ke format Excel spreadsheet...')}
                className="px-4 py-2 rounded-xl bg-surface-container text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">table_view</span>
                Export Excel
              </button>
              <button
                type="button"
                onClick={() => alert('Mengunduh ringkasan PDF laporan keuangan...')}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                Unduh PDF
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LaporanPage;
