import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

interface Barber {
  id: number;
  name: string;
  phone?: string;
  avatar?: string;
  commissionRate: number;
}

interface Item {
  id: number;
  name: string;
  price: number;
  type: 'SERVICE' | 'PRODUCT';
  durationMinutes?: number;
  stock?: number;
  category?: { name: string };
}

interface CartItem extends Item {
  quantity: number;
}

export const KasirPage: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Item[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'SERVICE' | 'PRODUCT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('Pelanggan Umum');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS' | 'DEBIT'>('QRIS');
  const [cashPaid, setCashPaid] = useState<number>(100000);
  const [isMobileCheckoutOpen, setIsMobileCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastTrx, setLastTrx] = useState<any>(null);

  useEffect(() => {
    fetchPOSData();
  }, []);

  const fetchPOSData = async () => {
    try {
      const res = await api.get('/pos');
      if (res.data.success) {
        const sList = res.data.data.services.map((s: any) => ({ ...s, type: 'SERVICE' }));
        const pList = res.data.data.products.map((p: any) => ({ ...p, type: 'PRODUCT' }));
        setServices(sList);
        setProducts(pList);
        setBarbers(res.data.data.barbers);
        if (res.data.data.barbers.length > 0) {
          setSelectedBarberId(res.data.data.barbers[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.type === item.type);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.type === item.type);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prev.filter((i) => !(i.id === item.id && i.type === item.type));
    });
  };

  const getItemCountInCart = (item: Item) => {
    const found = cart.find((i) => i.id === item.id && i.type === item.type);
    return found ? found.quantity : 0;
  };

  const totalAmount = cart.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0);
  const totalItems = cart.reduce((sum, it) => sum + it.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Pilih minimal satu layanan atau produk terlebih dahulu.');
      return;
    }
    try {
      const payload = {
        customerName: customerName.trim() || 'Pelanggan Umum',
        barberId: selectedBarberId,
        paymentMethod,
        discount: 0,
        cashPaid: paymentMethod === 'CASH' ? Number(cashPaid) : totalAmount,
        items: cart.map((it) => ({
          serviceId: it.type === 'SERVICE' ? it.id : null,
          productId: it.type === 'PRODUCT' ? it.id : null,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
        })),
      };

      const res = await api.post('/pos/checkout', payload);
      if (res.data.success) {
        setLastTrx(res.data.data);
        setIsMobileCheckoutOpen(false);
        setIsSuccessModalOpen(true);
        setCart([]);
      }
    } catch (err) {
      alert('Gagal memproses transaksi kasir.');
      console.error(err);
    }
  };

  const rawItems = [
    ...(activeCategory === 'ALL' || activeCategory === 'SERVICE' ? services : []),
    ...(activeCategory === 'ALL' || activeCategory === 'PRODUCT' ? products : []),
  ];

  const displayedItems = rawItems.filter((it) => {
    if (!searchQuery) return true;
    return it.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  return (
    <div className="flex flex-col min-h-screen bg-surface select-none">
      <Header title="Kasir POS" badge="Live" subtitle="GentStyle Barbershop - Cabang Pusat" />

      {/* Main Dual-Layout: Desktop Split (Catalog Left + Cart Right), Mobile Single Column */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 md:p-6 gap-6">
        
        {/* LEFT COLUMN: Catalog, Kapster, Categories (Expands on Desktop) */}
        <div className="flex-1 flex flex-col gap-5 pb-28 md:pb-6 min-w-0">
          
          {/* Top Bar: Search & Kapster Selector */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
            
            {/* Kapster Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs md:text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
                  Pilih Kapster Bertugas
                </span>
                <span className="text-[11px] font-semibold text-primary">
                  Komisi Otomatis 40%
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {barbers.map((b, idx) => {
                  const isSelected = selectedBarberId === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBarberId(b.id)}
                      className={`cursor-pointer rounded-xl p-2.5 flex flex-col items-center gap-1 text-center transition-all ${
                        isSelected
                          ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-sm scale-102'
                          : 'bg-surface-container-low text-on-surface opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-white text-primary'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {b.name.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
                      </div>
                      <span className="font-bold text-xs truncate w-full mt-0.5">{b.name}</span>
                      <span
                        className={`text-[10px] font-medium ${
                          isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'
                        }`}
                      >
                        Kursi 0{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search Input & Category Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama layanan cukur atau produk pomade..."
                  className="w-full h-10 pl-9 pr-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'ALL', label: `Semua (${services.length + products.length})` },
                  { id: 'SERVICE', label: `Layanan (${services.length})` },
                  { id: 'PRODUCT', label: `Produk (${products.length})` },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === c.id
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Catalog Cards (Responsive 2 to 4 columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {displayedItems.map((item) => {
              const count = getItemCountInCart(item);
              const isSelected = count > 0;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => addToCart(item)}
                  className={`cursor-pointer bg-surface-container-lowest rounded-2xl p-3.5 flex flex-col justify-between shadow-xs transition-all relative overflow-hidden group border ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                      : 'border-slate-100 hover:border-primary/40 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-extrabold shadow-md z-10">
                      {count}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="w-full h-24 rounded-xl bg-surface-container-low flex items-center justify-center text-primary/30 relative overflow-hidden group-hover:scale-102 transition-transform">
                      <span className="material-symbols-outlined text-[36px]">
                        {item.type === 'SERVICE' ? 'content_cut' : 'sanitizer'}
                      </span>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.type === 'SERVICE' ? `${item.durationMinutes || 30} Min` : `Stok: ${item.stock || 10}`}
                      </span>
                    </div>

                    <span className="font-bold text-xs md:text-sm text-on-surface line-clamp-2 leading-snug">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-50">
                    <span className="font-extrabold text-xs md:text-sm text-primary">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </span>

                    <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Desktop Sticky Cashier & Order Panel (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col w-84 lg:w-96 bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-slate-100 sticky top-22 h-[calc(100vh-110px)] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">point_of_sale</span>
              <h2 className="font-extrabold text-base text-on-surface">Struk & Keranjang</h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
              {totalItems} Item
            </span>
          </div>

          {/* Customer & Kapster Info */}
          <div className="flex flex-col gap-2 my-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant">Nama Pelanggan</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Pelanggan Umum / Member"
                className="w-full h-9 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between px-3 py-2 bg-surface-container-low rounded-xl text-xs">
              <span className="text-on-surface-variant font-medium">Kapster Aktif:</span>
              <span className="font-bold text-primary">{selectedBarber?.name || 'Belum Dipilih'}</span>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 my-2">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">shopping_basket</span>
                <span className="text-xs font-bold text-on-surface">Keranjang Kosong</span>
                <p className="text-[11px] mt-0.5">Klik salah satu layanan atau produk di katalog.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low"
                >
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span className="text-xs font-bold text-on-surface truncate">{item.name}</span>
                    <span className="text-[11px] text-primary font-bold">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-on-surface shadow-xs font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs font-bold hover:bg-primary-container transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-on-surface-variant">Metode Bayar</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'QRIS', label: 'QRIS', icon: 'qr_code_2' },
                { id: 'CASH', label: 'Tunai', icon: 'payments' },
                { id: 'DEBIT', label: 'Debit', icon: 'credit_card' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`h-9 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold transition-all ${
                    paymentMethod === m.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === 'CASH' && (
              <div className="flex flex-col gap-1 p-2 bg-surface-container-low rounded-xl mt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant font-medium">Uang Diterima:</span>
                  <input
                    type="number"
                    value={cashPaid}
                    onChange={(e) => setCashPaid(Number(e.target.value))}
                    className="w-24 h-7 text-right px-2 bg-white rounded-lg font-bold text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="font-semibold text-on-surface-variant">Kembalian:</span>
                  <span className="font-extrabold text-emerald-600">
                    Rp {Math.max(0, cashPaid - totalAmount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {/* Total and Checkout Button */}
            <div className="pt-2 flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-on-surface-variant">Total Tagihan</span>
                <span className="text-xl font-extrabold text-primary">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Selesaikan Transaksi (Cetak Struk)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY: Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-18 left-0 right-0 px-4 max-w-md mx-auto z-40 animate-slide-up">
          <div className="bg-primary text-on-primary rounded-2xl p-3 shadow-xl flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold text-sm">
                {totalItems}x
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-primary-fixed">Total Pesanan</span>
                <span className="font-extrabold text-base tracking-tight">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileCheckoutOpen(true)}
              className="bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-transform"
            >
              <span>Bayar</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* MOBILE-ONLY: Checkout Drawer Modal */}
      {isMobileCheckoutOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-0">
          <div className="bg-surface-container-lowest w-full rounded-t-3xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">point_of_sale</span>
                <h3 className="font-bold text-base text-on-surface">Konfirmasi Pembayaran</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileCheckoutOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Nama Pelanggan */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Nama Pelanggan</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-semibold focus:outline-none"
                placeholder="Pelanggan Umum..."
              />
            </div>

            {/* Item list */}
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low text-xs"
                >
                  <span className="font-bold text-on-surface truncate">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Metode Bayar */}
            <div className="grid grid-cols-3 gap-2">
              {['QRIS', 'CASH', 'DEBIT'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m as any)}
                  className={`h-10 rounded-xl text-xs font-bold ${
                    paymentMethod === m ? 'bg-primary text-white' : 'bg-surface-container-low'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-lg mt-2"
            >
              Bayar Rp {totalAmount.toLocaleString('id-ID')}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal (Shared Mobile & Desktop) */}
      {isSuccessModalOpen && lastTrx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 flex flex-col items-center text-center shadow-2xl animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[32px]">check</span>
            </div>
            <h3 className="font-extrabold text-lg text-on-surface">Transaksi Berhasil!</h3>
            <span className="text-xs font-bold text-primary mt-0.5">{lastTrx.invoiceCode}</span>
            <p className="text-xs text-on-surface-variant mt-1">
              Pelanggan: <strong className="text-on-surface">{lastTrx.customerName}</strong>
            </p>

            <div className="w-full bg-surface-container-low rounded-2xl p-3 my-3 text-left flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Metode Bayar:</span>
                <span className="font-bold text-on-surface">{lastTrx.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Total Bayar:</span>
                <span className="font-extrabold text-primary">
                  Rp {Number(lastTrx.totalAmount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => alert(`Mencetak Struk ${lastTrx.invoiceCode} ke printer thermal...`)}
                className="h-10 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Cetak Struk
              </button>
              <button
                type="button"
                onClick={() => alert(`Mengirim struk WhatsApp ke ${lastTrx.customerName}...`)}
                className="h-10 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Kirim WA
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="mt-3 text-xs font-bold text-on-surface-variant hover:text-on-surface"
            >
              Kembali ke Kasir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KasirPage;
