import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { formatPrice, formatDate, getStatusColor, getPaymentColor } from '../../utils/helpers';
import type { AppointmentStatus, PaymentStatus } from '../../types';
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

    const handleStatus = (id: string, status: AppointmentStatus) => {
        updateStatus(id, status);
        toast.success(`Status updated to ${status}`);
    };

    const handlePaymentStatus = (id: string, status: PaymentStatus) => {
        useAppointmentStore.getState().updatePaymentStatus(id, status);
        toast.success(`Payment marked as ${status}`);
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
                                        <div className="text-xs text-[var(--text-muted)]">{apt.customerEmail}</div>
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
                                                            onClick={() => handleStatus(apt.id, 'Confirmed')}
                                                            className="text-[10px] px-2 py-1 bg-[var(--status-completed-bg)] text-[var(--status-completed)] border border-[var(--status-completed)]/20 rounded-md hover:bg-[var(--status-completed-bg)]/30 transition-all flex items-center gap-1"
                                                            title="Confirm Appointment"
                                                        >
                                                            <Check className="w-3 h-3" /> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(apt.id, 'Cancelled')}
                                                            className="text-[10px] px-2 py-1 bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled)] border border-[var(--status-cancelled)]/20 rounded-md hover:bg-[var(--status-cancelled-bg)]/30 transition-all"
                                                            title="Reject Appointment"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {apt.status === 'Confirmed' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatus(apt.id, 'In Progress')}
                                                            className="text-[10px] px-2 py-1 bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed)] border border-[var(--status-confirmed)]/20 rounded-md hover:bg-[var(--status-confirmed-bg)]/30 transition-all flex items-center gap-1"
                                                            title="Start Service"
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
                                                        <button
                                                            onClick={() => handleStatus(apt.id, 'Cancelled')}
                                                            className="text-[10px] px-2 py-1 bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled)] border border-[var(--status-cancelled)]/20 rounded-md hover:bg-[var(--status-cancelled-bg)]/30 transition-all"
                                                            title="Cancel Appointment"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {apt.status === 'In Progress' && (
                                                    <button
                                                        onClick={() => handleStatus(apt.id, 'Completed')}
                                                        className="text-[10px] px-2 py-1 bg-[var(--status-completed-bg)] text-[var(--status-completed)] border border-[var(--status-completed)]/20 rounded-md hover:bg-[var(--status-completed-bg)]/30 transition-all flex items-center gap-1"
                                                        title="Finish Service"
                                                    >
                                                        <Check className="w-3 h-3" /> Complete
                                                    </button>
                                                )}
                                            </div>

                                            {/* Manual Override Dropdown */}
                                            <select
                                                value={apt.status}
                                                onChange={(e) => handleStatus(apt.id, e.target.value as AppointmentStatus)}
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
