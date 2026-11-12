import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'SI Barber Coolmant API Server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Main API Router
app.use('/api', apiRouter);

export default app;
