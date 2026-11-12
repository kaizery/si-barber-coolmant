import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getBarbers = async (req: Request, res: Response) => {
  try {
    const barbers = await prisma.barber.findMany({
      include: {
        transactions: {
          where: {
            status: 'COMPLETED',
          },
          select: {
            id: true,
            totalAmount: true,
            barberCommission: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const formatted = barbers.map((b) => {
      const totalServices = b.transactions.length;
      const totalOmzet = b.transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
      const totalCommission = b.transactions.reduce((sum, t) => sum + Number(t.barberCommission), 0);

      return {
        id: b.id,
        name: b.name,
        phone: b.phone,
        avatar: b.avatar,
        isActive: b.isActive,
        commissionRate: b.commissionRate,
        stats: {
          totalServices,
          totalOmzet,
          totalCommission,
        },
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching barbers:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data staf & kapster' });
  }
};

export const createBarber = async (req: Request, res: Response) => {
  try {
    const { name, phone, commissionRate = 40.0, isActive = true } = req.body;
    const barber = await prisma.barber.create({
      data: {
        name,
        phone,
        commissionRate: Number(commissionRate),
        isActive: Boolean(isActive),
      },
    });
    res.status(201).json({ success: true, message: 'Kapster berhasil ditambahkan', data: barber });
  } catch (error) {
    console.error('Error creating barber:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan kapster baru' });
  }
};

export const updateBarber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, commissionRate, isActive } = req.body;
    const barber = await prisma.barber.update({
      where: { id: Number(id) },
      data: {
        name,
        phone,
        commissionRate: commissionRate !== undefined ? Number(commissionRate) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });
    res.json({ success: true, message: 'Data kapster berhasil diperbarui', data: barber });
  } catch (error) {
    console.error('Error updating barber:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui data kapster' });
  }
};

export const deleteBarber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const barberId = Number(id);

    // Lepas relasi transaksi agar riwayat transaksi tetap aman
    await prisma.transaction.updateMany({
      where: { barberId },
      data: { barberId: null },
    });

    await prisma.barber.delete({
      where: { id: barberId },
    });

    res.json({ success: true, message: 'Kapster berhasil dihapus dari sistem' });
  } catch (error) {
    console.error('Error deleting barber:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus data kapster' });
  }
};
