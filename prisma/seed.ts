import { PrismaClient, UserRole, EventStatus, BookingStatus, InvoiceStatus, PaymentMethod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@venueos.com' },
    update: {},
    create: {
      fullName: 'Admin User',
      email: 'admin@venueos.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+1234567890',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const coordinator = await prisma.user.upsert({
    where: { email: 'coordinator@venueos.com' },
    update: {},
    create: {
      fullName: 'Coordinator User',
      email: 'coordinator@venueos.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+1234567891',
      role: UserRole.COORDINATOR,
      isActive: true,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@venueos.com' },
    update: {},
    create: {
      fullName: 'Client User',
      email: 'client@venueos.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+1234567892',
      role: UserRole.CLIENT,
      isActive: true,
    },
  });

  const finance = await prisma.user.upsert({
    where: { email: 'finance@venueos.com' },
    update: {},
    create: {
      fullName: 'Finance User',
      email: 'finance@venueos.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+1234567893',
      role: UserRole.FINANCE,
      isActive: true,
    },
  });

  const operations = await prisma.user.upsert({
    where: { email: 'operations@venueos.com' },
    update: {},
    create: {
      fullName: 'Operations User',
      email: 'operations@venueos.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+1234567894',
      role: UserRole.OPERATIONS,
      isActive: true,
    },
  });

  console.log('✅ Users created');

  // 2. Create Spaces
  const spaces = await Promise.all([
    prisma.space.upsert({
      where: { id: 'space-1' },
      update: {},
      create: {
        id: 'space-1',
        name: 'Grand Banquet Hall',
        type: 'Banquet Hall',
        capacity: 300,
        hourlyRate: 150,
        description: 'Luxurious banquet hall with chandeliers and stage',
        amenities: JSON.stringify(['Projector', 'Sound System', 'Stage', 'Dance Floor']),
        isAvailable: true,
        requiresDeposit: true,
      },
    }),
    prisma.space.upsert({
      where: { id: 'space-2' },
      update: {},
      create: {
        id: 'space-2',
        name: 'Conference Room A',
        type: 'Conference Room',
        capacity: 50,
        hourlyRate: 80,
        description: 'Modern conference room with video conferencing',
        amenities: JSON.stringify(['Projector', 'Video Conferencing', 'Whiteboard']),
        isAvailable: true,
        requiresDeposit: false,
      },
    }),
    prisma.space.upsert({
      where: { id: 'space-3' },
      update: {},
      create: {
        id: 'space-3',
        name: 'Rooftop Terrace',
        type: 'Outdoor',
        capacity: 100,
        hourlyRate: 120,
        description: 'Scenic rooftop terrace with city views',
        amenities: JSON.stringify(['Outdoor Lighting', 'Heaters', 'Sound System']),
        isAvailable: true,
        requiresDeposit: true,
      },
    }),
  ]);

  console.log('✅ Spaces created');

  // 3. Create Equipment
  const equipment = await Promise.all([
    prisma.equipment.upsert({
      where: { id: 'equip-1' },
      update: {},
      create: {
        id: 'equip-1',
        name: '4K Projector',
        category: 'AV',
        description: 'High-definition projector for presentations',
        quantity: 5,
        rentalPrice: 50,
        isAvailable: true,
      },
    }),
    prisma.equipment.upsert({
      where: { id: 'equip-2' },
      update: {},
      create: {
        id: 'equip-2',
        name: 'Wireless Microphone Set',
        category: 'AV',
        description: 'Set of 4 wireless microphones',
        quantity: 3,
        rentalPrice: 30,
        isAvailable: true,
      },
    }),
    prisma.equipment.upsert({
      where: { id: 'equip-3' },
      update: {},
      create: {
        id: 'equip-3',
        name: 'Stage Lighting Kit',
        category: 'Lighting',
        description: 'Professional stage lighting with 8 fixtures',
        quantity: 2,
        rentalPrice: 80,
        isAvailable: true,
      },
    }),
  ]);

  console.log('✅ Equipment created');

  // 4. Create Vendors
  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: { id: 'vendor-1' },
      update: {},
      create: {
        id: 'vendor-1',
        name: 'Gourmet Catering Co',
        category: 'Catering',
        email: 'info@gourmetcatering.com',
        phone: '+1234567895',
        address: '123 Food Street',
        description: 'Premium catering services for all events',
        rating: 4.8,
      },
    }),
    prisma.vendor.upsert({
      where: { id: 'vendor-2' },
      update: {},
      create: {
        id: 'vendor-2',
        name: 'Elegant Events Florist',
        category: 'Florist',
        email: 'info@elegantflorist.com',
        phone: '+1234567896',
        address: '456 Flower Avenue',
        description: 'Beautiful floral arrangements',
        rating: 4.9,
      },
    }),
    prisma.vendor.upsert({
      where: { id: 'vendor-3' },
      update: {},
      create: {
        id: 'vendor-3',
        name: 'AV Solutions Pro',
        category: 'AV',
        email: 'info@avsolutions.com',
        phone: '+1234567897',
        address: '789 Tech Park',
        description: 'Professional AV equipment and technicians',
        rating: 4.7,
      },
    }),
  ]);

  console.log('✅ Vendors created');

  // 5. Create Events
  const event = await prisma.event.upsert({
    where: { id: 'event-1' },
    update: {},
    create: {
      id: 'event-1',
      title: 'Tech Conference 2026',
      description: 'Annual technology conference with 200+ attendees',
      type: 'Conference',
      status: EventStatus.CONFIRMED,
      clientId: client.id,
    },
  });

  console.log('✅ Events created');

  // 6. Create Bookings
  const booking = await prisma.booking.upsert({
    where: { id: 'booking-1' },
    update: {},
    create: {
      id: 'booking-1',
      eventId: event.id,
      spaceId: spaces[0].id,
      userId: client.id,
      date: new Date('2026-08-15'),
      startTime: '09:00',
      endTime: '17:00',
      guestCount: 200,
      status: BookingStatus.CONFIRMED,
      notes: 'Main conference event with keynote speakers',
    },
  });

  console.log('✅ Bookings created');

  // 7. Create Invoices
  const invoice = await prisma.invoice.upsert({
    where: { id: 'invoice-1' },
    update: {},
    create: {
      id: 'invoice-1',
      eventId: event.id,
      clientId: client.id,
      number: 'INV-2026-001',
      amount: 5000,
      status: InvoiceStatus.FULLY_PAID,
      dueDate: new Date('2026-07-15'),
      pdfUrl: 'https://example.com/invoices/inv-001.pdf',
      sentAt: new Date('2026-07-01'),
    },
  });

  console.log('✅ Invoices created');

  // 8. Create Payments
  await prisma.payment.upsert({
    where: { id: 'payment-1' },
    update: {},
    create: {
      id: 'payment-1',
      invoiceId: invoice.id,
      clientId: client.id,
      amount: 5000,
      method: PaymentMethod.BANK_TRANSFER,
      paidAt: new Date('2026-07-10'),
    },
  });

  console.log('✅ Payments created');

  // 9. Create Enquiries
  await prisma.enquiry.upsert({
    where: { id: 'enquiry-1' },
    update: {},
    create: {
      id: 'enquiry-1',
      clientId: client.id,
      title: 'Wedding Reception Enquiry',
      description: 'Looking for a venue for a wedding reception with 150 guests. Need outdoor space for photos.',
      briefText: 'Wedding reception, 150 guests, outdoor photos required',
      status: 'PROPOSAL_SENT',
    },
  });

  console.log('✅ Enquiries created');

  // 10. Create Timeline Tasks
 // 10. Create Timeline Tasks
// First, get existing users for assignment
const opsUser = await prisma.user.findFirst({
  where: { role: UserRole.OPERATIONS },
});

const coordinatorUser = await prisma.user.findFirst({
  where: { role: UserRole.COORDINATOR },
});

await Promise.all([
  prisma.timeline.upsert({
    where: { id: 'timeline-1' },
    update: {},
    create: {
      id: 'timeline-1',
      eventId: event.id,
      title: 'Venue Setup',
      description: 'Set up tables, chairs, and stage',
      startTime: '08:00',
      endTime: '09:00',
      assignedTo: opsUser?.id || null, // ✅ Use actual User ID
      completed: true,
    },
  }),
  prisma.timeline.upsert({
    where: { id: 'timeline-2' },
    update: {},
    create: {
      id: 'timeline-2',
      eventId: event.id,
      title: 'AV Equipment Test',
      description: 'Test projector, sound system, and microphones',
      startTime: '08:30',
      endTime: '09:00',
      assignedTo: coordinatorUser?.id || null, // ✅ Use actual User ID
      completed: false,
    },
  }),
]);


  console.log('✅ Timeline tasks created');
  console.log('🎉 Seeding complete!');

  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@venueos.com / password123');
  console.log('Coordinator: coordinator@venueos.com / password123');
  console.log('Client: client@venueos.com / password123');
  console.log('Finance: finance@venueos.com / password123');
  console.log('Operations: operations@venueos.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });