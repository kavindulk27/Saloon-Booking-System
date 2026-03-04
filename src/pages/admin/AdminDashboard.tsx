import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, Clock, CheckCircle, Scissors, Database } from 'lucide-react';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { mockStaff, revenueData, servicePopularity, peakHoursData } from '../../utils/mockData';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import { seedDatabase } from '../../utils/seedDatabase';

const BAR_COLORS = ['bg-[#D4AF37]', 'bg-[#F0D060]', 'bg-[#A08820]', 'bg-[#E9B44C]', 'bg-[#C5832A]'];

export default function AdminDashboard() {
    const { appointments } = useAppointmentStore();
    const [seeding, setSeeding] = useState(false);

    const handleSeed = async () => {
        setSeeding(true);
        try {
            await seedDatabase();
        } finally {
            setSeeding(false);
        }
    };

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayApts = appointments.filter(a => a.date === today);
        const monthRevenue = appointments
            .filter(a => a.status === 'Completed')
            .reduce((sum, a) => sum + a.servicePrice, 0);
        const totalCustomers = new Set(appointments.map(a => a.customerId)).size;
        const completed = appointments.filter(a => a.status === 'Completed').length;
        const rate = appointments.length > 0 ? Math.round((completed / appointments.length) * 100) : 0;

        return { todayApts: todayApts.length, monthRevenue, totalCustomers, rate };
    }, [appointments]);

    const recentAppointments = useMemo(() => {
        return [...appointments]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [appointments]);
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
    const maxPeak = Math.max(...peakHoursData.map(d => d.count));

    return (
        <div className="p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">Welcome back, have a great day!</p>
                </div>
                <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all text-sm disabled:opacity-50"
                >
                    <Database className="w-4 h-4" />
                    {seeding ? 'Seeding...' : 'Seed Database'}
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Today's Appointments", value: stats.todayApts, icon: <Calendar className="w-5 h-5" />, color: 'text-[var(--status-confirmed)]', bg: 'bg-[var(--status-confirmed-bg)]' },
                    { label: 'Monthly Revenue', value: formatPrice(stats.monthRevenue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
                    { label: 'Total Customers', value: stats.totalCustomers, icon: <Users className="w-5 h-5" />, color: 'text-[var(--status-inprogress)]', bg: 'bg-[var(--status-inprogress-bg)]' },
                    { label: 'Completion Rate', value: `${stats.rate}%`, icon: <CheckCircle className="w-5 h-5" />, color: 'text-[var(--status-completed)]', bg: 'bg-[var(--status-completed-bg)]' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="stat-card"
                    >
                        <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 card p-5">
                    <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[var(--gold)]" /> Monthly Revenue
                    </h2>
                    <div className="flex items-end gap-2 h-36">
                        {revenueData.map((d, i) => (
                            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                                <div
                                    className="w-full bg-[var(--gold)] rounded-t-md transition-all duration-500"
                                    style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                                />
                                <span className="text-xs text-[var(--text-muted)]">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Popularity */}
                <div className="card p-5">
                    <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-[var(--gold)]" /> Popular Services
                    </h2>
                    <div className="space-y-3">
                        {servicePopularity.map((s, i) => (
                            <div key={s.name}>
                                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                                    <span>{s.name}</span>
                                    <span>{s.value}%</span>
                                </div>
                                <div className="h-1.5 bg-[var(--bg-glass)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.value}%` }}
                                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                        className={`h-full ${BAR_COLORS[i]} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Appointments */}
                <div className="lg:col-span-2 card overflow-hidden">
                    <div className="p-5 border-b border-[var(--border)]">
                        <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--gold)]" /> Recent Appointments
                        </h2>
                    </div>
                    <div className="divide-y divide-[var(--border-glass)]">
                        {recentAppointments.map(apt => (
                            <div key={apt.id} className="px-5 py-3 flex items-center justify-between hover:bg-[var(--bg-glass)]">
                                <div>
                                    <div className="font-medium text-[var(--text-primary)] text-sm">{apt.customerName}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{apt.serviceName} · {formatDate(apt.date)} {apt.timeSlot}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#D4AF37] font-medium">{formatPrice(apt.servicePrice)}</span>
                                    <span className={getStatusColor(apt.status)}>{apt.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Staff Status */}
                <div className="card p-5">
                    <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[var(--gold)]" /> Staff Status
                    </h2>
                    <div className="space-y-3">
                        {mockStaff.map(s => (
                            <div key={s.id} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                                    {s.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">{s.name}</div>
                                    <div className="text-xs text-[var(--text-muted)]">⭐ {s.rating}</div>
                                </div>
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.isOnLeave ? 'bg-[var(--status-cancelled)]' : 'bg-[var(--status-completed)]'}`} />
                            </div>
                        ))}
                    </div>

                    {/* Peak Hours */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[var(--gold)]" /> Peak Hours
                        </h3>
                        <div className="flex items-end gap-1 h-16">
                            {peakHoursData.map(h => (
                                <div key={h.hour} className="flex-1 flex flex-col items-center gap-0.5">
                                    <div
                                        className="w-full bg-[#D4AF37]/60 rounded-t"
                                        style={{ height: `${(h.count / maxPeak) * 100}%`, minHeight: '2px' }}
                                    />
                                    <span className="text-[8px] text-[var(--text-muted)] hidden sm:block">{h.hour.replace('AM', '').replace('PM', '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
