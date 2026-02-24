import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Scissors, MapPin, ChevronRight, AlertCircle, CheckCircle2, Clock3, Star } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { formatPrice } from '../utils/helpers';
import { Link } from 'react-router-dom';
import RatingModal from '../components/RatingModal';
import { useReviewStore } from '../store/useReviewStore';

export default function MyAppointmentsPage() {
    const { user } = useAuthStore();
    const { appointments } = useAppointmentStore();
    const { reviews } = useReviewStore();

    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    const customerAppointments = appointments
        .filter(app => app.customerEmail === user?.email)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const isReviewed = (appointmentId: string) => {
        // This is a simplified check. In a real app index by appointmentId if added to the type.
        // For now, we'll just check if the user has a review for this service.
        return false; // We will improve this if we add appointmentId to Review type
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="w-3 h-3" />;
            case 'Pending': return <Clock3 className="w-3 h-3" />;
            case 'Cancelled': return <AlertCircle className="w-3 h-3" />;
            default: return <Clock3 className="w-3 h-3" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
            >
                <div>
                    <h1 className="font-serif text-4xl font-bold text-white mb-2">My Bookings</h1>
                    <p className="text-gray-400">Track and manage your scheduled transformations</p>
                </div>
                <Link to="/book" className="btn-gold flex items-center gap-2 px-6 py-3 whitespace-nowrap">
                    Book New Appointment <ChevronRight className="w-4 h-4" />
                </Link>
            </motion.div>

            {customerAppointments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card-glass p-16 rounded-3xl text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-600">
                        <Calendar className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No bookings yet</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Ready for a new look? Book your first appointment with Sri Lanka's finest artists.
                    </p>
                    <Link to="/book" className="btn-gold px-8 py-3">Start Booking</Link>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {customerAppointments.map((app, i) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card-glass p-6 rounded-2xl hover:border-[#D4AF37]/30 transition-all duration-300 group"
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                {/* Date/Time Block */}
                                <div className="flex-shrink-0 text-center md:border-r border-white/10 md:pr-6 min-w-[100px]">
                                    <div className="text-[#D4AF37] font-serif text-2xl font-bold">
                                        {new Date(app.date).toLocaleDateString('en-US', { day: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                                        {new Date(app.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                    <div className="mt-2 text-sm text-white font-medium bg-white/5 py-1 rounded-lg">
                                        {app.timeSlot}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 uppercase tracking-wider font-bold ${getStatusStyle(app.status)}`}>
                                            {getStatusIcon(app.status)} {app.status}
                                        </span>
                                        <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded-full border border-white/5">
                                            ID: {app.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                                        {app.serviceName}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Scissors className="w-4 h-4 text-[#D4AF37]" />
                                            <span>With {app.staffName}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                            <span>Colombo Main Branch</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price/Action */}
                                <div className="flex flex-col items-end gap-3 justify-center">
                                    <div className="text-xl font-bold text-gradient">
                                        {formatPrice(app.servicePrice)}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {app.status === 'Completed' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedAppointment(app);
                                                    setIsRatingModalOpen(true);
                                                }}
                                                className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg hover:bg-[#D4AF37]/20 transition-all flex items-center gap-1.5"
                                            >
                                                <Star className="w-3 h-3 fill-[#D4AF37]" /> Rate Service
                                            </button>
                                        )}
                                        <button className="text-xs text-gray-500 hover:text-white font-medium">
                                            Receipt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {selectedAppointment && (
                <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    appointment={selectedAppointment}
                />
            )}
        </div>
    );
}
