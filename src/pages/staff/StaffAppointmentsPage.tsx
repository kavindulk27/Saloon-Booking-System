import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, XCircle, Search, MessageCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { formatPrice, formatDate, getStatusColor, formatFullDate } from '../../utils/helpers';
import type { Appointment, AppointmentStatus } from '../../types';
import toast from 'react-hot-toast';

const STATUSES: AppointmentStatus[] = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

export default function StaffAppointmentsPage() {
    const { user } = useAuthStore();
    const { appointments, updateStatus } = useAppointmentStore();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'All'>('All');
    const [filterDate, setFilterDate] = useState('');

    const filtered = appointments.filter(a => {
        const isMyAppointment = a.staffId === user?.id;
        const matchSearch = a.customerName.toLowerCase().includes(search.toLowerCase()) ||
            a.serviceName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || a.status === filterStatus;
        const matchDate = !filterDate || a.date === filterDate;
        return isMyAppointment && matchSearch && matchStatus && matchDate;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const sendWhatsAppNotification = (apt: Appointment, statusOverride?: AppointmentStatus) => {
        let cleanPhone = apt.customerPhone.replace(/\D/g, '');

        if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
            cleanPhone = '94' + cleanPhone.substring(1);
        } else if (cleanPhone.length === 9 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('1'))) {
            cleanPhone = '94' + cleanPhone;
        }

        const status = statusOverride || apt.status;
        let message = '';
        switch (status) {
            case 'Confirmed':
                message = `Hello ${apt.customerName},\n\nYour appointment for ${apt.serviceName} has been confirmed by your artist ${user?.name || 'at Glam Studio'}.\n\nDetails:\n📅 Date: ${formatFullDate(apt.date)}\n⏰ Time: ${apt.timeSlot}\n\nSee you soon!`;
                break;
            case 'In Progress':
                message = `Hello ${apt.customerName},\n\nI'm ready to start your ${apt.serviceName} treatment! ✨\n\nThank you for choosing Glam Studio.`;
                break;
            case 'Completed':
                message = `Hello ${apt.customerName},\n\nYour ${apt.serviceName} is now complete. ✅\n\nI hope you love the results! We'd love to hear your feedback. 💖`;
                break;
            case 'Cancelled':
                message = `Hello ${apt.customerName},\n\nYour appointment for ${apt.serviceName} has been cancelled. ❌ Please contact the studio for more info.`;
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

    return (
        <div className="p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">My Appointments</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">{filtered.length} appointments assigned to you</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer or service..." className="input-field pl-10 w-full" />
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
                                <th className="text-left px-5 py-3">Amount</th>
                                <th className="text-left px-5 py-3">Status</th>
                                <th className="text-right px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-[var(--text-muted)]">No appointments found matching your criteria</td>
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
                                        <div className="text-xs text-[var(--text-muted)]">{apt.customerPhone || apt.customerEmail}</div>
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
                                    <td className="px-5 py-4 font-semibold text-gradient">{formatPrice(apt.servicePrice)}</td>
                                    <td className="px-5 py-4">
                                        <span className={getStatusColor(apt.status)}>{apt.status}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="flex items-center gap-1">
                                                {apt.status === 'Pending' && (
                                                    <>
                                                        <button onClick={() => handleStatus(apt.id, 'Confirmed', true)} className="text-[10px] px-2 py-1 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-md hover:bg-[#25D366]/20 transition-all flex items-center gap-1">
                                                            <Check className="w-3 h-3" /> Confirm & Notify
                                                        </button>
                                                        <button onClick={() => handleStatus(apt.id, 'Cancelled', true)} className="text-[10px] px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/10 rounded-md hover:bg-red-500/20 transition-all">
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {apt.status === 'Confirmed' && (
                                                    <>
                                                        <button onClick={() => sendWhatsAppNotification(apt)} className="p-1 px-2 bg-[#25D366]/10 text-[#25D366] rounded-md hover:bg-[#25D366]/20 transition-all flex items-center gap-1 text-[10px]">
                                                            <MessageCircle className="w-3.5 h-3.5" /> Notify Customer
                                                        </button>
                                                        <button onClick={() => handleStatus(apt.id, 'In Progress', true)} className="text-[10px] px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md hover:bg-amber-500/20 transition-all flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> Start
                                                        </button>
                                                    </>
                                                )}
                                                {apt.status === 'In Progress' && (
                                                    <button onClick={() => handleStatus(apt.id, 'Completed', true)} className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md hover:bg-green-500/20 transition-all flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> Complete
                                                    </button>
                                                )}
                                                {apt.status === 'Completed' && (
                                                    <button onClick={() => sendWhatsAppNotification(apt)} className="text-[10px] px-2 py-1 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-md hover:bg-[#25D366]/20 transition-all flex items-center gap-1">
                                                        <MessageCircle className="w-3 h-3" /> Say Thanks
                                                    </button>
                                                )}
                                            </div>

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

