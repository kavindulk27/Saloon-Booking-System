import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { formatPrice, getStatusColor } from '../../utils/helpers';
import type { AppointmentStatus } from '../../types';
import toast from 'react-hot-toast';

const today = startOfToday();
const WEEK_DATES = Array.from({ length: 7 }, (_, i) => addDays(today, i));

export default function StaffSchedulePage() {
    const { user } = useAuthStore();
    const { appointments, updateStatus } = useAppointmentStore();
    const [selectedDate, setSelectedDate] = useState(today);

    const staff = user;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const todayApts = appointments.filter(a =>
        a.staffId === staff?.id && a.date === dateStr
    ).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    const handleUpdate = (id: string, status: AppointmentStatus) => {
        updateStatus(id, status);
        toast.success(`Marked as ${status}`);
    };

    const totalRevenue = todayApts
        .filter(a => a.status === 'Completed')
        .reduce((sum, a) => sum + a.servicePrice, 0);

    return (
        <div className="p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">My Schedule</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">Manage your daily appointments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Today's Appointments", value: todayApts.length, color: 'text-[var(--status-confirmed)]' },
                    { label: 'Completed', value: todayApts.filter(a => a.status === 'Completed').length, color: 'text-[var(--status-completed)]' },
                    { label: 'Earned Today', value: formatPrice(totalRevenue), color: 'text-[var(--gold)]' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Week picker */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
                {WEEK_DATES.map((date, i) => {
                    const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    const hasApts = appointments.some(a => a.staffId === staff?.id && a.date === format(date, 'yyyy-MM-dd'));
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-2.5 border transition-all min-w-[60px] ${isSelected ? 'bg-[var(--gold)] border-[var(--gold)] text-black' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)]/50 hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <span className="text-xs font-medium">{i === 0 ? 'Today' : format(date, 'EEE')}</span>
                            <span className="text-lg font-bold">{format(date, 'd')}</span>
                            {hasApts && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-black/40' : 'bg-[#D4AF37]'}`} />}
                        </button>
                    );
                })}
            </div>

            {/* Appointments */}
            {todayApts.length === 0 ? (
                <div className="text-center py-20">
                    <Calendar className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-20" />
                    <p className="text-[var(--text-muted)]">No appointments for this day</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {todayApts.map((apt, i) => (
                        <motion.div
                            key={apt.id}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-center w-14 flex-shrink-0">
                                    <div className="text-[var(--gold)] font-bold text-lg">{apt.timeSlot}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{apt.duration}min</div>
                                </div>
                                <div className="w-px h-10 bg-[var(--border)]" />
                                <div>
                                    <div className="font-semibold text-[var(--text-primary)]">{apt.customerName}</div>
                                    <div className="text-sm text-[var(--text-secondary)]">{apt.serviceName}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{apt.customerEmail}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 sm:ml-auto flex-wrap">
                                <span className="font-bold text-gradient">{formatPrice(apt.servicePrice)}</span>
                                <span className={getStatusColor(apt.status)}>{apt.status}</span>
                                {apt.status === 'Confirmed' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(apt.id, 'In Progress')} className="text-xs bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed)] border border-[var(--status-confirmed)]/20 px-2.5 py-1 rounded-lg hover:bg-[var(--status-confirmed-bg)]/20 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Start
                                        </button>
                                        <button onClick={() => handleUpdate(apt.id, 'No Show')} className="text-xs bg-[var(--status-noshow-bg)] text-[var(--status-noshow)] border border-[var(--status-noshow)]/20 px-2.5 py-1 rounded-lg hover:bg-[var(--status-noshow-bg)]/20 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> No-Show
                                        </button>
                                    </div>
                                )}
                                {apt.status === 'In Progress' && (
                                    <button onClick={() => handleUpdate(apt.id, 'Completed')} className="text-xs bg-[var(--status-completed-bg)] text-[var(--status-completed)] border border-[var(--status-completed)]/20 px-2.5 py-1 rounded-lg hover:bg-[var(--status-completed-bg)]/20 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Complete
                                    </button>
                                )}
                                {apt.status === 'Pending' && (
                                    <button onClick={() => handleUpdate(apt.id, 'Confirmed')} className="text-xs bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed)] border border-[var(--status-confirmed)]/20 px-2.5 py-1 rounded-lg hover:bg-[var(--status-confirmed-bg)]/20 flex items-center gap-1" title="Accept Booking">
                                        Confirm
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
