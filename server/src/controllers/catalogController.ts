import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCatalog = async (req: Request, res: Response) => {
  try {
    const [categories, services, products] = await Promise.all([
      prisma.category.findMany(),
      prisma.service.findMany({ include: { category: true } }),
      prisma.product.findMany({ include: { category: true } }),
    ]);

    res.json({
      success: true,
      data: {
        categories,
        services,
        products,
      },
    });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data katalog' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, price, durationMinutes = 30, categoryId } = req.body;
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: Number(price),
        durationMinutes: Number(durationMinutes),
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });
    res.status(201).json({ success: true, message: 'Layanan berhasil ditambahkan', data: service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan layanan baru' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, durationMinutes } = req.body;
    const service = await prisma.service.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: Number(price),
        durationMinutes: Number(durationMinutes),
      },
    });
    res.json({ success: true, message: 'Layanan berhasil diperbarui', data: service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui layanan' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true, message: 'Layanan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus layanan' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, sku, description, price, costPrice = 0, stock = 0, categoryId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price: Number(price),
        costPrice: Number(costPrice),
        stock: Number(stock),
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });
    res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan', data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan produk baru' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, sku, description, price, costPrice = 0, stock = 0 } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        sku,
        description,
        price: Number(price),
        costPrice: Number(costPrice),
        stock: Number(stock),
      },
    });
    res.json({ success: true, message: 'Produk berhasil diperbarui', data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui produk' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus produk' });
  }
};
