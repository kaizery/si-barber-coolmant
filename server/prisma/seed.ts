import { PrismaClient, PaymentMethod, TransactionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Buat Barbers / Kapster
  const budi = await prisma.barber.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Budi Santoso',
      phone: '081234567890',
      commissionRate: 40.0,
      isActive: true,
    },
  });

  const rian = await prisma.barber.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Rian Pratama',
      phone: '081298765432',
      commissionRate: 40.0,
      isActive: true,
    },
  });

  const kevin = await prisma.barber.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Kevin Wijaya',
      phone: '081345678901',
      commissionRate: 40.0,
      isActive: true,
    },
  });

  // 2. Kategori
  const catHaircut = await prisma.category.upsert({
    where: { name: 'Haircut & Styling' },
    update: {},
    create: { name: 'Haircut & Styling' },
  });

  const catGrooming = await prisma.category.upsert({
    where: { name: 'Shaving & Care' },
    update: {},
    create: { name: 'Shaving & Care' },
  });

  const catProducts = await prisma.category.upsert({
    where: { name: 'Produk Pomade & Haircare' },
    update: {},
    create: { name: 'Produk Pomade & Haircare' },
  });

  // 3. Layanan (Services)
  const serviceGentleman = await prisma.service.create({
    data: {
      name: 'Gentleman Grooming',
      description: 'Haircut + Cuci Rambut + Pijat Relaksasi + Styling Pomade',
      price: 85000,
      durationMinutes: 45,
      categoryId: catHaircut.id,
    },
  });

  const serviceRegular = await prisma.service.create({
    data: {
      name: 'Haircut Reguler',
      description: 'Potong rambut rapi + blow dry styling',
      price: 50000,
      durationMinutes: 30,
      categoryId: catHaircut.id,
    },
  });

  const serviceKids = await prisma.service.create({
    data: {
      name: 'Haircut Kids',
      description: 'Potong rambut khusus anak dengan kapster sabar & telaten',
      price: 45000,
      durationMinutes: 30,
      categoryId: catHaircut.id,
    },
  });

  const serviceShaving = await prisma.service.create({
    data: {
      name: 'Shaving & Beard Trim',
      description: 'Cukur kumis/jenggot rapi dengan handuk hangat',
      price: 35000,
      durationMinutes: 20,
      categoryId: catGrooming.id,
    },
  });

  // 4. Produk (Products)
  const prodPomadeMatte = await prisma.product.create({
    data: {
      name: 'Strong Hold Matte Clay Pomade (100g)',
      sku: 'POM-MAT-01',
      description: 'Hasil matte natural, tahan seharian, mudah dibilas',
      price: 75000,
      costPrice: 45000,
      stock: 24,
      categoryId: catProducts.id,
    },
  });

  const prodPomadeWater = await prisma.product.create({
    data: {
      name: 'Water Based Glossy Pomade (100g)',
      sku: 'POM-WAT-01',
      description: 'Hasil klimis wangi maskulin elegan',
      price: 65000,
      costPrice: 38000,
      stock: 18,
      categoryId: catProducts.id,
    },
  });

  const prodTonic = await prisma.product.create({
    data: {
      name: 'Hair Tonic Ginseng & Tea Tree (150ml)',
      sku: 'TONIC-01',
      description: 'Menyegarkan kulit kepala dan menguatkan akar rambut',
      price: 55000,
      costPrice: 32000,
      stock: 15,
      categoryId: catProducts.id,
    },
  });

  // 5. Transaksi Sampel Hari Ini (sama seperti di desain Stitch)
  await prisma.transaction.create({
    data: {
      invoiceCode: 'TRX-8821',
      customerName: 'Dimas Setiawan',
      customerPhone: '081299988877',
      subtotal: 135000,
      discount: 0,
      totalAmount: 135000,
      cashPaid: 135000,
      paymentMethod: PaymentMethod.QRIS,
      status: TransactionStatus.COMPLETED,
      barberId: budi.id,
      barberCommission: 24000,
      items: {
        create: [
          {
            name: 'Haircut Reguler',
            price: 60000,
            quantity: 1,
            subtotal: 60000,
            serviceId: serviceRegular.id,
          },
          {
            name: 'Strong Hold Matte Clay Pomade',
            price: 75000,
            quantity: 1,
            subtotal: 75000,
            productId: prodPomadeMatte.id,
          },
        ],
      },
    },
  });

  await prisma.transaction.create({
    data: {
      invoiceCode: 'TRX-8820',
      customerName: 'Arya Permana',
      subtotal: 85000,
      totalAmount: 85000,
      cashPaid: 100000,
      cashChange: 15000,
      paymentMethod: PaymentMethod.CASH,
      status: TransactionStatus.COMPLETED,
      barberId: rian.id,
      barberCommission: 34000,
      items: {
        create: [
          {
            name: 'Gentleman Grooming',
            price: 85000,
            quantity: 1,
            subtotal: 85000,
            serviceId: serviceGentleman.id,
          },
        ],
      },
    },
  });

  await prisma.transaction.create({
    data: {
      invoiceCode: 'TRX-8819',
      customerName: 'Farhan Zaki',
      subtotal: 45000,
      totalAmount: 45000,
      paymentMethod: PaymentMethod.DEBIT,
      status: TransactionStatus.COMPLETED,
      barberId: kevin.id,
      barberCommission: 18000,
      items: {
        create: [
          {
            name: 'Haircut Kids',
            price: 45000,
            quantity: 1,
            subtotal: 45000,
            serviceId: serviceKids.id,
          },
        ],
      },
    },
  });

  // 6. Arus Kas Awal
  await prisma.cashFlow.create({
    data: {
      type: 'INCOME',
      category: 'Modal Awal Kasir',
      amount: 300000,
      description: 'Uang kembalian awal kasir buka pagi',
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

