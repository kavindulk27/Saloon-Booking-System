import { format, addMinutes, parse, isBefore, startOfDay } from 'date-fns';

export function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number = 30): string[] {
    const slots: string[] = [];
    let current = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    while (isBefore(current, end)) {
        slots.push(format(current, 'HH:mm'));
        current = addMinutes(current, intervalMinutes);
    }
    return slots;
}

export function formatPrice(price: number): string {
    return `Rs. ${price.toLocaleString('en-LK')}`;
}

export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatDate(dateStr: string): string {
    return format(new Date(dateStr), 'dd MMM yyyy');
}

export function formatFullDate(dateStr: string): string {
    return format(new Date(dateStr), 'dd MMMM yyyy');
}

export function formatDateTime(dateStr: string): string {
    return format(new Date(dateStr), 'dd MMM yyyy, hh:mm a');
}

export function getStatusColor(status: string): string {
    const map: Record<string, string> = {
        Pending: 'badge-pending',
        Confirmed: 'badge-confirmed',
        'In Progress': 'badge-inprogress',
        Completed: 'badge-completed',
        Cancelled: 'badge-cancelled',
        'No Show': 'badge-noshow',
    };
    return map[status] || 'badge';
}

export function getPaymentColor(status: string): string {
    const map: Record<string, string> = {
        Paid: 'text-[var(--status-completed)]',
        Unpaid: 'text-[var(--status-cancelled)]',
        Refunded: 'text-[var(--status-confirmed)]',
    };
    return map[status] || 'text-[var(--text-muted)]';
}

export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function generateBookingId(): string {
    const today = format(new Date(), 'yyyyMMdd');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `BK-${today}-${random}`;
}

export function generateInvoiceId(): string {
    return `INV-${Date.now().toString(36).toUpperCase()}`;
}

export function isDateAvailable(date: Date): boolean {
    const today = startOfDay(new Date());
    return !isBefore(date, today);
}
