import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Clock, Tag, Package, Search, X, Check } from 'lucide-react';
import { mockServices } from '../../utils/mockData';
import { formatPrice, formatDuration } from '../../utils/helpers';
import type { Service, ServiceCategory } from '../../types';
import toast from 'react-hot-toast';

const CATEGORIES: ServiceCategory[] = ['Hair', 'Facial', 'Bridal', 'Nails', 'Massage', 'Makeup'];

const emptyForm: Omit<Service, 'id'> = {
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: 'Hair',
    isActive: true,
    isPackage: false,
};

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([...mockServices]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [form, setForm] = useState<Omit<Service, 'id'>>(emptyForm);

    const filtered = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => {
        setEditingService(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (svc: Service) => {
        setEditingService(svc);
        const { id, ...rest } = svc;
        setForm(rest);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.name || !form.price) { toast.error('Please fill all required fields'); return; }
        if (editingService) {
            setServices(prev => prev.map(s => s.id === editingService.id ? { ...editingService, ...form } : s));
            toast.success('Service updated');
        } else {
            setServices(prev => [{ id: `svc${Date.now()}`, ...form }, ...prev]);
            toast.success('Service added');
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
        toast.success('Service deleted');
    };

    const toggleActive = (id: string) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    };

    return (
        <div className="p-6 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-white">Services</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{services.length} services</p>
                </div>
                <button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..." className="input-field pl-10" />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="table-header">
                            <th className="text-left px-5 py-3">Service</th>
                            <th className="text-left px-5 py-3 hidden md:table-cell">Category</th>
                            <th className="text-left px-5 py-3 hidden lg:table-cell">Duration</th>
                            <th className="text-left px-5 py-3">Price</th>
                            <th className="text-left px-5 py-3 hidden md:table-cell">Status</th>
                            <th className="text-right px-5 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(svc => (
                            <tr key={svc.id} className="table-row">
                                <td className="px-5 py-4">
                                    <div className="font-medium text-white">{svc.name}</div>
                                    <div className="text-xs text-gray-500 line-clamp-1">{svc.description}</div>
                                    {svc.isPackage && (
                                        <span className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                                            <Package className="w-3 h-3" /> Package
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 hidden md:table-cell">
                                    <span className="badge bg-[#D4AF37]/10 text-[#D4AF37]">{svc.category}</span>
                                </td>
                                <td className="px-5 py-4 hidden lg:table-cell">
                                    <span className="flex items-center gap-1 text-gray-400"><Clock className="w-3 h-3" />{formatDuration(svc.duration)}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="font-semibold text-gradient">{formatPrice(svc.discountPrice || svc.price)}</div>
                                    {svc.discountPrice && <div className="text-xs text-gray-500 line-through">{formatPrice(svc.price)}</div>}
                                </td>
                                <td className="px-5 py-4 hidden md:table-cell">
                                    <button onClick={() => toggleActive(svc.id)} className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${svc.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {svc.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => openEdit(svc)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(svc.id)} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-400">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                            className="bg-[#1E1E1E] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-semibold text-white">{editingService ? 'Edit Service' : 'Add Service'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Service Name *</label>
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="e.g. Classic Hair Cut" />
                                </div>
                                <div>
                                    <label className="label">Description</label>
                                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none" rows={2} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">Category</label>
                                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ServiceCategory }))} className="input-field">
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Duration (min)</label>
                                        <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} className="input-field" min={15} step={15} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">Price (Rs.) *</label>
                                        <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="label">Discount Price (Rs.)</label>
                                        <input type="number" value={form.discountPrice || ''} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value ? +e.target.value : undefined }))} className="input-field" placeholder="Optional" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div
                                            onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                            className={`w-10 h-5 rounded-full transition-colors relative ${form.isActive ? 'bg-[#D4AF37]' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </div>
                                        <span className="text-sm text-gray-300">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div
                                            onClick={() => setForm(f => ({ ...f, isPackage: !f.isPackage }))}
                                            className={`w-10 h-5 rounded-full transition-colors relative ${form.isPackage ? 'bg-purple-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPackage ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </div>
                                        <span className="text-sm text-gray-300">Package</span>
                                    </label>
                                </div>
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
