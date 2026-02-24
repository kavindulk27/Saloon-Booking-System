import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, XCircle, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import type { AppointmentStatus } from '../../types';
import toast from 'react-hot-toast';

const STATUSES: AppointmentStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];

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
    });

    const handleStatus = (id: string, status: AppointmentStatus) => {
        updateStatus(id, status);
        toast.success(`Status updated to ${status}`);
    };

    return (
        <div className="p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">My Appointments</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">{filtered.length} total appointments found</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer or service..." className="input-field pl-10 w-64" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="input-field w-40">
                    <option value="All">All Status</option>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="input-field w-44" />
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
                                <th className="text-right px-5 py-3">Action</th>
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
                                        <div className="text-xs text-[var(--text-muted)]">{apt.customerEmail}</div>
                                    </td>
                                    <td className="px-5 py-4 text-[var(--text-secondary)]">{apt.serviceName}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1 text-[var(--text-secondary)] font-medium">
                                            {formatDate(apt.date)}
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
                                        <div className="flex items-center justify-end gap-1">
                                            {apt.status === 'Pending' && (
                                                <button onClick={() => handleStatus(apt.id, 'Confirmed')} className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Confirm
                                                </button>
                                            )}
                                            {apt.status === 'Confirmed' && (
                                                <button onClick={() => handleStatus(apt.id, 'Completed')} className="text-xs px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Mark Done
                                                </button>
                                            )}
                                            {['Completed', 'Cancelled', 'No Show'].includes(apt.status) && (
                                                <span className="text-xs text-gray-600">—</span>
                                            )}
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
