import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  type?: 'SERVICE';
  category?: { name: string };
}

interface ProductItem {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  type?: 'PRODUCT';
  category?: { name: string };
}

export const KatalogPage: React.FC = () => {
  const [tab, setTab] = useState<'SERVICES' | 'PRODUCTS'>('SERVICES');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedItem, setSelectedItem] = useState<{ item: any; type: 'SERVICE' | 'PRODUCT' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<'SERVICE' | 'PRODUCT'>('SERVICE');

  // Edit form state
  const [editForm, setEditForm] = useState<any>({});

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    price: '',
    durationMinutes: '30',
    stock: '15',
    sku: '',
    description: '',
  });

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await api.get('/catalog');
      if (res.data.success) {
        setServices(res.data.data.services);
        setProducts(res.data.data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDetail = (item: any, type: 'SERVICE' | 'PRODUCT') => {
    setSelectedItem({ item, type });
    setIsEditing(false);
    setEditForm({ ...item });
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;
    try {
      if (selectedItem.type === 'SERVICE') {
        const res = await api.put(`/catalog/services/${selectedItem.item.id}`, {
          name: editForm.name,
          description: editForm.description,
          price: Number(editForm.price),
          durationMinutes: Number(editForm.durationMinutes),
        });
        if (res.data.success) {
          alert('Layanan berhasil diperbarui!');
          setSelectedItem(null);
          setIsEditing(false);
          fetchCatalog();
        }
      } else {
        const res = await api.put(`/catalog/products/${selectedItem.item.id}`, {
          name: editForm.name,
          sku: editForm.sku,
          description: editForm.description,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
        });
        if (res.data.success) {
          alert('Produk berhasil diperbarui!');
          setSelectedItem(null);
          setIsEditing(false);
          fetchCatalog();
        }
      }
    } catch (err) {
      alert('Gagal menyimpan perubahan.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus ${selectedItem.type === 'SERVICE' ? 'layanan' : 'produk'} "${selectedItem.item.name}"?`
    );
    if (!confirmDelete) return;

    try {
      if (selectedItem.type === 'SERVICE') {
        await api.delete(`/catalog/services/${selectedItem.item.id}`);
      } else {
        await api.delete(`/catalog/products/${selectedItem.item.id}`);
      }
      alert('Item berhasil dihapus.');
      setSelectedItem(null);
      fetchCatalog();
    } catch (err) {
      alert('Gagal menghapus item.');
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (createType === 'SERVICE') {
        await api.post('/catalog/services', {
          name: createForm.name,
          price: Number(createForm.price),
          durationMinutes: Number(createForm.durationMinutes),
          description: createForm.description,
        });
      } else {
        await api.post('/catalog/products', {
          name: createForm.name,
          price: Number(createForm.price),
          stock: Number(createForm.stock),
          sku: createForm.sku,
          description: createForm.description,
        });
      }

      alert('Item baru berhasil ditambahkan!');
      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        price: '',
        durationMinutes: '30',
        stock: '15',
        sku: '',
        description: '',
      });
      fetchCatalog();
    } catch (err) {
      alert('Gagal menambahkan item.');
      console.error(err);
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface select-none pb-28 md:pb-8">
      <Header title="Katalog & Stok" badge="Katalog" subtitle="GentStyle Barbershop - Cabang Pusat" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Top Metric Highlights (Responsive 3 Columns on Desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant">Layanan Aktif</span>
              <p className="text-2xl font-extrabold text-primary mt-1">{services.length} Menu</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">Tersedia di Kasir</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">content_cut</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant">Varian Produk</span>
              <p className="text-2xl font-extrabold text-amber-700 mt-1">{products.length} SKU</p>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Pomade & Haircare</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">sanitizer</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant">Total Nilai Stok</span>
              <p className="text-2xl font-extrabold text-on-surface mt-1">
                Rp {products.reduce((acc, p) => acc + (Number(p.price) * (p.stock || 0)), 0).toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">Stok Terpantau Aman</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
          </div>
        </section>

        {/* Filter Tabs, Search Bar, and '+ Tambah Baru' Button */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Toggle Tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-xl">
            <button
              type="button"
              onClick={() => setTab('SERVICES')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'SERVICES'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Layanan Servis ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('PRODUCTS')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'PRODUCTS'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Produk & Pomade ({products.length})
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 md:max-w-xl">
            {/* Search Box */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari nama ${tab === 'SERVICES' ? 'layanan' : 'produk pomade'}...`}
                className="w-full h-10 pl-9 pr-3 bg-surface-container-low rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* + Tambah Baru Button */}
            <button
              type="button"
              onClick={() => {
                setCreateType(tab === 'SERVICES' ? 'SERVICE' : 'PRODUCT');
                setIsCreateModalOpen(true);
              }}
              className="px-4 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary-container whitespace-nowrap active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Tambah {tab === 'SERVICES' ? 'Layanan' : 'Produk'}</span>
            </button>
          </div>
        </section>

        {/* Catalog Items Grid (Clickable Cards with Hint) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {tab === 'SERVICES' ? (
            filteredServices.map((s) => (
              <div
                key={s.id}
                onClick={() => handleOpenDetail(s, 'SERVICE')}
                className="cursor-pointer bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">content_cut</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      {s.durationMinutes} Menit
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                      {s.description || 'Layanan potong rambut dan grooming premium.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-50">
                  <span className="text-sm font-extrabold text-primary">
                    Rp {Number(s.price).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] font-bold text-on-surface-variant group-hover:text-primary flex items-center gap-0.5">
                    Detail <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleOpenDetail(p, 'PRODUCT')}
                className="cursor-pointer bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-md hover:border-amber-400 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">sanitizer</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      (p.stock || 0) > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      Stok: {p.stock || 0} Pcs
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-on-surface leading-tight group-hover:text-amber-800 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                      {p.description || 'Produk perawatan rambut barbershop berkualitas tinggi.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant">Harga Jual</span>
                    <span className="text-sm font-extrabold text-primary">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant group-hover:text-primary flex items-center gap-0.5">
                    Detail <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* DETAIL & EDIT MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  selectedItem.type === 'SERVICE' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'
                }`}>
                  <span className="material-symbols-outlined text-[24px]">
                    {selectedItem.type === 'SERVICE' ? 'content_cut' : 'sanitizer'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-extrabold text-on-surface">
                    {isEditing ? `Edit ${selectedItem.type === 'SERVICE' ? 'Layanan' : 'Produk'}` : 'Detail Item'}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {selectedItem.type === 'SERVICE' ? 'Layanan Potong & Grooming' : 'Katalog Produk Pomade'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body: VIEW MODE */}
            {!isEditing ? (
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Nama Item</span>
                  <h4 className="text-lg font-extrabold text-on-surface mt-0.5">{selectedItem.item.name}</h4>
                </div>

                <div className="grid grid-cols-2 gap-2.5 p-3 bg-surface-container-low rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-on-surface-variant">Harga Jual</span>
                    <span className="text-base font-extrabold text-primary mt-0.5">
                      Rp {Number(selectedItem.item.price).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] text-on-surface-variant">
                      {selectedItem.type === 'SERVICE' ? 'Estimasi Durasi' : 'Stok Tersedia'}
                    </span>
                    <span className="text-sm font-extrabold text-on-surface mt-0.5">
                      {selectedItem.type === 'SERVICE'
                        ? `${selectedItem.item.durationMinutes} Menit`
                        : `${selectedItem.item.stock || 0} Pcs`}
                    </span>
                  </div>
                </div>

                {selectedItem.type === 'PRODUCT' && selectedItem.item.sku && (
                  <div className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-xl text-xs">
                    <span className="text-on-surface-variant font-medium">Kode SKU:</span>
                    <span className="font-bold text-on-surface font-mono">{selectedItem.item.sku}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Deskripsi</span>
                  <p className="text-xs text-on-surface leading-relaxed p-3 bg-surface-container-low rounded-xl">
                    {selectedItem.item.description || 'Tidak ada deskripsi tambahan.'}
                  </p>
                </div>

                {/* Action Buttons: EDIT & HAPUS */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="h-11 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit Item
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
              /* Modal Body: EDIT MODE */
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Nama</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Harga Jual (Rp)</label>
                    <input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">
                      {selectedItem.type === 'SERVICE' ? 'Durasi (Menit)' : 'Jumlah Stok'}
                    </label>
                    <input
                      type="number"
                      value={selectedItem.type === 'SERVICE' ? editForm.durationMinutes || '' : editForm.stock || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [selectedItem.type === 'SERVICE' ? 'durationMinutes' : 'stock']: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {selectedItem.type === 'PRODUCT' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-on-surface-variant">Kode SKU</label>
                    <input
                      type="text"
                      value={editForm.sku || ''}
                      onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                      className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none font-mono"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Deskripsi</label>
                  <textarea
                    rows={2}
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none"
                  ></textarea>
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

      {/* CREATE NEW ITEM MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-on-surface">Tambah Menu / Item Baru</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Type Switcher */}
            <div className="flex p-1 bg-surface-container-low rounded-xl">
              <button
                type="button"
                onClick={() => setCreateType('SERVICE')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  createType === 'SERVICE' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                Layanan Servis
              </button>
              <button
                type="button"
                onClick={() => setCreateType('PRODUCT')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  createType === 'PRODUCT' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                Produk Pomade
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  Nama {createType === 'SERVICE' ? 'Layanan' : 'Produk'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={createType === 'SERVICE' ? 'Contoh: Hair Tattoo / Coloring' : 'Contoh: Oil Based Pomade'}
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={createForm.price}
                    onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">
                    {createType === 'SERVICE' ? 'Durasi (Menit)' : 'Stok Awal (Pcs)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={createType === 'SERVICE' ? createForm.durationMinutes : createForm.stock}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        [createType === 'SERVICE' ? 'durationMinutes' : 'stock']: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {createType === 'PRODUCT' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant">Kode SKU (Opsional)</label>
                  <input
                    type="text"
                    placeholder="POM-NEW-01"
                    value={createForm.sku}
                    onChange={(e) => setCreateForm({ ...createForm, sku: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none font-mono"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Deskripsi (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md mt-1 hover:bg-primary-container"
              >
                Simpan & Terbitkan ke Kasir
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KatalogPage;
