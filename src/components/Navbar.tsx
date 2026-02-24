import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scissors, Bell, Sun, Moon, Menu, X, LogOut, User, ChevronDown, Calendar
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { getInitials } from '../utils/helpers';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { darkMode, toggleDarkMode } = useUIStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = isAuthenticated
        ? user?.role === 'customer'
            ? [
                { label: 'Home', to: '/' },
                { label: 'Services', to: '/services' },
                { label: 'Gallery', to: '/gallery' },
                { label: 'Book Now', to: '/book' },
                { label: 'My Bookings', to: '/my-appointments' },
            ]
            : []
        : [
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            { label: 'Gallery', to: '/gallery' },
        ];

    if (user && (user.role === 'admin' || user.role === 'staff')) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--navbar-bg)] backdrop-blur-xl border-b border-[var(--border-glass)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all duration-300">
                        <Scissors className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-serif font-bold text-xl text-white">
                        Glam<span className="text-gradient">Studio</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleDarkMode}
                        className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 transition-all"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-xs font-bold">
                                    {getInitials(user?.name || 'U')}
                                </div>
                                <span className="text-sm text-white hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-48 card border border-white/10 shadow-2xl py-1 z-50"
                                    >
                                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5">
                                            <User className="w-4 h-4" /> My Profile
                                        </Link>
                                        <Link to="/my-appointments" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5">
                                            <Calendar className="w-4 h-4" /> My Bookings
                                        </Link>
                                        <hr className="my-1 border-white/5" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5">
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-gold text-sm px-5 py-2">Join Free</Link>
                    )}

                    {/* Mobile menu */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400"
                    >
                        {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-[#121212]"
                    >
                        <div className="px-4 py-3 flex flex-col gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
