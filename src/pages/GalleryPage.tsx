import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Camera, Filter } from 'lucide-react';
import { mockGallery } from '../utils/mockData';

const CATEGORIES = ['All', 'Hair', 'Makeup', 'Bridal', 'Facial', 'Nails'];

export default function GalleryPage() {
    const [filter, setFilter] = useState('All');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const filteredGallery = mockGallery.filter(item =>
        filter === 'All' || item.category === filter
    );

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Camera className="w-3.5 h-3.5" /> Our Masterpieces
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6"
                    >
                        Artistry in <span className="text-gradient">Every Detail</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--text-muted)] max-w-2xl mx-auto text-sm sm:text-base"
                    >
                        Explore our collection of signature looks and transformations. From elegant bridals to modern hair styling, witness the magic of our expert stylists.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                    {CATEGORIES.map((cat, i) => (
                        <motion.button
                            key={cat}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            onClick={() => setFilter(cat)}
                            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${filter === cat
                                ? 'bg-[var(--gold)] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                : 'bg-[var(--bg-glass)] text-[var(--text-muted)] hover:bg-[var(--bg-glass)]/20 hover:text-[var(--text-primary)] border border-[var(--border)]'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredGallery.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md"
                                onClick={() => setSelectedImage(item.image)}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Overlay — always partially visible on mobile, full on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-6">
                                    <span className="text-[var(--gold)] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5 sm:mb-1">{item.category}</span>
                                    <h3 className="text-white font-medium text-xs sm:text-lg leading-tight mb-2 sm:mb-4 line-clamp-2">{item.title}</h3>
                                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-[var(--bg-glass)] backdrop-blur-md items-center justify-center border border-[var(--border-glass)] self-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <Maximize2 className="w-5 h-5 text-[var(--text-primary)]" />
                                    </div>
                                    {/* Mobile tap icon */}
                                    <div className="sm:hidden absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <Maximize2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredGallery.length === 0 && (
                    <div className="text-center py-20">
                        <Filter className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-20" />
                        <p className="text-[var(--text-muted)] font-medium">No masterpieces found in this category yet.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.button
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={selectedImage}
                            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl shadow-[var(--gold)]/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
