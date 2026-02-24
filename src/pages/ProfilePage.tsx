import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="font-serif text-4xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your account settings and preferences</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-1"
                >
                    <div className="card-glass p-6 rounded-3xl text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F0D060] flex items-center justify-center text-black text-3xl font-bold border-4 border-[#1A1A1A]">
                                {getInitials(user.name)}
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-[#D4AF37] hover:bg-white/5 transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                        <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                            {user.role} Account
                        </span>

                        <div className="mt-8 space-y-4">
                            <button className="btn-outline-gold w-full flex items-center justify-center gap-2 py-2.5 text-sm">
                                <Edit2 className="w-4 h-4" /> Edit Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Log Out
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Account Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 space-y-6"
                >
                    <div className="card-glass p-8 rounded-3xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-[#D4AF37]" /> Personal Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> Email Address
                                </label>
                                <p className="text-white bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> Phone Number
                                </label>
                                <p className="text-white bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">+94 77 123 4567</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" /> Member Since
                                </label>
                                <p className="text-white bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">January 2024</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" /> Preferred Branch
                                </label>
                                <p className="text-white bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">Colombo Main</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-glass p-8 rounded-3xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#D4AF37]" /> Security
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Password</p>
                                <p className="text-xs text-gray-500 mt-1">Last changed 2 months ago</p>
                            </div>
                            <button className="btn-outline-gold px-4 py-2 text-xs">Update Password</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
