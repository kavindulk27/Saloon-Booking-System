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
                <h1 className="font-serif text-2xl font-bold text-white">My Schedule</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your daily appointments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Today's Appointments", value: todayApts.length, color: 'text-blue-400' },
                    { label: 'Completed', value: todayApts.filter(a => a.status === 'Completed').length, color: 'text-green-400' },
                    { label: 'Earned Today', value: formatPrice(totalRevenue), color: 'text-[#D4AF37]' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.label}</div>
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
                            className={`flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-2.5 border transition-all min-w-[60px] ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-[#2A2A2A] text-gray-400 hover:border-[#D4AF37]/50 hover:text-white'
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
                    <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">No appointments for this day</p>
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
                                    <div className="text-[#D4AF37] font-bold text-lg">{apt.timeSlot}</div>
                                    <div className="text-xs text-gray-500">{apt.duration}min</div>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div>
                                    <div className="font-semibold text-white">{apt.customerName}</div>
                                    <div className="text-sm text-gray-400">{apt.serviceName}</div>
                                    <div className="text-xs text-gray-500">{apt.customerEmail}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 sm:ml-auto flex-wrap">
                                <span className="font-bold text-gradient">{formatPrice(apt.servicePrice)}</span>
                                <span className={getStatusColor(apt.status)}>{apt.status}</span>
                                {apt.status === 'Confirmed' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(apt.id, 'Completed')} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-lg hover:bg-green-500/20 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Done
                                        </button>
                                        <button onClick={() => handleUpdate(apt.id, 'No Show')} className="text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2.5 py-1 rounded-lg hover:bg-gray-500/20 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> No-Show
                                        </button>
                                    </div>
                                )}
                                {apt.status === 'Pending' && (
                                    <button onClick={() => handleUpdate(apt.id, 'Confirmed')} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg hover:bg-blue-500/20 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Confirm
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
