import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getPOSData = async (req: Request, res: Response) => {
  try {
    const [services, products, barbers, categories] = await Promise.all([
      prisma.service.findMany({ include: { category: true } }),
      prisma.product.findMany({ include: { category: true } }),
      prisma.barber.findMany({ where: { isActive: true } }),
      prisma.category.findMany(),
    ]);

    res.json({
      success: true,
      data: {
        services,
        products,
        barbers,
        categories,
      },
    });
  } catch (error) {
    console.error('Error fetching POS data:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data katalog POS' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      customerName = 'Umum',
      customerPhone,
      barberId,
      paymentMethod = 'CASH',
      discount = 0,
      cashPaid = 0,
      notes,
      items, // array of { serviceId?, productId?, name, price, quantity }
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Item transaksi tidak boleh kosong' });
    }

    const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.price) * Number(it.quantity)), 0);
    const totalAmount = Math.max(0, subtotal - Number(discount));
    const cashChange = paymentMethod === 'CASH' && cashPaid > totalAmount ? cashPaid - totalAmount : 0;

    // Hitung estimasi komisi kapster (misal default 40% dari total jasa servis)
    let barberCommission = 0;
    if (barberId) {
      const barber = await prisma.barber.findUnique({ where: { id: Number(barberId) } });
      const rate = barber ? barber.commissionRate / 100 : 0.4;
      const serviceSubtotal = items
        .filter((it: any) => it.serviceId)
        .reduce((sum: number, it: any) => sum + (Number(it.price) * Number(it.quantity)), 0);
      barberCommission = serviceSubtotal * rate;
    }

    // Generate Invoice Code TRX-xxxx
    const countToday = await prisma.transaction.count();
    const invoiceCode = `TRX-${8820 + countToday + 1}`;

    const newTransaction = await prisma.$transaction(async (tx) => {
      // 1. Buat transaksi
      const trx = await tx.transaction.create({
        data: {
          invoiceCode,
          customerName,
          customerPhone,
          subtotal,
          discount,
          totalAmount,
          cashPaid: paymentMethod === 'CASH' ? cashPaid : totalAmount,
          cashChange,
          paymentMethod,
          status: 'COMPLETED',
          barberId: barberId ? Number(barberId) : null,
          barberCommission,
          notes,
          items: {
            create: items.map((it: any) => ({
              serviceId: it.serviceId ? Number(it.serviceId) : null,
              productId: it.productId ? Number(it.productId) : null,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              subtotal: Number(it.price) * Number(it.quantity),
            })),
          },
        },
        include: {
          items: true,
          barber: true,
        },
      });

      // 2. Potong stok jika ada produk fisik
      for (const it of items) {
        if (it.productId) {
          await tx.product.update({
            where: { id: Number(it.productId) },
            data: {
              stock: {
                decrement: Number(it.quantity),
              },
            },
          });
        }
      }

      return trx;
    });

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil disimpan',
      data: newTransaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses transaksi kasir' });
  }
};

