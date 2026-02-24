import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Scissors, LayoutDashboard, Calendar, Users, Briefcase,
    BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
    Tag, Star, Bell, Coffee
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { getInitials } from '../utils/helpers';

interface NavItem {
    label: string;
    to: string;
    icon: React.ReactNode;
}

const adminNav: NavItem[] = [
    { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Appointments', to: '/admin/appointments', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Services', to: '/admin/services', icon: <Scissors className="w-5 h-5" /> },
    { label: 'Staff', to: '/admin/staff', icon: <Users className="w-5 h-5" /> },
    { label: 'Customers', to: '/admin/customers', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Analytics', to: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Reviews', to: '/admin/reviews', icon: <Star className="w-5 h-5" /> },
    { label: 'Leave management', to: '/admin/leave', icon: <Coffee className="w-5 h-5" /> },
    { label: 'Settings', to: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

const staffNav: NavItem[] = [
    { label: 'My Schedule', to: '/staff', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Appointments', to: '/staff/appointments', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Notifications', to: '/staff/notifications', icon: <Bell className="w-5 h-5" /> },
    { label: 'Leave management', to: '/staff/leave', icon: <Coffee className="w-5 h-5" /> },
];

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const navigate = useNavigate();

    const navItems = user?.role === 'admin' ? adminNav : staffNav;

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    return (
        <motion.aside
            animate={{ width: sidebarOpen ? 256 : 72 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] z-40 flex flex-col overflow-hidden"
        >
            {/* Top */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)] min-w-0">
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2.5"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[var(--gold)] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] flex-shrink-0">
                                <Scissors className="w-4 h-4 text-black" />
                            </div>
                            <span className="font-serif font-bold text-lg text-[var(--text-primary)] whitespace-nowrap">
                                Glam<span className="text-gradient">Studio</span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {!sidebarOpen && (
                    <div className="w-8 h-8 rounded-lg bg-[var(--gold)] flex items-center justify-center mx-auto">
                        <Scissors className="w-4 h-4 text-black" />
                    </div>
                )}
                {sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="w-7 h-7 rounded-lg hover:bg-[var(--bg-glass)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] flex-shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
            </div>

            {!sidebarOpen && (
                <div className="flex justify-center py-2 border-b border-[var(--border-glass)]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-8 h-8 rounded-lg hover:bg-[var(--bg-glass)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Role badge */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-4 pt-4 pb-2"
                    >
                        <span className="text-xs font-semibold text-[var(--gold)] uppercase tracking-widest">
                            {user?.role} Panel
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav */}
            <nav className="flex-1 px-2 py-2 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin' || item.to === '/staff'}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-2' : ''}`
                        }
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>
                ))}
            </nav>

            {/* User */}
            <div className="border-t border-[var(--border)] p-3">
                <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
                    <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                        {getInitials(user?.name || 'U')}
                    </div>
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
                                <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {sidebarOpen && (
                        <button
                            onClick={handleLogout}
                            className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 flex-shrink-0"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}
