// ==================== USER TYPES ====================
export type UserRole = 'customer' | 'staff' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    loyaltyPoints: number;
    joinDate: string;
    favoriteStaff?: string[];
}

// ==================== SERVICE TYPES ====================
export type ServiceCategory = 'Hair' | 'Facial' | 'Bridal' | 'Nails' | 'Massage' | 'Makeup';

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    duration: number; // in minutes
    category: ServiceCategory;
    image?: string;
    isActive: boolean;
    isPackage?: boolean;
    packageServices?: string[];
}

// ==================== STAFF TYPES ====================
export interface WorkingHours {
    start: string; // "09:00"
    end: string;   // "18:00"
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    specializations: ServiceCategory[];
    workingDays: DayOfWeek[];
    workingHours: WorkingHours;
    commissionPercentage: number;
    isOnLeave: boolean;
    leaveUntil?: string;
    rating: number;
    totalAppointments: number;
}

// ==================== APPOINTMENT TYPES ====================
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    staffId?: string;
    staffName?: string;
    date: string; // "2025-03-01"
    timeSlot: string; // "10:00"
    duration: number;
    status: AppointmentStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    notes?: string;
    createdAt: string;
}

// ==================== PAYMENT TYPES ====================
export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';
export type PaymentMethod = 'Cash';

export interface Payment {
    id: string;
    appointmentId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: string;
}

// ==================== REVIEW TYPES ====================
export interface Review {
    id: string;
    customerId: string;
    customerName: string;
    staffId?: string;
    serviceId: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string;
}

// ==================== PROMO TYPES ====================
export interface PromoCode {
    id: string;
    code: string;
    discount: number; // percentage
    isActive: boolean;
    expiresAt: string;
    usageLimit: number;
    usedCount: number;
}

// ==================== NOTIFICATION TYPES ====================
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'booking' | 'reminder' | 'payment' | 'promo';
    isRead: boolean;
    createdAt: string;
}

// ==================== LEAVE TYPES ====================
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
    id: string;
    staffId: string;
    staffName: string;
    startDate: string; // "2025-03-01"
    endDate: string;   // "2025-03-05"
    reason: string;
    status: LeaveStatus;
    appliedAt: string;
    approvedAt?: string;
    adminComment?: string;
}

// ==================== ANALYTICS TYPES ====================
export interface DashboardStats {
    todayAppointments: number;
    monthlyRevenue: number;
    totalCustomers: number;
    completionRate: number;
    pendingAppointments: number;
    topService: string;
    peakHour: string;
}

export interface RevenueData {
    month: string;
    revenue: number;
    appointments: number;
}
