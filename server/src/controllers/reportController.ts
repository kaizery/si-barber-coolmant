import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getReportSummary = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { status: 'COMPLETED' },
      include: {
        items: true,
        barber: true,
      },
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const totalTransactions = transactions.length;
    const totalCommission = transactions.reduce((sum, t) => sum + Number(t.barberCommission), 0);
    const netIncome = totalRevenue - totalCommission;

    // Payment methods breakdown
    const paymentBreakdown = {
      CASH: 0,
      QRIS: 0,
      DEBIT: 0,
      TRANSFER: 0,
    };

    transactions.forEach((t) => {
      if (t.paymentMethod in paymentBreakdown) {
        paymentBreakdown[t.paymentMethod as keyof typeof paymentBreakdown] += Number(t.totalAmount);
      }
    });

    res.json({
      success: true,
      summary: {
        totalRevenue,
        totalTransactions,
        totalCommission,
        netIncome,
        paymentBreakdown,
      },
    });
  } catch (error) {
    console.error('Error fetching report summary:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil laporan keuangan' });
  }
};

