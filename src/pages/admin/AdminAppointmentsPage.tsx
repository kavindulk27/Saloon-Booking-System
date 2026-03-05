import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, XCircle, AlertCircle, Search, Filter, MessageCircle } from 'lucide-react';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { formatPrice, formatDate, getStatusColor, getPaymentColor, formatFullDate } from '../../utils/helpers';
import type { Appointment, AppointmentStatus, PaymentStatus } from '../../types';
import toast from 'react-hot-toast';

const STATUSES: AppointmentStatus[] = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

export default function AdminAppointmentsPage() {
    const { appointments, updateStatus } = useAppointmentStore();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'All'>('All');
    const [filterDate, setFilterDate] = useState('');

    const filtered = appointments.filter(a => {
        const matchSearch = a.customerName.toLowerCase().includes(search.toLowerCase()) ||
            a.serviceName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || a.status === filterStatus;
        const matchDate = !filterDate || a.date === filterDate;
        return matchSearch && matchStatus && matchDate;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const sendWhatsAppNotification = (apt: Appointment, statusOverride?: AppointmentStatus) => {
        let cleanPhone = apt.customerPhone.replace(/\D/g, '');

        // Handle Sri Lankan phone formats
        if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
            cleanPhone = '94' + cleanPhone.substring(1);
        } else if (cleanPhone.length === 9 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('1'))) {
            cleanPhone = '94' + cleanPhone;
        }

        const status = statusOverride || apt.status;
        let message = '';
        switch (status) {
            case 'Confirmed':
                message = `Hello ${apt.customerName},\n\nYour appointment for the ${apt.serviceName} has been successfully confirmed by Glam Studio.\n\nAppointment Details:\n📅 Date: ${formatFullDate(apt.date)}\n⏰ Time: ${apt.timeSlot}\n📍 Location: Glam Studio\n\nPlease arrive 10 minutes prior to your scheduled time.\n\nWe look forward to welcoming you.\nThank you for choosing Glam Studio.`;
                break;
            case 'In Progress':
                message = `Hello ${apt.customerName},\n\nYour ${apt.serviceName} treatment has just started. ✨\n\nSit back and relax while we pamper you!\n\nThank you for choosing Glam Studio.`;
                break;
            case 'Completed':
                message = `Hello ${apt.customerName},\n\nYour appointment is now completed. ✅\n\nThank you for choosing Glam Studio! We hope you love the results.\n\nWe'd love to hear your feedback. 💖`;
                break;
            case 'Cancelled':
                message = `Hello ${apt.customerName},\n\nYour appointment for ${apt.serviceName} has been cancelled. ❌\n\nPlease contact us for more info or to reschedule.`;
                break;
            default:
                message = `Hello ${apt.customerName},\n\nYour appointment update: ${status}.`;
        }

        const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleStatus = async (id: string, status: AppointmentStatus, notify = false) => {
        try {
            await updateStatus(id, status);
            toast.success(`Status updated to ${status}`);

            if (notify) {
                const apt = appointments.find(a => a.id === id);
                if (apt) sendWhatsAppNotification(apt, status);
            }
        } catch (error) {
            toast.error('Failed to update status.');
        }
    };

    const handlePaymentStatus = async (id: string, status: PaymentStatus) => {
        try {
            await useAppointmentStore.getState().updatePaymentStatus(id, status);
            toast.success(`Payment marked as ${status}`);
        } catch (error) {
            toast.error('Failed to update payment status.');
        }
    };

    return (
        <div className="p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Appointments</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">{filtered.length} appointments</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or service..." className="input-field pl-10 w-full" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="input-field flex-1 sm:max-w-[160px]">
                    <option value="All">All Status</option>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="input-field flex-1 sm:max-w-[180px]" />
                {(filterDate || filterStatus !== 'All' || search) && (
                    <button onClick={() => { setSearch(''); setFilterStatus('All'); setFilterDate(''); }} className="btn-ghost text-sm flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Clear
                    </button>
                )}
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead>
                            <tr className="table-header">
                                <th className="text-left px-5 py-3">Customer</th>
                                <th className="text-left px-5 py-3">Service</th>
                                <th className="text-left px-5 py-3">Date & Time</th>
                                <th className="text-left px-5 py-3">Artist</th>
                                <th className="text-left px-5 py-3">Amount</th>
                                <th className="text-left px-5 py-3">Payment</th>
                                <th className="text-left px-5 py-3">Status</th>
                                <th className="text-right px-5 py-3">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-[var(--text-muted)]">No appointments found</td>
                                </tr>
                            ) : filtered.map((apt, i) => (
                                <motion.tr
                                    key={apt.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="table-row"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-[var(--text-primary)]">{apt.customerName}</div>
                                        <div className="text-xs text-[var(--text-muted)]">{apt.customerPhone}</div>
                                        <div className="text-[10px] text-[var(--text-muted)] opacity-50">{apt.customerEmail}</div>
                                    </td>
                                    <td className="px-5 py-4 text-[var(--text-secondary)]">{apt.serviceName}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                            <Calendar className="w-3 h-3 text-[var(--text-muted)]" /> {formatDate(apt.date)}
                                        </div>
                                        <div className="flex items-center gap-1 text-[var(--gold)] text-xs">
                                            <Clock className="w-3 h-3" /> {apt.timeSlot}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-[var(--text-muted)] text-xs">{apt.staffName || '—'}</td>
                                    <td className="px-5 py-4 font-semibold text-gradient">{formatPrice(apt.servicePrice)}</td>
                                    <td className="px-5 py-4">
                                        <select
                                            value={apt.paymentStatus}
                                            onChange={(e) => handlePaymentStatus(apt.id, e.target.value as PaymentStatus)}
                                            className={`text-[10px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 font-bold cursor-pointer outline-none ${getPaymentColor(apt.paymentStatus)}`}
                                        >
                                            <option value="Unpaid" className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">Unpaid</option>
                                            <option value="Paid" className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">Paid (Cash)</option>
                                            <option value="Refunded" className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">Refunded</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={getStatusColor(apt.status)}>{apt.status}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Status Actions */}
                                            <div className="flex items-center gap-1">
                                                {apt.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatus(apt.id, 'Confirmed', true)}
                                                            className="text-[10px] px-2 py-1 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-md hover:bg-[#25D366]/20 transition-all flex items-center gap-1"
                                                            title="Accept & Notify via WhatsApp"
                                                        >
                                                            <MessageCircle className="w-3 h-3" /> Accept & Notify
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(apt.id, 'Cancelled', true)}
                                                            className="text-[10px] px-2 py-1 bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled)] border border-[var(--status-cancelled)]/20 rounded-md hover:bg-[var(--status-cancelled-bg)]/30 transition-all"
                                                            title="Reject & Notify"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {apt.status === 'Confirmed' && (
                                                    <>
                                                        <button
                                                            onClick={() => sendWhatsAppNotification(apt)}
                                                            className="p-1 px-2 bg-[#25D366]/10 text-[#25D366] rounded-md hover:bg-[#25D366]/20 transition-all flex items-center gap-1 text-[10px]"
                                                            title="Send Reminder via WhatsApp"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" /> Re-notify
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(apt.id, 'In Progress', true)}
                                                            className="text-[10px] px-2 py-1 bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed)] border border-[var(--status-confirmed)]/20 rounded-md hover:bg-[var(--status-confirmed-bg)]/30 transition-all flex items-center gap-1"
                                                            title="Start & Notify"
                                                        >
                                                            <Clock className="w-3 h-3" /> Start
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(apt.id, 'No Show')}
                                                            className="text-[10px] px-2 py-1 bg-[var(--status-noshow-bg)] text-[var(--status-noshow)] border border-[var(--status-noshow)]/20 rounded-md hover:bg-[var(--status-noshow-bg)]/30 transition-all flex items-center gap-1"
                                                            title="Mark as No Show"
                                                        >
                                                            <AlertCircle className="w-3 h-3" /> No Show
                                                        </button>
                                                    </>
                                                )}
                                                {apt.status === 'In Progress' && (
                                                    <button
                                                        onClick={() => handleStatus(apt.id, 'Completed', true)}
                                                        className="text-[10px] px-2 py-1 bg-[var(--status-completed-bg)] text-[var(--status-completed)] border border-[var(--status-completed)]/20 rounded-md hover:bg-[var(--status-completed-bg)]/30 transition-all flex items-center gap-1"
                                                        title="Complete & Notify"
                                                    >
                                                        <Check className="w-3 h-3" /> Complete
                                                    </button>
                                                )}
                                            </div>

                                            {/* Manual Override Dropdown */}
                                            <select
                                                value={apt.status}
                                                onChange={(e) => handleStatus(apt.id, e.target.value as AppointmentStatus, false)}
                                                className="bg-[var(--bg-card)] border border-[var(--border)] text-[10px] rounded px-1 py-0.5 text-[var(--text-muted)] focus:border-[var(--gold)] outline-none"
                                            >
                                                {STATUSES.map(s => (
                                                    <option key={s} value={s} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
