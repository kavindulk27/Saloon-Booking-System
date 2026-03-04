import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Scissors, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Simple registration simulation since useAuthStore likely has a mock register function
        const result = await register(name, email, password, phone);
        if (result.success) {
            toast.success('Account created! Welcome to GlamStudio 💄');
            navigate('/');
        } else {
            setError(result.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-4">
                        <Scissors className="w-7 h-7 text-black" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold text-[var(--text-primary)]">Join GlamStudio</h1>
                    <p className="text-[var(--text-muted)] mt-1 text-sm">Create an account to book your next transformation</p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-glass p-6 rounded-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                        <div>
                            <label className="label text-[var(--text-secondary)]">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="input-field pl-10"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label text-[var(--text-secondary)]">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="input-field pl-10"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label text-[var(--text-secondary)]">Phone Number</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+94 77 123 4567"
                                    className="input-field pl-10"
                                    required
                                    autoComplete="off"
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
                                    placeholder="Minimum 8 characters"
                                    className="input-field pl-10 pr-10"
                                    required
                                    minLength={8}
                                    autoComplete="off"
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-gold w-full flex items-center justify-center gap-2 py-3"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[var(--text-muted)] text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[var(--gold)] hover:text-[var(--gold)]/80 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
