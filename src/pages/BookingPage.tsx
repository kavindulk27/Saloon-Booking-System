import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scissors, Calendar, Clock, User, CheckCircle2,
    ChevronRight, ChevronLeft, Sparkles, MapPin,
    Star, ShieldCheck, CreditCard
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { mockServices, mockStaff } from '../utils/mockData';
import { formatPrice, formatDuration } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useReviewStore } from '../store/useReviewStore';

const steps = [
    { id: 1, name: 'Service', icon: <Scissors className="w-4 h-4" /> },
    { id: 2, name: 'Time & Artist', icon: <Calendar className="w-4 h-4" /> },
    { id: 3, name: 'Review', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function BookingPage() {
    const { user } = useAuthStore();
    const { addAppointment } = useAppointmentStore();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(mockServices[0]);
    const [selectedStaff, setSelectedStaff] = useState(mockStaff[0]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('10:00 AM');

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book an appointment');
            navigate('/login');
            return;
        }

        const rawTime = selectedTime.includes('AM') ? selectedTime.split(' ')[0] : (parseInt(selectedTime.split(':')[0]) + 12) + ':' + selectedTime.split(':')[1].split(' ')[0];

        if (useAppointmentStore.getState().isSlotTaken(selectedStaff.id, selectedDate, rawTime)) {
            toast.error('This slot was just booked by someone else. Please pick another time.');
            setStep(2);
            return;
        }

        const appointment = {
            id: Math.random().toString(36).substr(2, 9),
            customerId: user.id,
            customerName: user.name,
            customerEmail: user.email,
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            servicePrice: selectedService.discountPrice || selectedService.price,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            date: selectedDate,
            timeSlot: rawTime,
            duration: selectedService.duration,
            status: 'Pending' as const,
            paymentStatus: 'Unpaid' as const,
            createdAt: new Date().toISOString()
        };

        // @ts-ignore - The type might still be slightly off if some fields are required by useAppointmentStore but not provided
        addAppointment(appointment);
        toast.success('Appointment booked successfully! ✨');
        navigate('/my-appointments');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Steps Indicator */}
            <div className="flex justify-between items-center mb-12">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <div className={`flex flex-col items-center gap-2 group`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.id ? 'bg-[var(--gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border)]'
                                }`}>
                                {s.icon}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= s.id ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'
                                }`}>
                                {s.name}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="flex-1 h-[2px] mx-4 bg-white/5 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-[#D4AF37]"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: step > s.id ? '0%' : '-100%' }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-10">
                            <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-2">Select a Service</h2>
                            <p className="text-[var(--text-muted)]">Choose the perfect treatment for your transformation</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockServices.map(svc => (
                                <button
                                    key={svc.id}
                                    onClick={() => { setSelectedService(svc); setStep(2); }}
                                    className={`card-glass p-5 text-left transition-all duration-300 hover:border-[var(--gold)]/50 ${selectedService.id === svc.id ? 'border-[var(--gold)] bg-[var(--gold)]/5' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-[var(--text-primary)]">{svc.name}</h3>
                                        <div className="text-[var(--gold)] font-bold">{formatPrice(svc.discountPrice || svc.price)}</div>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">{svc.description}</p>
                                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {svc.duration}m</span>
                                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {svc.category}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center mb-8">
                            <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-2">Pick your Artist & Time</h2>
                            <p className="text-[var(--text-muted)]">Available slots for {selectedService.name}</p>
                        </div>

                        {/* Date Selection */}
                        <div className="bg-[var(--bg-glass)] border border-[var(--border)] rounded-3xl p-6">
                            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 uppercase tracking-widest">
                                <Calendar className="w-4 h-4 text-[var(--gold)]" /> Select Date
                            </h3>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 text-[var(--text-primary)] focus:border-[var(--gold)]/50 focus:outline-none transition-all [color-scheme:dark]"
                            />
                        </div>

                        {/* Artists Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {mockStaff.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedStaff(s)}
                                    className={`card-glass p-4 text-center transition-all duration-300 hover:border-[var(--gold)]/50 ${selectedStaff.id === s.id ? 'border-[var(--gold)] bg-[var(--gold)]/5' : ''
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-[var(--gold)] flex items-center justify-center text-black font-bold mx-auto mb-3">
                                        {s.name[0]}
                                    </div>
                                    <div className="text-sm font-bold text-[var(--text-primary)]">{s.name}</div>
                                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--gold)] mt-1">
                                        <Star className="w-3 h-3 fill-[var(--gold)]" />
                                        {useReviewStore.getState().getStaffReviewCount(s.id) > 0
                                            ? useReviewStore.getState().getStaffAverage(s.id).toFixed(1)
                                            : s.rating}
                                        <span className="text-[var(--text-muted)] text-[8px] ml-0.5">
                                            ({useReviewStore.getState().getStaffReviewCount(s.id)})
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Time Slots */}
                        <div className="bg-[var(--bg-glass)] border border-[var(--border)] rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-widest">
                                    <Clock className="w-4 h-4 text-[var(--gold)]" /> Select Time
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]/20" />
                                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Booked</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[var(--gold)]" />
                                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Available</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(time => {
                                    const rawTime = time.includes('AM') && time.startsWith('12') ? '00:' + time.split(':')[1].split(' ')[0] : // Handle 12 AM
                                        time.includes('PM') && time.startsWith('12') ? '12:' + time.split(':')[1].split(' ')[0] : // Handle 12 PM
                                            time.includes('PM') ? (parseInt(time.split(':')[0]) + 12) + ':' + time.split(':')[1].split(' ')[0] :
                                                time.split(' ')[0];
                                    const isTaken = useAppointmentStore.getState().isSlotTaken(selectedStaff.id, selectedDate, rawTime);

                                    return (
                                        <button
                                            key={time}
                                            disabled={isTaken}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2.5 rounded-xl text-xs font-semibold transition-all relative overflow-hidden ${isTaken
                                                ? 'bg-[var(--bg-glass)] text-[var(--text-muted)]/50 cursor-not-allowed border border-[var(--border)]'
                                                : selectedTime === time
                                                    ? 'bg-[var(--gold)] text-black shadow-lg shadow-[#D4AF37]/20 border border-[var(--gold)]'
                                                    : 'bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]/20 border border-[var(--border)]'
                                                }`}
                                        >
                                            {time}
                                            {isTaken && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-40">Booked</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="btn-outline-gold flex-1 py-3 flex items-center justify-center gap-2">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={(() => {
                                    const rawTime = selectedTime.includes('AM') && selectedTime.startsWith('12') ? '00:' + selectedTime.split(':')[1].split(' ')[0] : // Handle 12 AM
                                        selectedTime.includes('PM') && selectedTime.startsWith('12') ? '12:' + selectedTime.split(':')[1].split(' ')[0] : // Handle 12 PM
                                            selectedTime.includes('PM') ? (parseInt(selectedTime.split(':')[0]) + 12) + ':' + selectedTime.split(':')[1].split(' ')[0] :
                                                selectedTime.split(' ')[0];
                                    return useAppointmentStore.getState().isSlotTaken(selectedStaff.id, selectedDate, rawTime);
                                })()}
                                className="btn-gold flex-1 py-3 flex items-center justify-center gap-2"
                            >
                                Next Step <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-2">Review & Confirm</h2>
                            <p className="text-[var(--text-muted)]">Everything looks good?</p>
                        </div>

                        <div className="card-glass p-8 rounded-3xl space-y-6">
                            <div className="flex items-center gap-4 border-b border-[var(--border-glass)] pb-6">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                                    <Scissors className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{selectedService.name}</h3>
                                    <p className="text-sm text-[var(--text-muted)]">{selectedService.category} · {selectedService.duration} min</p>
                                </div>
                                <div className="ml-auto text-2xl font-bold text-gradient">
                                    {formatPrice(selectedService.discountPrice || selectedService.price)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-glass)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Artist</p>
                                            <p className="text-[var(--text-primary)] font-medium">{selectedStaff.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-glass)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Date & Time</p>
                                            <p className="text-[var(--text-primary)] font-medium">{selectedDate} at {selectedTime}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-glass)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Location</p>
                                            <p className="text-[var(--text-primary)] font-medium">Colombo Main Branch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-[var(--bg-glass)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Insurance</p>
                                            <p className="text-[var(--text-primary)] font-medium">GlamStudio Guarantee included</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="btn-outline-gold flex-1 py-4">
                                Modify Details
                            </button>
                            <button onClick={handleBooking} className="btn-gold flex-1 py-4 flex items-center justify-center gap-2">
                                <CreditCard className="w-4 h-4" /> Confirm & Book
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
