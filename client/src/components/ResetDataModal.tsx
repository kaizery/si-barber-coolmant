import React, { useState } from 'react';
import api from '../services/api';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'TRANSACTIONS_ONLY' | 'FACTORY_RESET'>('TRANSACTIONS_ONLY');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleReset = async () => {
    if (confirmText.trim().toUpperCase() !== 'RESET') {
      alert('Ketik "RESET" dengan huruf besar untuk mengonfirmasi tindakan ini.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/system/reset', { mode });
      if (res.data.success) {
        alert(res.data.message);
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal mereset data sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border border-rose-100">
        
        {/* Header with Warning Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">delete_forever</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-extrabold text-base text-on-surface">Reset Data Sistem</h3>
              <span className="text-xs text-rose-600 font-semibold">Tindakan Permanen & Berbahaya</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Choice of Reset Mode */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Pilih Mode Reset
          </label>

          <div
            onClick={() => setMode('TRANSACTIONS_ONLY')}
            className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col gap-1 ${
              mode === 'TRANSACTIONS_ONLY'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-slate-200 bg-surface-container-low hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
                Reset Transaksi & Kas Saja (Direkomendasikan)
              </span>
              <input
                type="radio"
                name="resetMode"
                checked={mode === 'TRANSACTIONS_ONLY'}
                onChange={() => setMode('TRANSACTIONS_ONLY')}
                className="text-primary"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant pl-5">
              Menghapus semua riwayat transaksi kasir, komisi, dan catatan arus kas. Data Kapster dan Katalog produk tetap aman.
            </p>
          </div>

          <div
            onClick={() => setMode('FACTORY_RESET')}
            className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col gap-1 ${
              mode === 'FACTORY_RESET'
                ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600'
                : 'border-slate-200 bg-surface-container-low hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-rose-600">restart_alt</span>
                Reset Total ke Setelan Pabrik (Factory Reset)
              </span>
              <input
                type="radio"
                name="resetMode"
                checked={mode === 'FACTORY_RESET'}
                onChange={() => setMode('FACTORY_RESET')}
                className="text-rose-600"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant pl-5">
              Mengosongkan seluruh database dan mengembalikan ke data awal sampel barbershop (3 kapster, menu potong, stok pomade default).
            </p>
          </div>
        </div>

        {/* Security Confirmation Input */}
        <div className="flex flex-col gap-1.5 p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200">
          <label className="text-[11px] font-bold text-rose-800">
            Ketik kata <span className="font-extrabold underline">RESET</span> untuk konfirmasi:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="RESET"
            className="w-full h-10 px-3 bg-white rounded-xl text-xs font-extrabold text-rose-700 border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 uppercase tracking-widest placeholder:text-slate-300"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={confirmText.trim().toUpperCase() !== 'RESET' || loading}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Ya, Hapus & Reset</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetDataModal;

