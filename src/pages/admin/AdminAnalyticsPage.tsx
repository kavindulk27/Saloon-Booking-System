import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Star, Clock } from 'lucide-react';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { mockStaff, revenueData, peakHoursData } from '../../utils/mockData';
import { formatPrice } from '../../utils/helpers';

export default function AdminAnalyticsPage() {
    const { appointments } = useAppointmentStore();

    const completed = appointments.filter(a => a.status === 'Completed');
    const totalRevenue = completed.reduce((sum, a) => sum + a.servicePrice, 0);
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
    const maxPeak = Math.max(...peakHoursData.map(d => d.count));

    const staffPerformance = mockStaff.map(s => {
        const staffApts = appointments.filter(a => a.staffId === s.id);
        const revenue = staffApts.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.servicePrice, 0);
        return { ...s, appointments: staffApts.length, revenue, commission: Math.round(revenue * (s.commissionPercentage / 100)) };
    }).sort((a, b) => b.revenue - a.revenue);

    return (
        <div className="p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">Business performance insights</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
                    { label: 'Total Appointments', value: appointments.length, icon: <Calendar className="w-5 h-5" />, color: 'text-[var(--status-confirmed)]', bg: 'bg-[var(--status-confirmed-bg)]' },
                    { label: 'Unique Customers', value: new Set(appointments.map(a => a.customerId)).size, icon: <Users className="w-5 h-5" />, color: 'text-[var(--status-inprogress)]', bg: 'bg-[var(--status-inprogress-bg)]' },
                    { label: 'Avg Rating', value: '4.8 ⭐', icon: <Star className="w-5 h-5" />, color: 'text-[var(--status-pending)]', bg: 'bg-[var(--status-pending-bg)]' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
                        <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="card p-6">
                    <h2 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#D4AF37]" /> Monthly Revenue Trend
                    </h2>
                    <div className="flex items-end gap-2 h-40">
                        {revenueData.map((d, i) => (
                            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs text-[var(--text-muted)]">Rs.{Math.round(d.revenue / 1000)}k</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                                    transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                                    className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F0D060] rounded-t-md min-h-[4px]"
                                />
                                <span className="text-xs text-[var(--text-muted)]">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Peak Hours */}
                <div className="card p-6">
                    <h2 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#D4AF37]" /> Booking Peak Hours
                    </h2>
                    <div className="flex items-end gap-1 h-40">
                        {peakHoursData.map((h, i) => (
                            <div key={h.hour} className="flex-1 flex flex-col items-end gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(h.count / maxPeak) * 100}%` }}
                                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                                    className="w-full bg-gradient-to-t from-[var(--status-confirmed)] to-[var(--status-confirmed-bg)] rounded-t-md min-h-[2px]"
                                />
                                <span className="text-[9px] text-[var(--text-muted)] leading-none">{h.hour}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Staff Performance Table */}
            <div className="card overflow-hidden">
                <div className="p-5 border-b border-[var(--border)]">
                    <h2 className="font-semibold text-[var(--text-primary)]">Staff Performance</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="table-header">
                            <th className="text-left px-5 py-3">Artist</th>
                            <th className="text-left px-5 py-3">Appointments</th>
                            <th className="text-left px-5 py-3">Revenue Generated</th>
                            <th className="text-left px-5 py-3">Commission</th>
                            <th className="text-left px-5 py-3">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffPerformance.map((s) => (
                            <tr key={s.id} className="table-row">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-xs font-bold">
                                            {s.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--text-primary)]">{s.name}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{s.specializations.join(', ')}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-[var(--text-secondary)]">{s.appointments}</td>
                                <td className="px-5 py-4 font-semibold text-gradient">{formatPrice(s.revenue)}</td>
                                <td className="px-5 py-4 text-[var(--text-secondary)]">{formatPrice(s.commission)}</td>
                                <td className="px-5 py-4">
                                    <span className="flex items-center gap-1 text-[var(--gold)]">
                                        <Star className="w-3.5 h-3.5 fill-[var(--gold)]" /> {s.rating}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
