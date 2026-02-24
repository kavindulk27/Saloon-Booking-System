import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Scissors, AlertCircle, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { mockStaff } from '../../utils/mockData';
import toast from 'react-hot-toast';

export default function StaffLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome to the Staff Portal! 🎉');
            navigate('/staff');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] bg-grid flex items-center justify-center p-4">
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
                    <h1 className="font-serif text-3xl font-bold text-white">Staff Portal</h1>
                    <p className="text-gray-400 mt-1 text-sm">Sign in to access your schedule</p>
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
                            <label className="label">Select Staff Member</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <select
                                    onChange={(e) => {
                                        const staff = mockStaff.find(s => s.id === e.target.value);
                                        if (staff) {
                                            setEmail(staff.email);
                                            setPassword('demo123'); // Set default demo password
                                        }
                                    }}
                                    className="input-field pl-10 appearance-none bg-[#1A1A1A] cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Choose a staff member...</option>
                                    {mockStaff.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="label">Staff Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Select a member above or enter email"
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-gold w-full flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : 'Sign In to Portal'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-xs">Staff Access Only</p>
                    </div>

                    <div className="mt-5 pt-5 border-t border-white/10">
                        <p className="text-xs text-center text-gray-500 italic">
                            Select your profile from the list to quickly sign in to your dashboard.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
