import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Clock, Tag, Package, ArrowRight, Scissors,
    Sparkles, Gem, Award, HeartPulse, Star, X, Check,
    User, Calendar, MapPin, ShieldCheck, Wallet,
    ChevronLeft, ChevronRight, CheckCircle2, MessageCircle
} from 'lucide-react';
import { mockServices, mockGallery } from '../utils/mockData';
import { useStaffStore } from '../store/useStaffStore';
import { formatPrice, formatDuration, generateBookingId, formatDate } from '../utils/helpers';
import type { Service, ServiceCategory, Appointment } from '../types';
import { useReviewStore } from '../store/useReviewStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import toast from 'react-hot-toast';

const categories: ServiceCategory[] = ['Hair', 'Facial', 'Bridal', 'Nails', 'Massage', 'Makeup'];
const categoryIcons: Record<string, React.ReactNode> = {
    Hair: <Scissors className="w-4 h-4" />,
    Facial: <Sparkles className="w-4 h-4" />,
    Bridal: <Gem className="w-4 h-4" />,
    Nails: <Award className="w-4 h-4" />,
    Massage: <HeartPulse className="w-4 h-4" />,
    Makeup: <Sparkles className="w-4 h-4" />,
};

const bookingSteps = [
    { id: 1, name: 'Service Details', icon: <Package className="w-4 h-4" /> },
    { id: 2, name: 'Time & Artist', icon: <Calendar className="w-4 h-4" /> },
    { id: 3, name: 'Review', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function ServicesPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { addAppointment } = useAppointmentStore();
    const { staff } = useStaffStore();
    const initialCat = searchParams.get('category') as ServiceCategory | null;
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>((initialCat as ServiceCategory) || 'All');

    // Modal & Booking State
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedStaff, setSelectedStaff] = useState(staff[0]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('10:00 AM');
    const [phone, setPhone] = useState(user?.phone || '');
    const [phoneError, setPhoneError] = useState('');

    const filtered = useMemo(() => {
        return mockServices.filter(s => {
            const matchesCat = activeCategory === 'All' || s.category === activeCategory;
            const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.description.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch && s.isActive;
        });
    }, [search, activeCategory]);

    const serviceGallery = useMemo(() => {
        if (!selectedService) return [];
        return mockGallery.filter(item => item.category === selectedService.category);
    }, [selectedService]);

    const handleCloseModal = () => {
        setSelectedService(null);
        setBookingStep(1);
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book an appointment');
            navigate('/login');
            return;
        }

        if (!selectedService) return;

        if (!phone || phone.length < 9) {
            setPhoneError('Please enter a valid WhatsApp number');
            toast.error('Please enter a valid WhatsApp number');
            return;
        }
        setPhoneError('');

        const rawTime = selectedTime.includes('AM') ? selectedTime.split(' ')[0] : (parseInt(selectedTime.split(':')[0]) + 12) + ':' + selectedTime.split(':')[1].split(' ')[0];

        if (useAppointmentStore.getState().isSlotTaken(selectedStaff.id, selectedDate, rawTime)) {
            toast.error('This slot was just booked by someone else. Please pick another time.');
            setBookingStep(2);
            return;
        }

        const bookingId = generateBookingId();
        const appointment: Appointment = {
            id: bookingId,
            bookingId: bookingId,
            customerId: user.id,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: phone,
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            servicePrice: selectedService.discountPrice || selectedService.price,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            date: selectedDate,
            timeSlot: rawTime,
            duration: selectedService.duration,
            status: 'Pending',
            paymentStatus: 'Unpaid',
            createdAt: new Date().toISOString()
        };

        await addAppointment(appointment);
        toast.success(
            <div className="flex flex-col gap-1">
                <span className="font-bold">Your booking request has been submitted successfully! ✨</span>
                <span className="text-xs opacity-80 italic">We will notify you via WhatsApp once confirmed.</span>
            </div>,
            { duration: 5000 }
        );
        handleCloseModal();
        navigate('/my-appointments');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="font-serif text-4xl font-bold text-[var(--text-primary)] mb-3">
                    Our <span className="text-gradient">Services</span>
                </h1>
                <p className="text-[var(--text-muted)]">Premium beauty treatments tailored to you</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search services..."
                    className="input-field pl-10"
                />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {['All', ...categories].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as ServiceCategory | 'All')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === cat
                            ? 'bg-[var(--gold)] text-black'
                            : 'bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]/20 shadow-sm border border-[var(--border)]'
                            }`}
                    >
                        {cat !== 'All' && categoryIcons[cat]}
                        {cat}
                    </button>
                ))}
            </div>

            {/* Services grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-muted)]">No services found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((svc, i) => (
                        <motion.div
                            key={svc.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedService(svc)}
                            className="card p-6 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col cursor-pointer group"
                        >
                            {/* Tags */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-0.5 rounded-full flex items-center gap-1">
                                    {categoryIcons[svc.category]}
                                    {svc.category}
                                </span>
                                {svc.isPackage && (
                                    <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Package className="w-3 h-3" /> Package
                                    </span>
                                )}
                                {svc.discountPrice && (
                                    <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Tag className="w-3 h-3" /> Sale
                                    </span>
                                )}
                            </div>

                            <h3 className="font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--gold)] transition-colors">{svc.name}</h3>
                            <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-4">{svc.description}</p>

                            <div className="flex items-center gap-4 mb-4 mt-auto">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-glass)] rounded-lg border border-[var(--border-glass)]">
                                    <Star className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                                    <span className="text-sm font-bold text-[var(--text-primary)]">
                                        {useReviewStore.getState().getServiceAverage(svc.id).toFixed(1)}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-muted)] font-medium">
                                        ({useReviewStore.getState().getServiceReviewCount(svc.id)})
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{formatDuration(svc.duration)}</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between border-t border-[var(--border)] pt-4">
                                <div>
                                    {svc.discountPrice ? (
                                        <div>
                                            <span className="text-xs text-[var(--text-muted)] line-through">{formatPrice(svc.price)}</span>
                                            <div className="text-lg font-bold text-gradient">{formatPrice(svc.discountPrice)}</div>
                                        </div>
                                    ) : (
                                        <div className="text-lg font-bold text-gradient">{formatPrice(svc.price)}</div>
                                    )}
                                </div>
                                <div className="text-[var(--gold)] flex items-center gap-1 text-sm font-medium">
                                    Details <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Service Detail & Booking Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Steps Indicator (Only show if starting booking) */}
                            {bookingStep > 1 && (
                                <div className="bg-[var(--bg-glass)] border-b border-[var(--border)] p-3 sm:p-4 flex justify-center gap-4 sm:gap-8">
                                    {bookingSteps.map((s, i) => (
                                        <div key={s.id} className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${bookingStep >= s.id ? 'bg-[var(--gold)] text-black' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]'}`}>
                                                {bookingStep > s.id ? <Check className="w-4 h-4" /> : s.id}
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-widest font-bold hidden sm:block ${bookingStep >= s.id ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
                                                {s.name}
                                            </span>
                                            {i < bookingSteps.length - 1 && <div className="w-8 h-[1px] bg-[var(--border)] ml-2" />}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
                                {/* Left Content Area */}
                                <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-10 custom-scrollbar">
                                    <AnimatePresence mode="wait">
                                        {bookingStep === 1 && (
                                            <motion.div
                                                key="details"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <div className="flex items-center gap-3 mb-6">
                                                    <span className="flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] rounded-full text-xs font-semibold uppercase tracking-wider">
                                                        {categoryIcons[selectedService.category]}
                                                        {selectedService.category}
                                                    </span>
                                                    {selectedService.isPackage && (
                                                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                                                            Package
                                                        </span>
                                                    )}
                                                </div>

                                                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">
                                                    {selectedService.name}
                                                </h2>

                                                <div className="flex flex-wrap items-center gap-6 mb-8 text-[var(--text-muted)]">
                                                    {/* Featured Image for Mobile */}
                                                    <div className="lg:hidden w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--border)] mb-6 shadow-lg">
                                                        <img 
                                                            src={selectedService.image || (serviceGallery.length > 0 ? serviceGallery[0].image : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800')} 
                                                            alt={selectedService.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2 text-lg">
                                                        <Clock className="w-5 h-5 text-[var(--gold)]" />
                                                        <span>{formatDuration(selectedService.duration)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-glass)] rounded-xl border border-[var(--border-glass)]">
                                                            <Star className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                                                            <span className="font-bold text-[var(--text-primary)]">
                                                                {useReviewStore.getState().getServiceAverage(selectedService.id).toFixed(1)}
                                                            </span>
                                                            <span className="text-xs text-[var(--text-muted)]">
                                                                ({useReviewStore.getState().getServiceReviewCount(selectedService.id)} Reviews)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6 mb-10">
                                                    <div>
                                                        <h4 className="text-sm font-semibold uppercase text-[var(--gold)] tracking-widest mb-3">Description</h4>
                                                        <p className="text-[var(--text-muted)] leading-relaxed text-lg italic">
                                                            "{selectedService.description}"
                                                        </p>
                                                    </div>

                                                    {selectedService.packageServices && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold uppercase text-[var(--gold)] tracking-widest mb-3">Included in Package</h4>
                                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {selectedService.packageServices.map((includedSvcId) => {
                                                                    const svc = mockServices.find(s => s.id === includedSvcId);
                                                                    return svc ? (
                                                                        <li key={includedSvcId} className="flex items-center gap-2 text-[var(--text-primary)] bg-[var(--bg-glass)] p-3 rounded-xl border border-[var(--border)]">
                                                                            <div className="p-1.5 bg-[var(--gold)]/10 rounded-lg">
                                                                                <Check className="w-4 h-4 text-[var(--gold)]" />
                                                                            </div>
                                                                            <span className="text-sm font-medium">{svc.name}</span>
                                                                        </li>
                                                                    ) : null;
                                                                })}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
                                                    <div>
                                                        <p className="text-sm text-[var(--text-muted)] mb-1">Total Treatment Price</p>
                                                        <div className="text-3xl font-bold text-gradient">
                                                            {formatPrice(selectedService.discountPrice || selectedService.price)}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setBookingStep(2)}
                                                        className="btn-gold px-8 py-4 flex items-center gap-2 text-lg font-bold group"
                                                    >
                                                        Book This Now
                                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {bookingStep === 2 && (
                                            <motion.div
                                                key="time"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-8"
                                            >
                                                <div>
                                                    <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2">Schedule Your Visit</h3>
                                                    <p className="text-[var(--text-muted)]">Select your preferred date, artist and time slot.</p>
                                                </div>

                                                {/* Date Selection */}
                                                <div className="bg-[var(--bg-glass)] border border-[var(--border)] rounded-2xl p-4">
                                                    <h4 className="text-[10px] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" /> Select Date
                                                    </h4>
                                                    <input
                                                        type="date"
                                                        min={new Date().toISOString().split('T')[0]}
                                                        value={selectedDate}
                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-primary)] focus:border-[var(--gold)]/50 focus:outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                                    />
                                                </div>

                                                {/* Artists Selection */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5 text-[var(--gold)]" /> Choose Artist
                                                    </h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {staff.map(s => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => setSelectedStaff(s)}
                                                                className={`p-3 rounded-2xl border transition-all ${selectedStaff.id === s.id ? 'border-[var(--gold)] bg-[var(--gold)]/5' : 'bg-[var(--bg-glass)] border-[var(--border)] hover:border-[var(--gold)]/30'}`}
                                                            >
                                                                <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] font-bold mx-auto mb-2 text-sm">
                                                                    {s.name[0]}
                                                                </div>
                                                                <div className="text-xs font-bold text-[var(--text-primary)] text-center truncate">{s.name}</div>
                                                                <div className="flex items-center justify-center gap-1 text-[8px] text-[var(--gold)] mt-0.5 font-bold uppercase">
                                                                    <Star className="w-2.5 h-2.5 fill-[var(--gold)]" />
                                                                    {s.rating}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Time Selection */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-[var(--gold)]" /> Pick Time Slot
                                                        </h4>
                                                    </div>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                        {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(time => {
                                                            const rawTime = time.includes('AM') ? time.split(' ')[0] : (parseInt(time.split(':')[0]) + 12) + ':' + time.split(':')[1].split(' ')[0];
                                                            const isTaken = useAppointmentStore.getState().isSlotTaken(selectedStaff.id, selectedDate, rawTime);
                                                            return (
                                                                <button
                                                                    key={time}
                                                                    disabled={isTaken}
                                                                    onClick={() => setSelectedTime(time)}
                                                                    className={`py-2 rounded-xl text-xs font-bold transition-all ${isTaken ? 'bg-[var(--bg-glass)] text-[var(--text-muted)] opacity-30 cursor-not-allowed border border-[var(--border)]' : selectedTime === time ? 'bg-[var(--gold)] text-black border border-[var(--gold)] shadow-lg shadow-[#D4AF37]/20' : 'bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]'}`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 pt-4">
                                                    <button onClick={() => setBookingStep(1)} className="btn-outline-gold flex-1 py-3 flex items-center justify-center gap-2">
                                                        <ChevronLeft className="w-4 h-4" /> Back to Details
                                                    </button>
                                                    <button onClick={() => setBookingStep(3)} className="btn-gold flex-1 py-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs">
                                                        Review Selection <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {bookingStep === 3 && (
                                            <motion.div
                                                key="review"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="space-y-6"
                                            >
                                                <div className="text-center">
                                                    <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2">Final Confirmation</h3>
                                                    <p className="text-[var(--text-muted)] text-sm">Review your selection before confirming the appointment.</p>
                                                </div>

                                                <div className="bg-[var(--bg-glass)] border border-[var(--border)] rounded-3xl p-6 lg:p-8 space-y-6">
                                                    <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)]">
                                                        <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                                                            {categoryIcons[selectedService.category]}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-[var(--text-primary)]">{selectedService.name}</h4>
                                                            <p className="text-xs text-[var(--text-muted)] font-medium">{selectedService.category} · {selectedService.duration} min</p>
                                                        </div>
                                                        <div className="ml-auto text-xl font-bold text-gradient">
                                                            {formatPrice(selectedService.discountPrice || selectedService.price)}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--gold)] border border-[var(--border)]">
                                                                    <User className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-0.5">Stylist</p>
                                                                    <p className="text-sm text-[var(--text-primary)] font-semibold">{selectedStaff.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--gold)] border border-[var(--border)]">
                                                                    <Calendar className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-0.5">Date & Time</p>
                                                                    <p className="text-sm text-[var(--text-primary)] font-semibold">{formatDate(selectedDate)} @ {selectedTime}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--gold)] border border-[var(--border)]">
                                                                    <MessageCircle className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-0.5">WhatsApp Number</p>
                                                                    <input
                                                                        type="tel"
                                                                        value={phone}
                                                                        onChange={e => {
                                                                            setPhone(e.target.value);
                                                                            if (e.target.value.length >= 9) setPhoneError('');
                                                                        }}
                                                                        placeholder="+94 77 123 4567"
                                                                        className={`w-full bg-transparent border-b ${phoneError ? 'border-red-500' : 'border-[var(--border)]'} text-sm text-[var(--text-primary)] focus:border-[var(--gold)] outline-none py-0.5`}
                                                                    />
                                                                    {phoneError && <p className="text-[10px] text-red-500 mt-1">{phoneError}</p>}
                                                                    <p className="text-[8px] text-[var(--text-muted)] mt-1 italic">Required for appointment updates via WhatsApp</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--gold)] border border-[var(--border)]">
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-0.5">Payment Policy</p>
                                                                    <p className="text-sm text-[var(--text-primary)] font-semibold">Pay at the Counter</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 pt-4">
                                                    <button onClick={() => setBookingStep(2)} className="btn-outline-gold flex-1 py-4 text-xs font-bold uppercase tracking-wider">
                                                        Change Time
                                                    </button>
                                                    <button onClick={handleBooking} className="btn-gold flex-1 py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs">
                                                        <Wallet className="w-4 h-4" /> Confirm Booking
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Right Gallery View (Only show in step 1 on desktop) */}
                                {bookingStep === 1 && (
                                    <div className="hidden lg:flex w-full lg:w-[350px] bg-[var(--bg-secondary)] border-l border-[var(--border)] flex-col">
                                        <div className="p-6 border-b border-[var(--border)]">
                                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-[var(--gold)] tracking-widest">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Work Gallery
                                            </h4>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                            {serviceGallery.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {serviceGallery.map((item, idx) => (
                                                        <motion.div
                                                            key={item.id}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="aspect-square rounded-xl overflow-hidden border border-[var(--border)] group/img relative"
                                                        >
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-[var(--text-muted)]/30 text-center p-8">
                                                    <Package className="w-10 h-10 mb-2 block mx-auto opacity-10" />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">No Photos</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 bg-[var(--bg-card)] border-t border-[var(--border)]">
                                            <p className="text-[9px] text-[var(--text-muted)] leading-relaxed italic">
                                                * Previewing results from our {selectedService.category} treatments.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


