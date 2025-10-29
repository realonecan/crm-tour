import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'demo123',
      role: 'ADMIN',
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@demo.com' },
    update: {},
    create: {
      name: 'Manager User',
      email: 'manager@demo.com',
      password: 'demo123',
      role: 'MANAGER',
    },
  });

  console.log('✅ Users created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'adventure' },
      update: {},
      create: {
        title: 'Adventure',
        slug: 'adventure',
        icon: '🏔️',
        color: '#FF6B6B',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cultural' },
      update: {},
      create: {
        title: 'Cultural',
        slug: 'cultural',
        icon: '🏛️',
        color: '#4ECDC4',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'nature' },
      update: {},
      create: {
        title: 'Nature',
        slug: 'nature',
        icon: '🌲',
        color: '#95E1D3',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beach' },
      update: {},
      create: {
        title: 'Beach & Island',
        slug: 'beach',
        icon: '🏖️',
        color: '#38BDF8',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'wildlife' },
      update: {},
      create: {
        title: 'Wildlife',
        slug: 'wildlife',
        icon: '🦁',
        color: '#F59E0B',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create tours
  const tours = await Promise.all([
    prisma.tour.upsert({
      where: { slug: 'mountain-trek' },
      update: {},
      create: {
        title: 'Mountain Trek Adventure',
        slug: 'mountain-trek',
        type: 'Group',
        duration: 5,
        difficulty: 'Hard',
        basePrice: 1200,
        status: 'PUBLISHED',
        description: 'An exciting 5-day mountain trekking adventure through stunning peaks',
        gallery: JSON.stringify([]),
        inclusions: JSON.stringify(['Professional Guide', 'All Meals', 'Accommodation', 'Equipment']),
        exclusions: JSON.stringify(['Flight Tickets', 'Travel Insurance', 'Personal Expenses']),
        meetingPoint: 'Mountain Base Camp',
        categoryId: categories[0].id,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'cultural-heritage' },
      update: {},
      create: {
        title: 'Cultural Heritage Tour',
        slug: 'cultural-heritage',
        type: 'Group',
        duration: 3,
        difficulty: 'Easy',
        basePrice: 450,
        status: 'PUBLISHED',
        description: 'Explore ancient temples and historical sites',
        gallery: JSON.stringify([]),
        inclusions: JSON.stringify(['Expert Guide', 'Entrance Fees', 'Lunch']),
        exclusions: JSON.stringify(['Hotel', 'Dinner', 'Transportation']),
        meetingPoint: 'City Center Museum',
        categoryId: categories[1].id,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'rainforest-expedition' },
      update: {},
      create: {
        title: 'Rainforest Expedition',
        slug: 'rainforest-expedition',
        type: 'Private',
        duration: 7,
        difficulty: 'Medium',
        basePrice: 2100,
        status: 'PUBLISHED',
        description: 'Discover the wonders of the tropical rainforest',
        gallery: JSON.stringify([]),
        inclusions: JSON.stringify(['Expert Naturalist', 'All Meals', 'Camping Equipment', 'Permits']),
        exclusions: JSON.stringify(['Flights', 'Insurance']),
        meetingPoint: 'Rainforest Visitor Center',
        categoryId: categories[2].id,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'island-hopping' },
      update: {},
      create: {
        title: 'Island Hopping Paradise',
        slug: 'island-hopping',
        type: 'Group',
        duration: 4,
        difficulty: 'Easy',
        basePrice: 890,
        status: 'PUBLISHED',
        description: 'Visit pristine beaches and crystal-clear waters',
        gallery: JSON.stringify([]),
        inclusions: JSON.stringify(['Boat Transport', 'Snorkeling Gear', 'Lunch', 'Guide']),
        exclusions: JSON.stringify(['Hotel', 'Breakfast', 'Dinner']),
        meetingPoint: 'Harbor Dock 5',
        categoryId: categories[3].id,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'safari-adventure' },
      update: {},
      create: {
        title: 'Safari Adventure',
        slug: 'safari-adventure',
        type: 'Group',
        duration: 6,
        difficulty: 'Medium',
        basePrice: 1850,
        status: 'PUBLISHED',
        description: 'Experience wildlife in their natural habitat',
        gallery: JSON.stringify([]),
        inclusions: JSON.stringify(['4x4 Safari Vehicle', 'Professional Guide', 'All Meals', 'Lodge Accommodation']),
        exclusions: JSON.stringify(['Flights', 'Tips', 'Souvenirs']),
        meetingPoint: 'Safari Lodge Reception',
        categoryId: categories[4].id,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'city-food-tour' },
      update: {},
      create: {
        title: 'City Food & Culture Tour',
        slug: 'city-food-tour',
        type: 'Group',
        duration: 1,
        difficulty: 'Easy',
        basePrice: 120,
        status: 'DRAFT',
        description: 'Taste authentic local cuisine and explore vibrant markets',
        gallery: JSON.stringify([]),
        inclusions: JSON.stringify(['Food Samples', 'Local Guide', 'Market Visit']),
        exclusions: JSON.stringify(['Additional Purchases', 'Transportation']),
        meetingPoint: 'Central Market Square',
        categoryId: categories[1].id,
      },
    }),
  ]);

  console.log('✅ Tours created');

  // Create tour dates
  const now = new Date();
  const tourDates = [];
  
  for (let i = 0; i < tours.length; i++) {
    const tour = tours[i];
    // Create 3-4 dates for each tour
    for (let j = 1; j <= 3; j++) {
      const date = new Date(now);
      date.setDate(date.getDate() + (i * 10) + (j * 7));
      
      const tourDate = await prisma.tourDate.create({
        data: {
          tourId: tour.id,
          date: date,
          maxGroupSize: 10 + (i * 2),
          priceOverride: j === 2 ? tour.basePrice + 100 : null,
        },
      });
      tourDates.push(tourDate);
    }
  }

  console.log('✅ Tour dates created');

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        fullName: 'John Smith',
        phone: '+1-555-0101',
        email: 'john.smith@email.com',
        telegram: '@johnsmith',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'Sarah Johnson',
        phone: '+1-555-0102',
        email: 'sarah.j@email.com',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'Michael Chen',
        phone: '+1-555-0103',
        email: 'mchen@email.com',
        telegram: '@mchen',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'Emily Davis',
        phone: '+1-555-0104',
        email: 'emily.davis@email.com',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'David Wilson',
        phone: '+1-555-0105',
        email: 'dwilson@email.com',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'Lisa Anderson',
        phone: '+1-555-0106',
        email: 'lisa.a@email.com',
        telegram: '@lisaanderson',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'James Brown',
        phone: '+1-555-0107',
        email: 'jbrown@email.com',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'Maria Garcia',
        phone: '+1-555-0108',
        email: 'maria.g@email.com',
      },
    }),
  ]);

  console.log('✅ Customers created');

  // Create bookings
  const bookings = [];
  for (let i = 0; i < 12; i++) {
    const tourDate = tourDates[i % tourDates.length];
    const customer = customers[i % customers.length];
    const statuses = ['NEW', 'PAID', 'PAID', 'PAID', 'CANCELLED'];
    const status = statuses[i % statuses.length];
    
    const booking = await prisma.booking.create({
      data: {
        tourDateId: tourDate.id,
        customerId: customer.id,
        people: Math.floor(Math.random() * 3) + 1,
        totalPrice: (tourDate.priceOverride || tours[Math.floor(i / 3)].basePrice) * (Math.floor(Math.random() * 3) + 1),
        status: status as any,
        note: i % 3 === 0 ? 'Special dietary requirements' : null,
      },
    });
    bookings.push(booking);
  }

  console.log('✅ Bookings created');

  // Create leads
  await Promise.all([
    prisma.lead.create({
      data: {
        name: 'Robert Taylor',
        phone: '+1-555-0201',
        email: 'rtaylor@email.com',
        message: 'Interested in the Mountain Trek for December',
        status: 'OPEN',
        tourId: tours[0].id,
        assignedTo: managerUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Jennifer White',
        phone: '+1-555-0202',
        email: 'jwhite@email.com',
        message: 'Looking for a family-friendly tour',
        status: 'IN_PROGRESS',
        assignedTo: managerUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Thomas Moore',
        phone: '+1-555-0203',
        message: 'Want to book Safari Adventure for 4 people',
        status: 'OPEN',
        tourId: tours[4].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Patricia Martinez',
        phone: '+1-555-0204',
        email: 'pmartinez@email.com',
        message: 'Interested in cultural tours',
        status: 'IN_PROGRESS',
        tourId: tours[1].id,
        assignedTo: adminUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Christopher Lee',
        phone: '+1-555-0205',
        message: 'Need information about Island Hopping',
        status: 'OPEN',
        tourId: tours[3].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Amanda Clark',
        phone: '+1-555-0206',
        email: 'aclark@email.com',
        message: 'Group booking inquiry for 8 people',
        status: 'CLOSED',
        assignedTo: managerUser.id,
      },
    }),
  ]);

  console.log('✅ Leads created');

  console.log('🎉 Seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${tours.length} tours`);
  console.log(`   - ${tourDates.length} tour dates`);
  console.log(`   - ${customers.length} customers`);
  console.log(`   - ${bookings.length} bookings`);
  console.log('   - 6 leads');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
