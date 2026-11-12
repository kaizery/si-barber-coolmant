import { Router } from 'express';
import { getPOSData, createTransaction } from '../controllers/posController';
import { getTransactions, getTransactionById } from '../controllers/transactionController';
import { getBarbers, createBarber, updateBarber, deleteBarber } from '../controllers/staffController';
import {
  getCatalog,
  createService,
  updateService,
  deleteService,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/catalogController';
import { getCashFlows, createCashFlow } from '../controllers/cashFlowController';
import { getReportSummary } from '../controllers/reportController';
import { resetData } from '../controllers/systemController';

const router = Router();

// POS & Transaksi
router.get('/pos', getPOSData);
router.post('/pos/checkout', createTransaction);

router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransactionById);

// Katalog Layanan
router.get('/catalog', getCatalog);
router.post('/catalog/services', createService);
router.put('/catalog/services/:id', updateService);
router.delete('/catalog/services/:id', deleteService);

// Katalog Produk
router.post('/catalog/products', createProduct);
router.put('/catalog/products/:id', updateProduct);
router.delete('/catalog/products/:id', deleteProduct);

// Kapster & Staf
router.get('/staff', getBarbers);
router.post('/staff', createBarber);
router.put('/staff/:id', updateBarber);
router.delete('/staff/:id', deleteBarber);

// Keuangan & Kas
router.get('/cash-flow', getCashFlows);
router.post('/cash-flow', createCashFlow);

// Laporan Rekapan
router.get('/reports', getReportSummary);

// Pengaturan & Reset Sistem
router.post('/system/reset', resetData);

export default router;
