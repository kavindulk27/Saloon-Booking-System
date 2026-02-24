import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Tag, Package, ArrowRight, Scissors, Sparkles, Gem, Award, HeartPulse, Star } from 'lucide-react';
import { mockServices } from '../utils/mockData';
import { formatPrice, formatDuration } from '../utils/helpers';
import type { ServiceCategory } from '../types';
import { useReviewStore } from '../store/useReviewStore';

const categories: ServiceCategory[] = ['Hair', 'Facial', 'Bridal', 'Nails', 'Massage', 'Makeup'];
const categoryIcons: Record<string, React.ReactNode> = {
    Hair: <Scissors className="w-4 h-4" />,
    Facial: <Sparkles className="w-4 h-4" />,
    Bridal: <Gem className="w-4 h-4" />,
    Nails: <Award className="w-4 h-4" />,
    Massage: <HeartPulse className="w-4 h-4" />,
    Makeup: <Sparkles className="w-4 h-4" />,
};

export default function ServicesPage() {
    const [searchParams] = useSearchParams();
    const initialCat = searchParams.get('category') as ServiceCategory | null;
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>((initialCat as ServiceCategory) || 'All');

    const filtered = useMemo(() => {
        return mockServices.filter(s => {
            const matchesCat = activeCategory === 'All' || s.category === activeCategory;
            const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.description.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch && s.isActive;
        });
    }, [search, activeCategory]);

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
                            className="card p-6 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col"
                        >
                            {/* Tags */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full flex items-center gap-1">
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

                            <h3 className="font-semibold text-[var(--text-primary)] mb-2">{svc.name}</h3>
                            <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-4">{svc.description}</p>

                            <div className="flex items-center gap-4 mb-4">
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
                                <Link
                                    to={`/book?service=${svc.id}`}
                                    className="btn-gold text-xs px-4 py-2 flex items-center gap-1"
                                >
                                    Book <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
