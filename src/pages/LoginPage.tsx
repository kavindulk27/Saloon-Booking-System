import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Scissors, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdminPath = location.pathname.startsWith('/admin');
    const isStaffPath = location.pathname.startsWith('/staff');
    const isManagementPath = isAdminPath || isStaffPath;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome back! 🎉');
            const user = useAuthStore.getState().user;
            if (user?.role === 'admin') navigate('/admin');
            else if (user?.role === 'staff') navigate('/staff');
            else navigate('/');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    const demoLogins = [
        { label: 'Customer Demo', email: 'customer@demo.com', role: 'customer' },
        { label: 'Admin Demo', email: 'admin@demo.com', role: 'admin' },
        { label: 'Staff Demo', email: 'staff@demo.com', role: 'staff' },
    ].filter(d => {
        if (isAdminPath) return d.role === 'admin';
        if (isStaffPath) return d.role === 'staff';
        return d.role === 'customer';
    });

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-4">
                        <Scissors className="w-7 h-7 text-black" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-[var(--text-primary)]">
                        {isAdminPath ? 'GlamStudio Admin' : isStaffPath ? 'Staff Portal' : 'Welcome Back'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1 text-sm">
                        {isAdminPath ? 'Sign in to the Admin Dashboard' : isStaffPath ? 'Sign in to access your schedule' : 'Please enter your details to sign in'}
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-glass p-6 rounded-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label text-[var(--text-secondary)]">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@demo.com"
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label text-[var(--text-secondary)]">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 bg-[var(--status-cancelled-bg)] border border-[var(--status-cancelled)]/30 rounded-xl p-3">
                                <AlertCircle className="w-4 h-4 text-[var(--status-cancelled)] flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-[var(--status-cancelled)]">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-xs text-[var(--gold)] hover:brightness-110">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-gold w-full flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        {!isManagementPath && (
                            <p className="text-[var(--text-muted)] text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-[var(--gold)] hover:text-[var(--gold)]/80 font-medium transition-colors">
                                    Create one now
                                </Link>
                            </p>
                        )}
                        {isManagementPath && (
                            <p className="text-[var(--text-muted)] text-xs">
                                {isAdminPath ? 'Administrative Access Only' : 'Staff Access Only'}
                            </p>
                        )}
                    </div>

                    <div className="mt-5 pt-5 border-t border-[var(--border)]">
                        <p className="text-xs text-[var(--text-muted)] text-center mb-3">
                            {isAdminPath ? 'Admin Quick Access' : isStaffPath ? 'Staff Quick Access' : 'Demo Access'}
                        </p>
                        <div className={`grid ${isAdminPath ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                            {demoLogins.map(d => (
                                <button
                                    key={d.role}
                                    onClick={() => { setEmail(d.email); setPassword('demo123'); }}
                                    className="text-[10px] bg-[var(--bg-glass)] hover:bg-[var(--bg-glass)]/20 border border-[var(--border)] rounded-lg py-2 px-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all capitalize"
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
