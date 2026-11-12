import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { status, paymentMethod, search } = req.query;

    const whereClause: any = {};

    if (status && status !== 'all') {
      whereClause.status = (status as string).toUpperCase();
    }

    if (paymentMethod && paymentMethod !== 'all') {
      whereClause.paymentMethod = (paymentMethod as string).toUpperCase();
    }

    if (search) {
      const q = String(search);
      whereClause.OR = [
        { invoiceCode: { contains: q } },
        { customerName: { contains: q } },
        { barber: { name: { contains: q } } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        barber: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Summary metrics
    const totalOmzet = transactions
      .filter((t) => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const countTrx = transactions.length;
    const avgTicket = countTrx > 0 ? Math.round(totalOmzet / countTrx) : 0;

    res.json({
      success: true,
      summary: {
        totalOmzet,
        countTrx,
        avgTicket,
      },
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat transaksi' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: {
        barber: true,
        items: {
          include: {
            service: true,
            product: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error fetching transaction detail:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail transaksi' });
  }
};

