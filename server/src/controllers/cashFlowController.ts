import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCashFlows = async (req: Request, res: Response) => {
  try {
    const cashFlows = await prisma.cashFlow.findMany({
      orderBy: { date: 'desc' },
    });

    const totalIncome = cashFlows
      .filter((c) => c.type === 'INCOME')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const totalExpense = cashFlows
      .filter((c) => c.type === 'EXPENSE')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    const balance = totalIncome - totalExpense;

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
      data: cashFlows,
    });
  } catch (error) {
    console.error('Error fetching cash flows:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data arus kas' });
  }
};

export const createCashFlow = async (req: Request, res: Response) => {
  try {
    const { type, category, amount, description } = req.body;
    const item = await prisma.cashFlow.create({
      data: {
        type: type === 'EXPENSE' ? 'EXPENSE' : 'INCOME',
        category,
        amount: Number(amount),
        description,
      },
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Error creating cash flow:', error);
    res.status(500).json({ success: false, message: 'Gagal mencatat transaksi kas' });
  }
};

