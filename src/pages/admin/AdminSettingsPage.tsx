import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    useAuthStore();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [autoConfirm, setAutoConfirm] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleSaveNotifications = () => {
        toast.success('Notification settings saved!');
    };

    const handleChangePassword = () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            toast.error('Please fill all fields'); return;
        }
        if (passwords.new !== passwords.confirm) {
            toast.error('Passwords do not match'); return;
        }
        toast.success('Password updated (demo mode)');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const toggles = [
        { label: 'Email Notifications', desc: 'Booking confirmations, reminders', value: emailNotifications, set: setEmailNotifications },
        { label: 'SMS Notifications', desc: 'Text alerts for appointments', value: smsNotifications, set: setSmsNotifications },
        { label: 'Auto-Confirm Bookings', desc: 'Skip manual confirmation step', value: autoConfirm, set: setAutoConfirm },
    ];

    return (
        <div className="p-6 max-w-2xl">
            <div className="mb-8">
                <h1 className="font-serif text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage salon and account preferences</p>
            </div>

            {/* Salon Info */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-5">
                <h2 className="font-semibold text-white mb-4">Salon Information</h2>
                <div className="space-y-3">
                    <div>
                        <label className="label">Salon Name</label>
                        <input defaultValue="GlamStudio" className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Phone</label>
                            <input defaultValue="+94 11 234 5678" className="input-field" />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input defaultValue="hello@glamstudio.lk" type="email" className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label className="label">Address</label>
                        <textarea defaultValue="No. 45, Galle Road, Colombo 03" className="input-field resize-none" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Opens At</label>
                            <input type="time" defaultValue="09:00" className="input-field" />
                        </div>
                        <div>
                            <label className="label">Closes At</label>
                            <input type="time" defaultValue="19:00" className="input-field" />
                        </div>
                    </div>
                    <button onClick={() => toast.success('Settings saved!')} className="btn-gold text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 mb-5">
                <h2 className="font-semibold text-white mb-4">Notifications</h2>
                <div className="space-y-4">
                    {toggles.map(t => (
                        <div key={t.label} className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-white">{t.label}</div>
                                <div className="text-xs text-gray-500">{t.desc}</div>
                            </div>
                            <div
                                onClick={() => t.set(!t.value)}
                                className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors ${t.value ? 'bg-[#D4AF37]' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${t.value ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                        </div>
                    ))}
                    <button onClick={handleSaveNotifications} className="btn-outline-gold text-sm">Save Preferences</button>
                </div>
            </motion.div>

            {/* Change Password */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#D4AF37]" /> Change Password
                </h2>
                <div className="space-y-3">
                    {[
                        { label: 'Current Password', key: 'current' },
                        { label: 'New Password', key: 'new' },
                        { label: 'Confirm New Password', key: 'confirm' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="label">{f.label}</label>
                            <input
                                type="password"
                                value={passwords[f.key as keyof typeof passwords]}
                                onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>
                    ))}
                    <button onClick={handleChangePassword} className="btn-gold text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Update Password
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
