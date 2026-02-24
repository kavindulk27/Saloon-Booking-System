import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Filter, MessageSquare, User, Scissors, Calendar } from 'lucide-react';
import { useReviewStore } from '../../store/useReviewStore';
import { formatDate } from '../../utils/helpers';
import { mockServices } from '../../utils/mockData';

export default function AdminReviewsPage() {
    const { reviews } = useReviewStore();
    const [filterRating, setFilterRating] = useState<number | 'All'>('All');

    const filtered = reviews.filter(r =>
        filterRating === 'All' || r.rating === filterRating
    );

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const getServiceName = (id: string) => mockServices.find(s => s.id === id)?.name || 'Unknown Service';

    return (
        <div className="p-6 max-w-7xl">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Customer Reviews</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-0.5">Manage and monitor customer feedback</p>
                </div>
                <div className="flex items-center gap-3 bg-[var(--bg-glass)] border border-[var(--border-glass)] px-4 py-3 rounded-2xl">
                    <div className="text-center border-r border-[var(--border-glass)] pr-4">
                        <div className="text-2xl font-bold text-[var(--gold)]">{averageRating}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Rating</div>
                    </div>
                    <div className="pl-1">
                        <div className="flex gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-3 h-3 ${star <= Math.round(Number(averageRating)) ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-gray-600'}`} />
                            ))}
                        </div>
                        <div className="text-[10px] text-gray-500">{reviews.length} Total Reviews</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl">
                    <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="text-xs text-[var(--text-muted)]">Filter by Rating:</span>
                </div>
                <div className="flex gap-2">
                    {['All', 5, 4, 3, 2, 1].map(r => (
                        <button
                            key={r}
                            onClick={() => setFilterRating(r as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterRating === r
                                    ? 'bg-[var(--gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {r === 'All' ? 'All' : `${r} Star`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.length === 0 ? (
                    <div className="col-span-2 text-center py-20 card text-[var(--text-muted)]">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No reviews found matching your filter</p>
                    </div>
                ) : filtered.map((r, i) => (
                    <motion.div
                        key={r.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="card p-5 hover:border-[var(--gold)]/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[var(--gold)]/30 transition-colors">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">{r.customerName}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                        <Calendar className="w-3 h-3" /> {formatDate(r.createdAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= r.rating ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-gray-700'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3 px-2 py-1 bg-[var(--gold)]/5 rounded-lg border border-[var(--gold)]/10">
                            <Scissors className="w-3 h-3 text-[var(--gold)]" />
                            <span className="text-[10px] font-medium text-[var(--gold)] uppercase tracking-wider">
                                {getServiceName(r.serviceId)}
                            </span>
                        </div>

                        <p className="text-gray-400 text-sm italic leading-relaxed">
                            "{r.comment}"
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
