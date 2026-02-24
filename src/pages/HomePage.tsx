import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Star, Clock, Sparkles, ShieldCheck, Mail, Phone, MapPin,
    Instagram, Facebook, Twitter, Lock, Scissors, Gem, Award, HeartPulse, Shield
} from 'lucide-react';
import { mockServices, mockStaff, mockReviews } from '../utils/mockData';
import { formatPrice } from '../utils/helpers';
import { useAuthStore } from '../store/useAuthStore';

const categories = [
    { name: 'Hair', icon: <Scissors className="w-6 h-6" />, desc: 'Cuts, Color & Styling', count: 8 },
    { name: 'Facial', icon: <Sparkles className="w-6 h-6" />, desc: 'Glow & Skincare', count: 5 },
    { name: 'Bridal', icon: <Gem className="w-6 h-6" />, desc: 'Full Bridal Packages', count: 4 },
    { name: 'Nails', icon: <Award className="w-6 h-6" />, desc: 'Gel, Acrylic & Art', count: 6 },
    { name: 'Massage', icon: <HeartPulse className="w-6 h-6" />, desc: 'Relax & Rejuvenate', count: 3 },
];

const stats = [
    { label: 'Happy Clients', value: '2,400+' },
    { label: 'Expert Staff', value: '12' },
    { label: 'Services', value: '50+' },
    { label: 'Years of Excellence', value: '8' },
];

export default function HomePage() {
    const { isAuthenticated } = useAuthStore();
    const featured = mockServices.slice(0, 4);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/90 to-transparent" />
                {/* Gold orbs */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 right-40 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full px-4 py-1.5 mb-6"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                            <span className="text-xs font-medium text-[var(--gold)]">Sri Lanka's #1 Premium Saloon</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-serif text-5xl md:text-7xl font-bold text-[var(--text-primary)] leading-tight mb-6"
                        >
                            Look Your{' '}
                            <span className="text-gradient">Absolute</span>{' '}
                            Best
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed"
                        >
                            Experience premium beauty services at GlamStudio. From hair artistry to bridal perfection —
                            book your appointment in seconds and walk out transformed.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link to="/book" className="btn-gold flex items-center gap-2 text-sm px-6 py-3">
                                Book Appointment <ArrowRight className="w-4 h-4" />
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/register" className="btn-outline-gold px-8 py-3">Join Free</Link>
                            )}
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-5 mt-10"
                        >
                            {[
                                { icon: <Shield className="w-4 h-4 text-[#D4AF37]" />, text: 'Certified Professionals' },
                                { icon: <Star className="w-4 h-4 text-[#D4AF37]" />, text: '4.9★ Average Rating' },
                                { icon: <Clock className="w-4 h-4 text-[#D4AF37]" />, text: 'Instant Confirmation' },
                            ].map(b => (
                                <div key={b.text} className="flex items-center gap-2">
                                    {b.icon}
                                    <span className="text-xs text-gray-400">{b.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)]/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-gradient">{s.value}</div>
                            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
                        Our <span className="text-gradient">Services</span>
                    </h2>
                    <p className="text-[var(--text-muted)]">Everything you need for a complete beauty transformation</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                to={`/services?category=${cat.name}`}
                                className="card hover:border-[#D4AF37]/50 p-5 flex flex-col items-center text-center gap-3 group transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] block"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] transition-all duration-300">
                                    {cat.icon}
                                </div>
                                <div>
                                    <div className="font-semibold text-white text-sm">{cat.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
                                </div>
                                <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full">{cat.count} services</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Services */}
            <section className="bg-[var(--bg-secondary)] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)]">
                                Popular <span className="text-gradient">Services</span>
                            </h2>
                            <p className="text-[var(--text-muted)] text-sm mt-1">Loved by our clients</p>
                        </div>
                        <Link to="/services" className="btn-outline-gold text-sm hidden md:flex items-center gap-2">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {featured.map((svc, i) => (
                            <motion.div
                                key={svc.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card p-5 hover:border-[#D4AF37]/40 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4">
                                    <Scissors className="w-6 h-6" />
                                </div>
                                <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">{svc.category}</span>
                                <h3 className="font-semibold text-white mt-3 mb-1">{svc.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{svc.description}</p>
                                <div className="flex items-end justify-between">
                                    <div>
                                        {svc.discountPrice ? (
                                            <div>
                                                <span className="text-xs text-gray-500 line-through">{formatPrice(svc.price)}</span>
                                                <div className="text-[#D4AF37] font-bold">{formatPrice(svc.discountPrice)}</div>
                                            </div>
                                        ) : (
                                            <div className="text-[#D4AF37] font-bold">{formatPrice(svc.price)}</div>
                                        )}
                                        <span className="text-xs text-gray-500">{svc.duration} min</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
                        Meet Our <span className="text-gradient">Artists</span>
                    </h2>
                    <p className="text-[var(--text-muted)]">Skilled professionals dedicated to your beauty</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockStaff.map((staff, i) => (
                        <motion.div
                            key={staff.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="card p-6 flex flex-col items-center text-center hover:border-[#D4AF37]/40 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-xl font-bold mb-4">
                                {staff.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h3 className="font-semibold text-white">{staff.name}</h3>
                            <div className="flex flex-wrap gap-1 justify-center my-3">
                                {staff.specializations.map(s => (
                                    <span key={s} className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full">{s}</span>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                                <span>{staff.rating}</span>
                                <span className="text-gray-600">·</span>
                                <span>{staff.totalAppointments} appointments</span>
                            </div>
                            {staff.isOnLeave && (
                                <span className="mt-3 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-full">
                                    On Leave until {staff.leaveUntil}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Reviews */}
            <section className="bg-[var(--bg-secondary)] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-3">
                            What Clients <span className="text-gradient">Say</span>
                        </h2>
                        <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                            ))}
                            <span className="text-gray-400 text-sm ml-2">4.9 from 240+ reviews</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {mockReviews.map((review, i) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card p-6"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                                        {review.customerName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-sm">{review.customerName}</div>
                                        <div className="flex gap-0.5">
                                            {[...Array(review.rating)].map((_, j) => (
                                                <Star key={j} className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 italic">"{review.comment}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--gold)]/30 p-10 md:p-16 text-center"
                >
                    <div className="absolute top-0 left-0 w-40 h-40 bg-[var(--gold)]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-[var(--gold)]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative">
                        <Gem className="w-10 h-10 text-[var(--gold)] mx-auto mb-4" />
                        <h2 className="font-serif text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                            Premium <span className="text-gradient">Excellence</span>
                        </h2>
                        <p className="text-[var(--text-muted)] mb-8 max-w-lg mx-auto">
                            Experience the GlamStudio difference with our certified professionals and luxury treatments.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/book" className="btn-gold flex items-center gap-2 px-8 py-3">
                                Book Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--border)] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-[var(--gold)]" />
                        <span className="font-serif font-bold text-[var(--text-primary)]">GlamStudio</span>
                    </div>
                    <p className="text-xs text-gray-600">© 2026 GlamStudio. All rights reserved.</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                        <Link to="/services" className="hover:text-[#D4AF37] transition-colors">Services</Link>
                        <Link to="/login" className="hover:text-[#D4AF37] transition-colors">Customer Login</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
