import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, Star } from 'lucide-react';
import { useStaffStore } from '../../store/useStaffStore';
import type { Staff, ServiceCategory, DayOfWeek } from '../../types';
import toast from 'react-hot-toast';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CATEGORIES: ServiceCategory[] = ['Hair', 'Facial', 'Bridal', 'Nails', 'Massage', 'Makeup'];

export default function AdminStaffPage() {
    const { staff, addStaff, updateStaff, deleteStaff } = useStaffStore();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Staff | null>(null);
    const [form, setForm] = useState<Partial<Staff>>({});

    const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    const openAdd = () => {
        setEditing(null);
        setForm({
            name: '', email: '', phone: '',
            specializations: [],
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            workingHours: { start: '09:00', end: '18:00' },
            commissionPercentage: 15,
            isOnLeave: false,
            rating: 5,
            totalAppointments: 0,
        });
        setShowModal(true);
    };

    const openEdit = (s: Staff) => {
        setEditing(s);
        setForm({ ...s });
        setShowModal(true);
    };

    const toggleSpec = (cat: ServiceCategory) => {
        const specs = form.specializations || [];
        setForm(f => ({
            ...f,
            specializations: specs.includes(cat) ? specs.filter(s => s !== cat) : [...specs, cat],
        }));
    };

    const toggleDay = (day: DayOfWeek) => {
        const days = form.workingDays || [];
        setForm(f => ({
            ...f,
            workingDays: days.includes(day) ? days.filter(d => d !== day) : [...days, day],
        }));
    };

    const handleSave = () => {
        if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
        if (editing) {
            updateStaff(editing.id, form);
            toast.success('Staff updated');
        } else {
            addStaff({ id: `s${Date.now()}`, ...form } as Staff);
            toast.success('Staff added');
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        deleteStaff(id);
        toast.success('Staff removed');
    };

    return (
        <div className="p-6 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Staff Management</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-0.5">{staff.length} staff members</p>
                </div>
                <button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Staff
                </button>
            </div>

            <div className="relative w-full sm:max-w-sm mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="input-field pl-10 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="card p-5"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-sm font-bold">
                                    {s.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="font-semibold text-[var(--text-primary)]">{s.name}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{s.email}</div>
                                </div>
                            </div>
                            <div className={`w-2.5 h-2.5 rounded-full mt-1 ${s.isOnLeave ? 'bg-[var(--status-cancelled)]' : 'bg-[var(--status-completed)]'}`} />
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {s.specializations.map(spec => (
                                <span key={spec} className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-0.5 rounded-full">{spec}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-muted)] mb-4">
                            <div>
                                <div className="text-[var(--text-muted)] opacity-60 mb-0.5">Hours</div>
                                <div className="text-[var(--text-secondary)]">{s.workingHours.start} - {s.workingHours.end}</div>
                            </div>
                            <div>
                                <div className="text-[var(--text-muted)] opacity-60 mb-0.5">Commission</div>
                                <div className="text-[var(--text-secondary)]">{s.commissionPercentage}%</div>
                            </div>
                            <div>
                                <div className="text-[var(--text-muted)] opacity-60 mb-0.5">Rating</div>
                                <div className="flex items-center gap-1 text-[var(--text-secondary)]"><Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />{s.rating}</div>
                            </div>
                            <div>
                                <div className="text-[var(--text-muted)] opacity-60 mb-0.5">Total Jobs</div>
                                <div className="text-[var(--text-secondary)]">{s.totalAppointments}</div>
                            </div>
                        </div>

                        {s.isOnLeave && (
                            <div className="text-xs text-[var(--status-cancelled)] bg-[var(--status-cancelled-bg)] border border-[var(--status-cancelled)]/20 rounded-lg px-3 py-2 mb-3">
                                On Leave until {s.leaveUntil}
                            </div>
                        )}

                        <div className="flex gap-2 border-t border-[var(--border)] pt-3">
                            <button onClick={() => openEdit(s)} className="btn-ghost flex-1 text-xs flex items-center justify-center gap-1.5">
                                <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => handleDelete(s.id)} className="text-xs flex-1 px-3 py-2 rounded-lg text-[var(--status-cancelled)] hover:bg-[var(--status-cancelled-bg)] flex items-center justify-center gap-1.5 transition-all">
                                <Trash2 className="w-3 h-3" /> Remove
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={e => e.target === e.currentTarget && setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-semibold text-[var(--text-primary)]">{editing ? 'Edit Staff' : 'Add Staff'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">Full Name *</label>
                                        <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="label">Phone</label>
                                        <input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Email *</label>
                                    <input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" />
                                </div>

                                <div>
                                    <label className="label">Specializations</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => toggleSpec(cat)}
                                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${(form.specializations || []).includes(cat) ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Working Days</label>
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS.map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${(form.workingDays || []).includes(day) ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/10 text-gray-400 hover:text-white'}`}
                                            >
                                                {day.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="label">Start</label>
                                        <input type="time" value={form.workingHours?.start || '09:00'} onChange={e => setForm(f => ({ ...f, workingHours: { ...f.workingHours!, start: e.target.value } }))} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="label">End</label>
                                        <input type="time" value={form.workingHours?.end || '18:00'} onChange={e => setForm(f => ({ ...f, workingHours: { ...f.workingHours!, end: e.target.value } }))} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="label">Commission %</label>
                                        <input type="number" value={form.commissionPercentage || 15} onChange={e => setForm(f => ({ ...f, commissionPercentage: +e.target.value }))} className="input-field" min={0} max={50} />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setForm(f => ({ ...f, isOnLeave: !f.isOnLeave }))}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${form.isOnLeave ? 'bg-red-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isOnLeave ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </div>
                                    <span className="text-sm text-[var(--text-secondary)]">On Leave</span>
                                </label>
                                {form.isOnLeave && (
                                    <div>
                                        <label className="label">Leave Until</label>
                                        <input type="date" value={form.leaveUntil || ''} onChange={e => setForm(f => ({ ...f, leaveUntil: e.target.value }))} className="input-field" />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                                <button onClick={handleSave} className="btn-gold flex-1 flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" /> Save
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
