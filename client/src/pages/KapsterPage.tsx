import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

interface Barber {
  id: number;
  name: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  commissionRate: number;
  stats?: {
    totalServices: number;
    totalOmzet: number;
    totalCommission: number;
  };
}

export const KapsterPage: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    commissionRate: 40,
    isActive: true,
  });

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    phone: '',
    commissionRate: 40,
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const res = await api.get('/staff');
      if (res.data.success) {
        setBarbers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDetail = (b: Barber) => {
    setSelectedBarber(b);
    setIsEditing(false);
    setEditForm({
      name: b.name,
      phone: b.phone || '',
      commissionRate: b.commissionRate || 40,
      isActive: b.isActive ?? true,
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedBarber) return;
    try {
      const res = await api.put(`/staff/${selectedBarber.id}`, {
        name: editForm.name,
        phone: editForm.phone,
        commissionRate: Number(editForm.commissionRate),
        isActive: editForm.isActive,
      });

      if (res.data.success) {
        alert('Data kapster berhasil diperbarui!');
        setSelectedBarber(null);
        setIsEditing(false);
        fetchBarbers();
      }
    } catch (err) {
      alert('Gagal memperbarui data kapster.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedBarber) return;
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus kapster "${selectedBarber.name}"? Riwayat transaksi sebelumnya tetap aman tersimpan.`
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/staff/${selectedBarber.id}`);
      if (res.data.success) {
        alert('Kapster berhasil dihapus dari sistem.');
        setSelectedBarber(null);
        fetchBarbers();
      }
    } catch (err) {
      alert('Gagal menghapus kapster.');
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) {
      alert('Nama kapster wajib diisi.');
      return;
    }

    try {
      const res = await api.post('/staff', {
        name: createForm.name,
        phone: createForm.phone,
        commissionRate: Number(createForm.commissionRate),
      });

      if (res.data.success) {
        alert('Kapster baru berhasil ditambahkan!');
        setIsCreateModalOpen(false);
        setCreateForm({ name: '', phone: '', commissionRate: 40 });
        fetchBarbers();
      }
    } catch (err) {
      alert('Gagal menambahkan kapster baru.');
      console.error(err);
    }
  };

  const totalCuts = barbers.reduce((acc, b) => acc + (b.stats?.totalServices || 0), 0);
  const totalOmzet = barbers.reduce((acc, b) => acc + (b.stats?.totalOmzet || 0), 0);
  const totalCommission = barbers.reduce((acc, b) => acc + (b.stats?.totalCommission || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-surface select-none pb-28 md:pb-8">
      <Header title="Staf & Kapster" badge="Komisi" subtitle="GentStyle Barbershop - Cabang Pusat" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Top Summary Bento Grid (Responsive 1 col mobile, 3 cols desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-primary text-on-primary rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-primary-fixed">Bagi Hasil Otomatis</span>
              <p className="text-2xl font-extrabold mt-1">40% Rata-rata</p>
              <span className="text-[11px] text-white/80 mt-0.5">Dihitung otomatis per tiket kasir</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">percent</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant">Kepala Terlayani Hari Ini</span>
              <p className="text-2xl font-extrabold text-on-surface mt-1">{totalCuts} Orang</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                Omzet Rp {totalOmzet.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">face</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant">Akumulasi Komisi Staf</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                Rp {totalCommission.toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] text-on-surface-variant mt-0.5">{barbers.length} Kapster Terdaftar</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
          </div>
        </section>

        {/* Action Header & "+ Tambah Kapster" Button */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="text-sm md:text-base font-extrabold text-on-surface">Daftar Kapster & Staf Barbershop</h3>
            <span className="text-xs text-on-surface-variant">Klik kartu kapster untuk melihat rincian performa, edit tarif, atau hapus</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary-container whitespace-nowrap active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Tambah Kapster Baru</span>
          </button>
        </section>

        {/* Kapster Card Grid (Clickable Cards with Detail) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {barbers.map((b, idx) => (
            <div
              key={b.id}
              onClick={() => handleOpenDetail(b)}
              className="cursor-pointer bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
                        {b.name.charAt(0)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        b.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}></span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                          {b.name}
                        </h3>
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          Kursi 0{idx + 1}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant mt-0.5">
                        {b.phone || '0812-3456-7890'}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    b.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.isActive ? `Aktif (${b.commissionRate}%)` : 'Non-Aktif'}
                  </span>
                </div>

                {/* 3 Box Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-surface-container-low rounded-xl text-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium">Kepala</span>
                    <span className="text-sm font-bold text-on-surface mt-0.5">
                      {b.stats?.totalServices || 0}
                    </span>
                  </div>
                  <div className="flex flex-col border-x border-slate-200">
                    <span className="text-[10px] text-on-surface-variant font-medium">Omzet</span>
                    <span className="text-xs font-bold text-primary mt-0.5">
                      Rp {Number(b.stats?.totalOmzet || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium">Komisi</span>
                    <span className="text-xs font-extrabold text-emerald-600 mt-0.5">
                      Rp {Number(b.stats?.totalCommission || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">touch_app</span>
                  Klik untuk kelola
                </span>
                <span className="text-xs font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Detail & Aksi <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* DETAIL & EDIT MODAL FOR KAPSTER */}
      {selectedBarber && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-slate-100">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {selectedBarber.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-extrabold text-on-surface">
                    {isEditing ? 'Edit Data Kapster' : 'Detail Profil Kapster'}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {isEditing ? 'Perbarui informasi kapster & bagi hasil' : 'Ringkasan performa dan komisi'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBarber(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* VIEW MODE */}
            {!isEditing ? (
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Nama Lengkap</span>
                  <h4 className="text-lg font-extrabold text-on-surface mt-0.5">{selectedBarber.name}</h4>
                </div>

                <div className="grid grid-cols-2 gap-2.5 p-3 bg-surface-container-low rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-on-surface-variant">Bagi Hasil Komisi</span>
                    <span className="text-base font-extrabold text-primary mt-0.5">
                      {selectedBarber.commissionRate}%
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] text-on-surface-variant">Status Kapster</span>
                    <span className={`text-xs font-extrabold mt-1 inline-flex items-center gap-1 ${
                      selectedBarber.isActive ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        selectedBarber.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}></span>
                      {selectedBarber.isActive ? 'Aktif Bertugas' : 'Istirahat / Non-Aktif'}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Contact */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-emerald-600">call</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-medium">No. Telepon / WhatsApp</span>
                      <span className="text-xs font-bold text-on-surface">{selectedBarber.phone || 'Belum diisi'}</span>
                    </div>
                  </div>

                  {selectedBarber.phone && (
                    <a
                      href={`https://wa.me/${selectedBarber.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-emerald-700"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                      Kirim WA
                    </a>
                  )}
                </div>

                {/* Performa Summary */}
                <div className="flex flex-col gap-1.5 p-3.5 bg-surface-container-low rounded-2xl">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Statistik Performa Tiket
                  </span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Total Kepala Terlayani:</span>
                    <span className="font-bold text-on-surface">{selectedBarber.stats?.totalServices || 0} Orang</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Total Omzet Dihasilkan:</span>
                    <span className="font-bold text-primary">
                      Rp {Number(selectedBarber.stats?.totalOmzet || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200">
                    <span className="font-semibold text-on-surface">Total Komisi Hak Kapster:</span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      Rp {Number(selectedBarber.stats?.totalCommission || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: EDIT & HAPUS */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="h-11 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit Kapster
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              /* EDIT MODE */
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Nama Kapster</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Komisi Bagi Hasil (%)</label>
                    <input
                      type="number"
                      value={editForm.commissionRate}
                      onChange={(e) => setEditForm({ ...editForm, commissionRate: Number(e.target.value) })}
                      className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Status</label>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                      className={`h-10 rounded-xl text-xs font-bold transition-all ${
                        editForm.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {editForm.isActive ? 'Aktif Melayani' : 'Non-Aktif'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="h-10 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="h-10 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KAPSTER BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-on-surface">Pendaftaran Kapster Baru</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Nama Kapster / Staf</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dimas, Hendra, Satria..."
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Persentase Bagi Hasil Komisi (%)</label>
                <input
                  type="number"
                  required
                  value={createForm.commissionRate}
                  onChange={(e) => setCreateForm({ ...createForm, commissionRate: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-primary focus:outline-none"
                />
                <span className="text-[11px] text-on-surface-variant">
                  Standar barbershop umumnya 40% per tiket jasa potong.
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md mt-2 hover:bg-primary-container"
              >
                Simpan & Aktifkan di Kasir
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KapsterPage;
