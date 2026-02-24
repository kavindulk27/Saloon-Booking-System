import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { useReviewStore } from '../store/useReviewStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: {
        id: string;
        serviceId: string;
        serviceName: string;
        staffId?: string;
        staffName?: string;
    };
}

export default function RatingModal({ isOpen, onClose, appointment }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const { addReview } = useReviewStore();
    const { user } = useAuthStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        const newReview = {
            id: Math.random().toString(36).substr(2, 9),
            customerId: user?.id || 'guest',
            customerName: user?.name || 'Guest',
            serviceId: appointment.serviceId,
            staffId: appointment.staffId,
            rating,
            comment,
            createdAt: new Date().toISOString(),
        };

        addReview(newReview);
        toast.success(`Thank you for your feedback! ✨`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2 block">Leave a Review</span>
                                    <h2 className="text-2xl font-serif font-bold text-white">How was your {appointment.serviceName}?</h2>
                                    {appointment.staffName && (
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                            Artist: <span className="text-gray-300 font-medium">{appointment.staffName}</span>
                                        </p>
                                    )}
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Stars Selection */}
                                <div className="flex flex-col items-center py-4">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                onClick={() => setRating(star)}
                                                className="transition-transform active:scale-95 p-1"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-all duration-300 ${(hover || rating) >= star
                                                            ? 'fill-[#D4AF37] text-[#D4AF37] filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                                                            : 'text-gray-700'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                        {rating === 5 ? 'Exceptional! ✨' :
                                            rating === 4 ? 'Very Good 👍' :
                                                rating === 3 ? 'Good 🙂' :
                                                    rating === 2 ? 'Fair 😐' :
                                                        rating === 1 ? 'Poor ☹️' : 'Select your rating'}
                                    </p>
                                </div>

                                {/* Comment Area */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Share your experience (Optional)
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us what you loved..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:outline-none transition-all h-32 resize-none"
                                    />
                                </div>

                                {/* Trust Badge */}
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    <div>
                                        <p className="text-xs font-bold text-white">Verified Review</p>
                                        <p className="text-[10px] text-gray-500 italic">Your feedback helps our artists grow.</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-gold w-full py-4 flex items-center justify-center gap-2 text-sm"
                                >
                                    Submit Review <Sparkles className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
