import { PrismaClient, RestaurantStatus, OrderStatus, PaymentStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.user.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.restaurant.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const restPasswordHash1 = await bcrypt.hash('burger123', salt);
  const restPasswordHash2 = await bcrypt.hash('sushi123', salt);
  const restPasswordHash3 = await bcrypt.hash('pizza123', salt);

  // 1. Create Restaurants
  const r1 = await prisma.restaurant.create({
    data: {
      name: 'Burger Palace',
      email: 'info@burgerpalace.com',
      phone: '+15550101',
      address: '101 Burger Ave, Food City',
      status: RestaurantStatus.ACTIVE,
      subscriptionPlan: 'premium',
      slug: 'burger-palace',
      password: restPasswordHash1,
    },
  });

  const r2 = await prisma.restaurant.create({
    data: {
      name: 'Sushi Zen',
      email: 'hello@sushizen.com',
      phone: '+15550102',
      address: '202 Sakura Lane, Kyoto',
      status: RestaurantStatus.ACTIVE,
      subscriptionPlan: 'enterprise',
      slug: 'sushi-zen',
      password: restPasswordHash2,
    },
  });

  const r3 = await prisma.restaurant.create({
    data: {
      name: 'Pizzeria Bella',
      email: 'order@pizzeriabella.com',
      phone: '+15550103',
      address: '303 Napoli St, Rome',
      status: RestaurantStatus.SUSPENDED,
      subscriptionPlan: 'basic',
      slug: 'pizzeria-bella',
      password: restPasswordHash3,
    },
  });

  console.log('✅ Restaurants seeded');

  // 2. Create Users (Super Admin, Restaurant Admin)
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const staffPasswordHash = await bcrypt.hash('staff123', salt);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@sasspos.com',
      passwordHash: adminPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Burger Manager',
      email: 'manager@burgerpalace.com',
      passwordHash: staffPasswordHash,
      role: UserRole.RESTAURANT_ADMIN,
    },
  });

  console.log('✅ Users seeded');

  // 3. Create Orders (Spread across past 40 days to verify analytics)
  const getPastDate = (daysAgo: number, hoursAgo: number = 12) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo);
    return d;
  };

  const ordersData = [
    // Today
    { restaurantId: r1.id, customerName: 'Alice Smith', totalAmount: 45.90, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(0, 2) },
    { restaurantId: r1.id, customerName: 'Bob Jones', totalAmount: 22.50, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(0, 4) },
    { restaurantId: r2.id, customerName: 'Charlie Brown', totalAmount: 110.00, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(0, 1) },
    { restaurantId: r2.id, customerName: 'David Lee', totalAmount: 85.00, orderStatus: OrderStatus.PENDING, paymentStatus: PaymentStatus.PENDING, createdAt: getPastDate(0, 3) },
    
    // Yesterday
    { restaurantId: r1.id, customerName: 'Emily Clark', totalAmount: 38.00, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(1) },
    { restaurantId: r2.id, customerName: 'Fiona Gallagher', totalAmount: 120.00, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(1) },
    
    // 5 days ago
    { restaurantId: r1.id, customerName: 'George Miller', totalAmount: 62.10, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(5) },
    { restaurantId: r2.id, customerName: 'Hannah Abbott', totalAmount: 95.00, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(5) },
    
    // 15 days ago
    { restaurantId: r1.id, customerName: 'Ian Malcolm', totalAmount: 18.50, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(15) },
    { restaurantId: r2.id, customerName: 'Julia Roberts', totalAmount: 150.00, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(15) },
    
    // 35 days ago (different month)
    { restaurantId: r1.id, customerName: 'Kevin Bacon', totalAmount: 55.00, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, createdAt: getPastDate(35) },
    { restaurantId: r2.id, customerName: 'Luna Lovegood', totalAmount: 75.00, orderStatus: OrderStatus.DECLINED, paymentStatus: PaymentStatus.FAILED, createdAt: getPastDate(38) },
  ];

  for (const o of ordersData) {
    await prisma.order.create({
      data: o,
    });
  }

  console.log('✅ Orders seeded');
  console.log('🌱 Seeding process complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
