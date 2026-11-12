import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import prisma from './config/prisma';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route (responds to both /api/health and /health)
const healthHandler = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'SI Barber Coolmant API Server is running smoothly',
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString()
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Diagnostic TiDB Cloud Database Route
const testDbHandler = async (req: Request, res: Response) => {
  try {
    const [barbers, services, products] = await Promise.all([
      prisma.barber.count(),
      prisma.service.count(),
      prisma.product.count(),
    ]);

    res.json({
      status: 'success',
      database: 'Connected to TiDB Cloud',
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      counts: {
        barbers,
        services,
        products,
      },
    });
  } catch (error: any) {
    console.error('Database connection test error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal terhubung ke database',
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'TIDAK DITEMUKAN',
    });
  }
};
app.get('/api/test-db', testDbHandler);
app.get('/test-db', testDbHandler);

// Main API Router (mounted at both /api and / to handle all Vercel rewrite patterns)
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
