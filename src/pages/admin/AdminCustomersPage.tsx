import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, Calendar, Star, TrendingUp } from 'lucide-react';
import { mockUsers } from '../../utils/mockData';
import { formatDate } from '../../utils/helpers';

export default function AdminCustomersPage() {
    const [search, setSearch] = useState('');

    const customers = mockUsers.filter(u => u.role === 'customer');
    const filtered = customers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalLoyalty = customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0);

    return (
        <div className="p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Customer Management</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">{customers.length} registered customers</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[var(--text-primary)]">{customers.length}</div>
                            <div className="text-xs text-[var(--text-muted)]">Total Customers</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                            <Star className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[var(--text-primary)]">{totalLoyalty.toLocaleString()}</div>
                            <div className="text-xs text-[var(--text-muted)]">Avg. Loyalty Points: {Math.round(totalLoyalty / customers.length)}</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[var(--text-primary)]">12%</div>
                            <div className="text-xs text-[var(--text-muted)]">Growth this month</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="input-field pl-10"
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead>
                            <tr className="table-header">
                                <th className="text-left px-5 py-3">Customer</th>
                                <th className="text-left px-5 py-3">Contact Info</th>
                                <th className="text-left px-5 py-3">Join Date</th>
                                <th className="text-left px-5 py-3 text-center">Loyalty Points</th>
                                <th className="text-right px-5 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-[var(--text-muted)]">No customers found</td>
                                </tr>
                            ) : filtered.map((c, i) => (
                                <motion.tr
                                    key={c.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="table-row"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-black font-bold">
                                                {c.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-[var(--text-primary)]">{c.name}</div>
                                                <div className="text-xs text-[var(--text-muted)]">ID: {c.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                            <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {c.email}
                                        </div>
                                        {c.phone && (
                                            <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs mt-0.5">
                                                <Phone className="w-3.5 h-3.5" /> {c.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-[var(--text-secondary)]">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {formatDate(c.joinDate)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] font-medium text-xs">
                                            <Star className="w-3 h-3" /> {c.loyaltyPoints}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button className="text-[var(--gold)] hover:text-[#000] transition-colors text-xs font-medium">
                                            View Profile
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
