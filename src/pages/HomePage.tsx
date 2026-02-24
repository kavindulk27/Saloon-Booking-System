import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Star, Clock, Sparkles, ShieldCheck, Mail, Phone, MapPin,
    Instagram, Facebook, Twitter, Lock, Scissors, Gem, Award, HeartPulse, Shield,
    AlertCircle
} from 'lucide-react';
import { mockServices, mockStaff, mockReviews } from '../utils/mockData';
import { formatPrice } from '../utils/helpers';
import { useAuthStore } from '../store/useAuthStore';

const categories = [
    { name: 'Hair Artistry', icon: <Scissors className="w-6 h-6" />, desc: 'Cuts, Color & Level-Up Styling', count: 8, span: 'md:col-span-3 md:row-span-2' },
    { name: 'Skin Glow', icon: <Sparkles className="w-6 h-6" />, desc: 'Deep Facial & Skincare', count: 5, span: 'md:col-span-2 md:row-span-1' },
    { name: 'Bridal Elite', icon: <Gem className="w-6 h-6" />, desc: 'Luxury Wedding Packages', count: 4, span: 'md:col-span-2 md:row-span-2' },
    { name: 'Nail Studio', icon: <Award className="w-6 h-6" />, desc: 'Sculpted Gel & Fine Art', count: 6, span: 'md:col-span-1 md:row-span-1' },
    { name: 'Body Zen', icon: <HeartPulse className="w-6 h-6" />, desc: 'Relax & Rejuvenate', count: 3, span: 'md:col-span-2 md:row-span-1' },
];

const brands = ['L\'Oreal', 'Dyson', 'Olaplex', 'MAC', 'Chanel', 'Dior', 'Kerastase', 'Schwarzkopf'];

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
            <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--gold)]/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-[var(--gold)] animate-ping" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Next-Gen Beauty Space</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="font-serif text-6xl md:text-8xl font-bold text-white leading-[0.9] mb-8"
                        >
                            Refining your <br />
                            <span className="text-gradient italic">Signature</span> Look
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg"
                        >
                            Step into a world where artistry meets precision. GlamStudio delivers a curation of high-end beauty rituals designed to elevate your everyday presence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-5"
                        >
                            <Link to="/services" className="group relative px-8 py-4 bg-[var(--gold)] text-black font-bold rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center gap-2">
                                    Reserve Experience <ArrowRight className="w-5 h-5" />
                                </span>
                            </Link>
                            <Link to="/gallery" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
                                View Masterpieces
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-8 mt-16 pb-2"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-primary)] bg-gray-800 overflow-hidden shadow-xl">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="h-10 w-[1px] bg-white/10" />
                            <div>
                                <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" />)}
                                </div>
                                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Loved by 2k+ Clients</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Visual Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] bg-gray-900 group">
                            <img
                                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format"
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                alt="Studio Experience"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl">
                                <p className="text-white font-serif italic text-lg mb-2">"True beauty is an inside job, but a great haircut helps."</p>
                                <span className="text-[10px] font-bold uppercase text-[var(--gold)] tracking-widest">— Creative Director</span>
                            </div>
                        </div>
                        {/* Decorative background shape */}
                        <div className="absolute -inset-10 bg-gradient-to-br from-[var(--gold)]/20 to-purple-500/20 rounded-[4rem] blur-2xl -z-10 animate-pulse" />
                    </motion.div>
                </div>
            </section>

            {/* Marquee Brands */}
            <section className="relative h-20 bg-black border-y border-white/5 overflow-hidden flex items-center">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...brands, ...brands].map((brand, i) => (
                        <div key={i} className="flex items-center mx-12">
                            <span className="text-lg font-serif font-bold text-white/20 uppercase tracking-[0.4em] hover:text-[var(--gold)] transition-colors cursor-default">
                                {brand}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/30 ml-12" />
                        </div>
                    ))}
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

            {/* Bento Categories */}
            <section className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-xl">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-[0.3em] mb-4 block"
                        >
                            Specialized Domains
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-4xl md:text-5xl font-bold text-white"
                        >
                            Curated <span className="text-gradient">Craftsmanship</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-xs text-sm"
                    >
                        Explore our categorized expertise, each led by master industry veterans.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 auto-rows-[240px]">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`${cat.span}`}
                        >
                            <Link
                                to={`/services?category=${cat.name.split(' ')[0]}`}
                                className="group relative h-full bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden p-8 flex flex-col justify-between hover:border-[var(--gold)]/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(212,175,55,0.05)]"
                            >
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--gold)] mb-6 group-hover:scale-110 transition-transform duration-500">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{cat.name}</h3>
                                    <p className="text-gray-500 text-sm max-w-[180px] leading-relaxed">{cat.desc}</p>
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)] opacity-50 group-hover:opacity-100 transition-opacity">
                                        {cat.count} Variants
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[var(--gold)] group-hover:text-black transition-all duration-500">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--gold)]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Services */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-[0.3em] mb-4 block"
                            >
                                Trending Rituals
                            </motion.span>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
                                Loved by <br /><span className="text-gradient">Our Community</span>
                            </h2>
                        </div>
                        <Link to="/services" className="group flex items-center gap-3 text-sm font-bold text-white/50 hover:text-[var(--gold)] transition-colors">
                            Explore Full Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.map((svc, i) => (
                            <motion.div
                                key={svc.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-[var(--gold)]/30 transition-all duration-500 overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] mb-6 group-hover:scale-110 transition-transform">
                                        <Scissors className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 block">{svc.category}</span>
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{svc.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-8 leading-relaxed">{svc.description}</p>

                                    <div className="flex items-end justify-between border-t border-white/5 pt-6">
                                        <div>
                                            <div className="text-[var(--gold)] font-bold text-lg">
                                                {formatPrice(svc.discountPrice || svc.price)}
                                            </div>
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">
                                                {svc.duration} Minutes
                                            </div>
                                        </div>
                                        <Link to="/book" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--gold)] hover:text-black transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--gold)]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="relative py-32 bg-black/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-[0.3em] mb-4 block"
                        >
                            The Visionaries
                        </motion.span>
                        <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
                            Master <span className="text-gradient italic">Artisans</span>
                        </h2>
                        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                            Each of our specialists brings years of global experience and a unique perspective to their craft.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mockStaff.map((staff, i) => (
                            <motion.div
                                key={staff.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center hover:bg-white/[0.07] transition-all duration-500"
                            >
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 rounded-full bg-[var(--gold)]/10 p-1 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--gold)] to-[#D9C17E] flex items-center justify-center text-black text-2xl font-bold shadow-2xl">
                                            {staff.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-[var(--gold)] shadow-xl">
                                        <Award className="w-5 h-5" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-serif font-bold text-white mb-2">{staff.name}</h3>
                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                    {staff.specializations.map(s => (
                                        <span key={s} className="text-[10px] font-bold uppercase tracking-widest text-white/40 border border-white/5 px-3 py-1 rounded-full group-hover:text-[var(--gold)] group-hover:border-[var(--gold)]/30 transition-colors">
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                <div className="w-full h-[1px] bg-white/5 mb-6" />

                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-white">{staff.rating}</div>
                                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Rating</div>
                                    </div>
                                    <div className="w-[1px] h-8 bg-white/5" />
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-white">{staff.totalAppointments}+</div>
                                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Bookings</div>
                                    </div>
                                </div>

                                {staff.isOnLeave && (
                                    <div className="mt-8 flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-2xl">
                                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Mobile Sabbatical</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="relative py-32 overflow-hidden bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
                        <div className="max-w-xl text-center md:text-left">
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-[0.3em] mb-4 block"
                            >
                                Client Testimonials
                            </motion.span>
                            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Voices of <br /><span className="text-gradient italic">Transformation</span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-3 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 text-[var(--gold)] fill-[var(--gold)]" />)}
                            </div>
                            <div className="text-2xl font-serif font-bold text-white">4.9 / 5.0</div>
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Verified Global Reviews</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {mockReviews.map((review, i) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="relative bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col gap-8 hover:bg-white/[0.08] transition-all duration-500"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--gold)]/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                            <span className="text-xl font-bold text-[var(--gold)]">
                                                {review.customerName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-white mb-1">{review.customerName}</div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, j) => (
                                                    <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-white/10'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                        <ShieldCheck className="w-3.5 h-3.5 text-green-500/50" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">Verified Beauty Ritual</span>
                                    </div>
                                </div>
                                <blockquote className="text-xl font-serif italic text-gray-300 leading-relaxed pl-4 border-l-2 border-[var(--gold)]/30">
                                    "{review.comment}"
                                </blockquote>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto relative rounded-[4rem] overflow-hidden bg-black border border-white/10 p-16 md:p-24 text-center group"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/5 blur-[120px] rounded-full" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700">
                            <Gem className="w-10 h-10 text-[var(--gold)]" />
                        </div>
                        <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                            Elevate your <br /><span className="text-gradient">Daily Presence</span>
                        </h2>
                        <p className="text-gray-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                            Luxury is an experience, not a price point. Join the elite community of GlamStudio and redefine your aesthetic standards.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/services" className="px-12 py-5 bg-[var(--gold)] text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:scale-105 transition-all duration-300">
                                Reserve My Spot
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/register" className="px-12 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
                                    Create Profile
                                </Link>
                            )}
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
