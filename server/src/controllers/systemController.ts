import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const resetData = async (req: Request, res: Response) => {
  try {
    const { mode = 'TRANSACTIONS_ONLY' } = req.body;

    if (mode === 'TRANSACTIONS_ONLY') {
      // 1. Hapus transaksi & arus kas saja
      await prisma.$transaction([
        prisma.transactionItem.deleteMany(),
        prisma.transaction.deleteMany(),
        prisma.cashFlow.deleteMany(),
        // Reset stok produk kembali ke standar 20 pcs
        prisma.product.updateMany({
          data: { stock: 20 },
        }),
      ]);

      return res.json({
        success: true,
        message: 'Seluruh riwayat transaksi kasir dan arus kas berhasil dikosongkan. Stok produk dikembalikan ke 20 pcs.',
      });
    }

    if (mode === 'FACTORY_RESET') {
      // 2. Reset total dan re-seed data default
      await prisma.$transaction([
        prisma.transactionItem.deleteMany(),
        prisma.transaction.deleteMany(),
        prisma.cashFlow.deleteMany(),
        prisma.service.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany(),
        prisma.barber.deleteMany(),
      ]);

      // Re-seed data bawaan
      const catHaircut = await prisma.category.create({ data: { name: 'Haircut & Styling' } });
      const catCare = await prisma.category.create({ data: { name: 'Shaving & Care' } });
      const catProd = await prisma.category.create({ data: { name: 'Produk Pomade' } });

      await prisma.barber.createMany({
        data: [
          { name: 'Budi Santoso', phone: '081234567890', commissionRate: 40.0, isActive: true },
          { name: 'Rian Pratama', phone: '081298765432', commissionRate: 40.0, isActive: true },
          { name: 'Kevin Wijaya', phone: '081345678901', commissionRate: 40.0, isActive: true },
        ],
      });

      await prisma.service.createMany({
        data: [
          { name: 'Gentleman Grooming', description: 'Haircut + Cuci + Pijat + Styling Pomade', price: 85000, durationMinutes: 45, categoryId: catHaircut.id },
          { name: 'Haircut Reguler', description: 'Potong rambut rapi + blow dry styling', price: 50000, durationMinutes: 30, categoryId: catHaircut.id },
          { name: 'Haircut Kids', description: 'Potong rambut anak sabar & telaten', price: 45000, durationMinutes: 30, categoryId: catHaircut.id },
          { name: 'Shaving & Beard Trim', description: 'Cukur kumis/jenggot handuk hangat', price: 35000, durationMinutes: 20, categoryId: catCare.id },
          { name: 'Hair Coloring Basic', description: 'Cat rambut pria warna fashion/hitam', price: 150000, durationMinutes: 60, categoryId: catHaircut.id },
        ],
      });

      await prisma.product.createMany({
        data: [
          { name: 'Strong Hold Matte Clay Pomade', sku: 'POM-MAT-01', description: 'Hasil matte natural tahan seharian', price: 75000, costPrice: 45000, stock: 24, categoryId: catProd.id },
          { name: 'Water Based Glossy Pomade', sku: 'POM-WAT-01', description: 'Hasil klimis wangi maskulin elegan', price: 65000, costPrice: 38000, stock: 18, categoryId: catProd.id },
          { name: 'Hair Tonic Ginseng (150ml)', sku: 'TONIC-01', description: 'Menyegarkan kulit kepala & anti rontok', price: 55000, costPrice: 32000, stock: 15, categoryId: catProd.id },
        ],
      });

      // Arus kas awal
      await prisma.cashFlow.create({
        data: {
          type: 'INCOME',
          category: 'Modal Awal Kasir',
          amount: 300000,
          description: 'Uang kembalian laci kasir buka pagi',
        },
      });

      return res.json({
        success: true,
        message: 'Sistem berhasil di-reset ke setelan awal pabrik (Factory Reset) beserta data katalog & kapster default.',
      });
    }

    res.status(400).json({ success: false, message: 'Mode reset tidak valid' });
  } catch (error) {
    console.error('Error resetting system data:', error);
    res.status(500).json({ success: false, message: 'Gagal mereset data sistem' });
  }
};

