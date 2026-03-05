import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, Scissors, MapPin, ChevronRight, AlertCircle,
    CheckCircle2, Clock3, Star, Wallet, User, Hash, Info, XCircle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { formatPrice } from '../utils/helpers';
import { Link } from 'react-router-dom';
import RatingModal from '../components/RatingModal';
import { useReviewStore } from '../store/useReviewStore';
import { generateReceipt } from '../utils/receiptGenerator';
import CustomConfirmModal from '../components/CustomConfirmModal';
import toast from 'react-hot-toast';

export default function MyAppointmentsPage() {
    const { user } = useAuthStore();
    const { appointments, cancelAppointment } = useAppointmentStore();
    const { reviews } = useReviewStore();

    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

    const customerAppointments = appointments
        .filter(app => {
            // Priority 1: Match by customerId
            if (user?.id && app.customerId === user.id) return true;
            // Priority 2: Case-insensitive email match (fallback for legacy/session issues)
            if (user?.email && app.customerEmail?.toLowerCase() === user.email.toLowerCase()) return true;
            return false;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Completed': return { color: 'text-[var(--status-completed)]', bg: 'bg-[var(--status-completed-bg)]', border: 'border-[var(--status-completed)]/20', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Completed' };
            case 'In Progress': return { color: 'text-[var(--status-inprogress)]', bg: 'bg-[var(--status-inprogress-bg)]', border: 'border-[var(--status-inprogress)]/20', icon: <Clock3 className="w-4 h-4" />, label: 'In Progress' };
            case 'Confirmed': return { color: 'text-[var(--status-confirmed)]', bg: 'bg-[var(--status-confirmed-bg)]', border: 'border-[var(--status-confirmed)]/20', icon: <Info className="w-4 h-4" />, label: 'Confirmed' };
            case 'Pending': return { color: 'text-[var(--status-pending)]', bg: 'bg-[var(--status-pending-bg)]', border: 'border-[var(--status-pending)]/20', icon: <Clock3 className="w-4 h-4" />, label: 'Pending' };
            case 'Cancelled': return { color: 'text-[var(--status-cancelled)]', bg: 'bg-[var(--status-cancelled-bg)]', border: 'border-[var(--status-cancelled)]/20', icon: <XCircle className="w-4 h-4" />, label: 'Cancelled' };
            case 'No Show': return { color: 'text-[var(--status-noshow)]', bg: 'bg-[var(--status-noshow-bg)]', border: 'border-[var(--status-noshow)]/20', icon: <AlertCircle className="w-4 h-4" />, label: 'No Show' };
            default: return { color: 'text-[var(--text-muted)]', bg: 'bg-[var(--bg-glass)]', border: 'border-[var(--border)]', icon: <Info className="w-4 h-4" />, label: status };
        }
    };

    const handleCancelClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setAppointmentToCancel(id);
        setIsConfirmModalOpen(true);
    };

    const confirmCancel = async () => {
        if (appointmentToCancel) {
            try {
                await cancelAppointment(appointmentToCancel);
                toast.success('Booking cancelled successfully.');
            } catch (error) {
                toast.error('Failed to cancel booking.');
            }
            setAppointmentToCancel(null);
            setIsConfirmModalOpen(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            >
                <div>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3">
                        Booking <span className="text-gradient">History</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-lg">Manage your luxury treatments and track your transformation.</p>
                </div>
                <Link to="/services" className="btn-gold flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-widest text-xs">
                    New Treatment <Calendar className="w-4 h-4" />
                </Link>
            </motion.div>

            {customerAppointments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-glass p-16 rounded-[3rem] text-center border-[var(--border)]"
                >
                    <div className="w-24 h-24 rounded-full bg-[var(--bg-glass)] flex items-center justify-center mx-auto mb-8 border border-[var(--border)] text-[var(--text-muted)] shadow-2xl">
                        <Calendar className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 font-serif">Your calendar is empty</h2>
                    <p className="text-[var(--text-muted)] mb-10 max-w-sm mx-auto text-lg italic">
                        "Elegance is the only beauty that never fades."
                    </p>
                    <Link to="/services" className="btn-gold px-10 py-4 font-bold">Reserver Your Experience</Link>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {customerAppointments.map((app, i) => {
                        const config = getStatusConfig(app.status);
                        const isExpanded = expandedId === app.id;
                        const canCancel = app.status === 'Pending' || app.status === 'Confirmed';

                        return (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`card-glass rounded-[2rem] border overflow-hidden transition-all duration-500 group cursor-pointer ${isExpanded ? 'border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]' : 'border-[var(--border)] hover:border-[#D4AF37]/30'}`}
                                onClick={() => setExpandedId(isExpanded ? null : app.id)}
                            >
                                {/* Header Summary */}
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                                    {/* Date Column */}
                                    <div className="flex-shrink-0 flex items-center md:flex-col md:border-r border-[var(--border)] md:pr-8 min-w-[100px] gap-4 md:gap-0">
                                        <div className="text-[#D4AF37] font-serif text-4xl font-bold leading-none">
                                            {new Date(app.date).toLocaleDateString('en-US', { day: 'numeric' })}
                                        </div>
                                        <div className="flex flex-col md:items-center">
                                            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] font-black mt-1">
                                                {new Date(app.date).toLocaleDateString('en-US', { month: 'short' })}
                                            </div>
                                            <div className="mt-2 text-[10px] text-[var(--text-secondary)] font-bold bg-[var(--bg-glass)] px-3 py-1 rounded-full border border-[var(--border)]">
                                                {app.timeSlot}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Column */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className={`text-[9px] px-3 py-1 rounded-full border flex items-center gap-1.5 uppercase tracking-widest font-black ${config.bg} ${config.color} ${config.border}`}>
                                                {config.icon} {config.label}
                                            </span>
                                            <span className="text-[9px] bg-[var(--bg-glass)] text-[var(--text-muted)] px-2 py-1 rounded-full border border-[var(--border)] font-mono uppercase">
                                                <Hash className="w-2.5 h-2.5 inline mr-1" /> {app.id.length > 10 ? app.id.split('-').pop() : app.id.slice(0, 8)}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[#D4AF37] transition-colors font-serif">
                                            {app.serviceName}
                                        </h3>
                                        <div className="flex flex-wrap gap-5 text-sm">
                                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                                    <Scissors className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-medium">Artist: <span className="text-[var(--text-primary)] font-bold">{app.staffName}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-medium text-xs">Glamour Main, Colombo 03</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Column */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-3 justify-between md:justify-center border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-8">
                                        <div className="text-2xl font-bold text-gradient">
                                            {formatPrice(app.servicePrice)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-full bg-[var(--bg-glass)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-all group-active:scale-95">
                                                {isExpanded ? <ChevronRight className="w-5 h-5 rotate-90 transition-transform duration-500" /> : <ChevronRight className="w-5 h-5 transition-transform duration-500" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="border-t border-[var(--border)] bg-[var(--bg-glass)] overflow-hidden"
                                        >
                                            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                {/* Tracking Visualization */}
                                                <div className="lg:col-span-2 space-y-8">
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--gold)] mb-6">Request Timeline</h4>
                                                        <div className="relative flex justify-between items-center px-4">
                                                            <div className="absolute left-4 right-4 h-[1px] bg-[var(--border)] top-1/2 -translate-y-1/2 -z-10" />
                                                            {['Pending', 'Confirmed', 'In Progress', 'Completed'].map((step, idx) => {
                                                                const statuses = ['Pending', 'Confirmed', 'In Progress', 'Completed'];
                                                                const currentIdx = statuses.indexOf(app.status);
                                                                const isDone = currentIdx >= idx;
                                                                const isCurrent = app.status === step;
                                                                const isCancelled = app.status === 'Cancelled';
                                                                const isNoShow = app.status === 'No Show';

                                                                // Special handling for terminal states not in the normal flow
                                                                if ((isCancelled || isNoShow) && idx >= 1) {
                                                                    return (
                                                                        <div key={step} className="flex flex-col items-center gap-3 relative opacity-30 grayscale">
                                                                            <div className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)]">
                                                                                {idx + 1}
                                                                            </div>
                                                                            <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap text-[var(--text-muted)]">
                                                                                {step}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <div key={step} className="flex flex-col items-center gap-3 relative">
                                                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-1000 ${isDone ? 'bg-[var(--gold)] border-[var(--gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)]'}`}>
                                                                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                                                        </div>
                                                                        <span className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${isCurrent ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
                                                                            {step}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                            {(app.status === 'Cancelled' || app.status === 'No Show') && (
                                                                <div className="flex flex-col items-center gap-3 relative">
                                                                    <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                                                        <XCircle className="w-4 h-4" />
                                                                    </div>
                                                                    <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap text-red-500">
                                                                        {app.status}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border)]">
                                                            <div className="flex items-center gap-3 text-[var(--text-muted)] mb-2">
                                                                <Wallet className="w-4 h-4" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">Payment Method</span>
                                                            </div>
                                                            <div className="text-sm font-bold text-[var(--text-primary)]">
                                                                Cash at Counter
                                                            </div>
                                                            <div className={`text-[10px] mt-1 font-bold ${app.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                                Status: {app.paymentStatus}
                                                            </div>
                                                        </div>
                                                        <div className="p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border)]">
                                                            <div className="flex items-center gap-3 text-[var(--text-muted)] mb-2">
                                                                <Hash className="w-4 h-4" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">Global Booking ID</span>
                                                            </div>
                                                            <div className="text-[10px] font-mono text-[var(--gold)] mb-1">
                                                                Booking ID: {app.bookingId || 'N/A'}
                                                            </div>
                                                            <div className="text-[8px] font-mono text-[var(--text-muted)] select-all opacity-50">
                                                                System Ref: {app.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Side Actions */}
                                                <div className="flex flex-col gap-4">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--gold)] mb-2">Management</h4>

                                                    {app.status === 'Completed' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAppointment(app);
                                                                setIsRatingModalOpen(true);
                                                            }}
                                                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all font-bold text-xs uppercase tracking-widest"
                                                        >
                                                            Rate Treatment <Star className="w-4 h-4 fill-[#D4AF37]" />
                                                        </button>
                                                    )}

                                                    {canCancel && (
                                                        <button
                                                            onClick={(e) => handleCancelClick(e, app.id)}
                                                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest"
                                                        >
                                                            Cancel Booking <AlertCircle className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            generateReceipt(app);
                                                        }}
                                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all font-bold text-xs uppercase tracking-widest"
                                                    >
                                                        Download PDF Receipt <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {selectedAppointment && (
                <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    appointment={selectedAppointment}
                />
            )}

            <CustomConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmCancel}
                title="Cancel Booking?"
                message="Are you sure you want to cancel this booking? This action cannot be undone and your slot will be released."
                confirmText="Yes, Cancel"
                cancelText="No, Keep It"
            />
        </div>
    );
}
