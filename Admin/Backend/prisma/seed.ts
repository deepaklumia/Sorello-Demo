import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Restaurant Admin data (Categories, Menu Items, Hours)...');

  // Find the seeded restaurants from SuperAdmin
  const restaurants = await prisma.restaurant.findMany();

  if (restaurants.length === 0) {
    console.log('⚠️ No restaurants found in database. Please seed SuperAdmin database first.');
    return;
  }

  // Clear existing menu items, categories, and hours
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.restaurantHours.deleteMany({});

  console.log('🧹 Cleaned existing menu and hours data.');

  for (const restaurant of restaurants) {
    console.log(`🍴 Seeding menu and hours for: ${restaurant.name}`);

    // 1. Create Menu Categories
    const cat1 = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Starters',
        description: 'Appetizers and quick bites to get you started',
      },
    });

    const cat2 = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Main Course',
        description: 'Our signature dishes and hearty meals',
      },
    });

    const cat3 = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Beverages',
        description: 'Refreshing drinks and carbonated beverages',
      },
    });

    // 2. Create Menu Items
    if (restaurant.slug === 'burger-palace') {
      // Starters
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat1.id,
          name: 'Crispy Onion Rings',
          description: 'Golden fried sweet onion rings served with BBQ sauce',
          price: 5.99,
          preparationTime: 8,
          isAvailable: true,
        },
      });
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat1.id,
          name: 'Mozzarella Sticks',
          description: 'Melty mozzarella cheese sticks with marinara dip',
          price: 6.99,
          preparationTime: 7,
          isAvailable: true,
        },
      });

      // Main Course
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat2.id,
          name: 'Double Cheeseburger',
          description: 'Two flame-grilled beef patties, cheddar cheese, lettuce, tomato, and house sauce',
          price: 12.99,
          preparationTime: 12,
          isAvailable: true,
        },
      });
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat2.id,
          name: 'Spicy Chicken Burger',
          description: 'Crispy fried chicken breast, spicy mayo, pickles, and brioche bun',
          price: 10.99,
          preparationTime: 10,
          isAvailable: true,
        },
      });

      // Beverages
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat3.id,
          name: 'Vanilla Milkshake',
          description: 'Thick and creamy milkshake made with real vanilla bean ice cream',
          price: 4.50,
          preparationTime: 5,
          isAvailable: true,
        },
      });
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat3.id,
          name: 'Craft Cola',
          description: 'House-made cola sweetened with organic cane sugar',
          price: 2.99,
          preparationTime: 2,
          isAvailable: true,
        },
      });
    } else if (restaurant.slug === 'sushi-zen') {
      // Starters
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat1.id,
          name: 'Garlic Edamame',
          description: 'Steamed soybeans tossed in roasted garlic and sea salt',
          price: 4.99,
          preparationTime: 5,
          isAvailable: true,
        },
      });

      // Main Course
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat2.id,
          name: 'Dragon Roll',
          description: 'Eel and cucumber inside, topped with avocado, eel sauce, and sesame seeds',
          price: 15.99,
          preparationTime: 15,
          isAvailable: true,
        },
      });
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat2.id,
          name: 'Salmon Nigiri Combo',
          description: '6 pieces of fresh Atlantic salmon nigiri served with pickled ginger',
          price: 18.99,
          preparationTime: 12,
          isAvailable: true,
        },
      });

      // Beverages
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat3.id,
          name: 'Matcha Green Tea',
          description: 'Premium hot Japanese green tea',
          price: 3.50,
          preparationTime: 3,
          isAvailable: true,
        },
      });
    } else {
      // Default / Pizzeria Bella
      // Starters
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat1.id,
          name: 'Garlic Bread with Cheese',
          description: 'Freshly baked baguette with garlic butter and melted mozzarella',
          price: 5.50,
          preparationTime: 8,
          isAvailable: true,
        },
      });

      // Main Course
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat2.id,
          name: 'Pepperoni Supreme Pizza',
          description: 'Pepperoni, mushrooms, green peppers, onions, mozzarella, and classic tomato sauce',
          price: 16.99,
          preparationTime: 14,
          isAvailable: true,
        },
      });

      // Beverages
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: cat3.id,
          name: 'Iced Lemon Tea',
          description: 'Freshly brewed black tea infused with lemon and mint',
          price: 3.00,
          preparationTime: 2,
          isAvailable: true,
        },
      });
    }

    // 3. Create Weekly Hours (0 = Sunday to 6 = Saturday)
    for (let day = 0; day <= 6; day++) {
      const isWeekend = day === 0 || day === 6;
      await prisma.restaurantHours.create({
        data: {
          restaurantId: restaurant.id,
          dayOfWeek: day,
          openingTime: isWeekend ? '10:00' : '08:00',
          closingTime: isWeekend ? '23:00' : '22:00',
          isClosed: false,
        },
      });
    }
  }

  console.log('✅ Restaurant Admin seed data loaded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
