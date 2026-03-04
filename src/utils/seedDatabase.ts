import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ==================== STAFF DATA ====================
const staffData = [
    {
        name: 'Nimasha Perera',
        email: 'nimasha@glamstudio.lk',
        phone: '0771234567',
        avatar: '',
        specializations: ['Hair', 'Bridal'],
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: { start: '09:00', end: '18:00' },
        commissionPercentage: 30,
        isOnLeave: false,
        rating: 4.8,
        totalAppointments: 120,
    },
    {
        name: 'Kavindi Silva',
        email: 'kavindi@glamstudio.lk',
        phone: '0712345678',
        avatar: '',
        specializations: ['Nails', 'Makeup', 'Facial'],
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: { start: '10:00', end: '19:00' },
        commissionPercentage: 25,
        isOnLeave: false,
        rating: 4.6,
        totalAppointments: 85,
    },
    {
        name: 'Dulani Fernando',
        email: 'dulani@glamstudio.lk',
        phone: '0723456789',
        avatar: '',
        specializations: ['Massage', 'Facial'],
        workingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        workingHours: { start: '09:00', end: '17:00' },
        commissionPercentage: 28,
        isOnLeave: false,
        rating: 4.9,
        totalAppointments: 65,
    },
];

// ==================== SERVICES DATA ====================
const servicesData = [
    {
        name: 'Hair Cut & Style',
        description: 'Professional haircut with blow dry and styling',
        price: 2500,
        duration: 60,
        category: 'Hair',
        isActive: true,
        isPackage: false,
    },
    {
        name: 'Hair Colouring',
        description: 'Full hair colouring with premium products',
        price: 6500,
        duration: 120,
        category: 'Hair',
        isActive: true,
        isPackage: false,
    },
    {
        name: 'Bridal Makeup',
        description: 'Full bridal makeup with premium products',
        price: 15000,
        discountPrice: 12000,
        duration: 120,
        category: 'Bridal',
        isActive: true,
        isPackage: false,
    },
    {
        name: 'Manicure & Pedicure',
        description: 'Gel manicure and pedicure with nail art',
        price: 3500,
        duration: 90,
        category: 'Nails',
        isActive: true,
        isPackage: false,
    },
    {
        name: 'Deep Facial Treatment',
        description: 'Deep cleansing facial with hydration mask',
        price: 4500,
        duration: 75,
        category: 'Facial',
        isActive: true,
        isPackage: false,
    },
    {
        name: 'Full Body Massage',
        description: 'Relaxing full body massage with aromatherapy oils',
        price: 5500,
        duration: 90,
        category: 'Massage',
        isActive: true,
        isPackage: false,
    },
    {
        name: 'Glamour Package',
        description: 'Hair cut + Facial + Manicure combo package',
        price: 8500,
        discountPrice: 7000,
        duration: 180,
        category: 'Hair',
        isActive: true,
        isPackage: true,
        packageServices: ['Hair Cut & Style', 'Deep Facial Treatment', 'Manicure & Pedicure'],
    },
];

// ==================== SEED FUNCTION ====================
export const seedDatabase = async (): Promise<void> => {
    try {
        console.log('🌱 Starting database seed...');

        // Check if staff collection already has data
        const existingStaff = await getDocs(collection(db, 'staff'));
        if (!existingStaff.empty) {
            console.log('⚠️  Database already has data. Skipping seed to avoid duplicates.');
            alert('Database already has data! Seed skipped.');
            return;
        }

        // Add Staff
        console.log('Adding staff...');
        const staffIds: string[] = [];
        for (const staff of staffData) {
            const ref = await addDoc(collection(db, 'staff'), staff);
            staffIds.push(ref.id);
            console.log(`  ✅ Staff added: ${staff.name} (${ref.id})`);
        }

        // Add Services
        console.log('Adding services...');
        const serviceIds: string[] = [];
        for (const service of servicesData) {
            const ref = await addDoc(collection(db, 'services'), service);
            serviceIds.push(ref.id);
            console.log(`  ✅ Service added: ${service.name} (${ref.id})`);
        }

        // Add Sample Appointments
        console.log('Adding sample appointments...');
        const appointmentsData = [
            {
                customerId: 'sample-customer-001',
                customerName: 'Sanduni Rajapaksa',
                customerEmail: 'sanduni@gmail.com',
                customerPhone: '0761234567',
                serviceId: serviceIds[0],
                serviceName: 'Hair Cut & Style',
                servicePrice: 2500,
                staffId: staffIds[0],
                staffName: 'Nimasha Perera',
                date: '2026-03-05',
                timeSlot: '10:00',
                duration: 60,
                status: 'Confirmed',
                paymentStatus: 'Unpaid',
                notes: 'Wants layers and trim',
                createdAt: new Date().toISOString(),
            },
            {
                customerId: 'sample-customer-002',
                customerName: 'Malsha Fernando',
                customerEmail: 'malsha@gmail.com',
                customerPhone: '0751234567',
                serviceId: serviceIds[3],
                serviceName: 'Manicure & Pedicure',
                servicePrice: 3500,
                staffId: staffIds[1],
                staffName: 'Kavindi Silva',
                date: '2026-03-06',
                timeSlot: '14:00',
                duration: 90,
                status: 'Pending',
                paymentStatus: 'Unpaid',
                notes: '',
                createdAt: new Date().toISOString(),
            },
            {
                customerId: 'sample-customer-003',
                customerName: 'Hiruni Wickramasinghe',
                customerEmail: 'hiruni@gmail.com',
                customerPhone: '0781234567',
                serviceId: serviceIds[4],
                serviceName: 'Deep Facial Treatment',
                servicePrice: 4500,
                staffId: staffIds[2],
                staffName: 'Dulani Fernando',
                date: '2026-03-04',
                timeSlot: '11:00',
                duration: 75,
                status: 'Completed',
                paymentStatus: 'Paid',
                paymentMethod: 'Cash',
                notes: 'After treatment glow package',
                createdAt: new Date().toISOString(),
            },
        ];

        for (const apt of appointmentsData) {
            const ref = await addDoc(collection(db, 'appointments'), apt);
            console.log(`  ✅ Appointment added: ${apt.customerName} (${ref.id})`);
        }

        // Add Sample Reviews
        console.log('Adding sample reviews...');
        const reviewsData = [
            {
                customerId: 'sample-customer-003',
                customerName: 'Hiruni Wickramasinghe',
                staffId: staffIds[2],
                serviceId: serviceIds[4],
                rating: 5,
                comment: 'Amazing facial treatment! Dulani was so professional and my skin glows now!',
                createdAt: new Date().toISOString(),
            },
            {
                customerId: 'sample-customer-001',
                customerName: 'Sanduni Rajapaksa',
                staffId: staffIds[0],
                serviceId: serviceIds[0],
                rating: 5,
                comment: 'Nimasha did a fantastic job with my hair. Absolutely love the style!',
                createdAt: new Date().toISOString(),
            },
        ];

        for (const review of reviewsData) {
            const ref = await addDoc(collection(db, 'reviews'), review);
            console.log(`  ✅ Review added by: ${review.customerName} (${ref.id})`);
        }

        console.log('🎉 Database seeded successfully!');
        alert('✅ Database seeded successfully!\n\nAdded:\n- 3 Staff members\n- 7 Services\n- 3 Appointments\n- 2 Reviews');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        alert('❌ Seed failed! Check console for details.\n\nMake sure you are logged in as admin.');
        throw error;
    }
};
