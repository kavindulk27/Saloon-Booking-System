import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, MessageSquare, AlertCircle, Filter } from 'lucide-react';
import { useLeaveStore } from '../../store/useLeaveStore';
import { formatDate } from '../../utils/helpers';
import type { LeaveStatus } from '../../types';
import toast from 'react-hot-toast';

export default function AdminLeavePage() {
    const { leaves, updateStatus } = useLeaveStore();
    const [filterStatus, setFilterStatus] = useState<LeaveStatus | 'All'>('All');
    const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
    const [adminComment, setAdminComment] = useState('');

    const filtered = leaves.filter(l => filterStatus === 'All' || l.status === filterStatus);

    const handleUpdate = (id: string, status: LeaveStatus) => {
        if (!adminComment && status === 'Rejected') {
            toast.error('Please provide a reason for rejection');
            return;
        }
        updateStatus(id, status, adminComment);
        toast.success(`Request ${status.toLowerCase()} successfully`);
        setSelectedRequest(null);
        setAdminComment('');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-white">Leave Requests</h1>
                    <p className="text-gray-500 text-sm mt-1">Review and manage staff time-off requests</p>
                </div>

                <div className="flex gap-2">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filterStatus === s
                                    ? 'bg-[var(--gold)] text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {filtered.length === 0 ? (
                    <div className="card p-20 text-center text-gray-500 border-dashed">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p>No leave requests found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((l, i) => (
                            <motion.div
                                key={l.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`card p-6 border-l-4 transition-all ${l.status === 'Approved' ? 'border-l-green-500' :
                                        l.status === 'Rejected' ? 'border-l-red-500' :
                                            'border-l-amber-500'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] font-bold">
                                                {l.staffName[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{l.staffName}</h3>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Staff Member</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase mb-1">Period</div>
                                                <div className="text-sm text-gray-300 font-medium">
                                                    {formatDate(l.startDate)} - {formatDate(l.endDate)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase mb-1">Applied On</div>
                                                <div className="text-sm text-gray-300">
                                                    {formatDate(l.appliedAt)}
                                                </div>
                                            </div>
                                            <div className="md:col-span-1">
                                                <div className="text-[10px] text-gray-500 uppercase mb-1">Status</div>
                                                <div className={`text-sm font-bold ${l.status === 'Approved' ? 'text-green-400' :
                                                        l.status === 'Rejected' ? 'text-red-400' :
                                                            'text-amber-400'
                                                    }`}>
                                                    {l.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="text-[10px] text-gray-500 uppercase mb-1">Reason</div>
                                            <p className="text-sm text-gray-400 italic">"{l.reason}"</p>
                                        </div>
                                        {l.adminComment && (
                                            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                                                <div className="text-[10px] text-[var(--gold)] font-bold uppercase mb-1">Admin Comment</div>
                                                <p className="text-xs text-gray-500">{l.adminComment}</p>
                                            </div>
                                        )}
                                    </div>

                                    {l.status === 'Pending' && (
                                        <div className="md:w-72 flex flex-col gap-3">
                                            {selectedRequest === l.id ? (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
                                                    <textarea
                                                        value={adminComment}
                                                        onChange={e => setAdminComment(e.target.value)}
                                                        placeholder="Add a comment or reason..."
                                                        className="input-field w-full text-xs h-24 py-2"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdate(l.id, 'Approved')}
                                                            className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 py-2 rounded-xl text-xs font-bold hover:bg-green-500/30 transition-all flex items-center justify-center gap-1.5"
                                                        >
                                                            <Check className="w-3 h-3" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdate(l.id, 'Rejected')}
                                                            className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-xl text-xs font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-1.5"
                                                        >
                                                            <X className="w-3 h-3" /> Reject
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => { setSelectedRequest(null); setAdminComment(''); }}
                                                        className="w-full text-[10px] text-gray-500 hover:text-white transition-colors"
                                                    >
                                                        Cancel action
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedRequest(l.id)}
                                                    className="w-full h-full min-h-[100px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-[var(--gold)]/30 transition-all group"
                                                >
                                                    <MessageSquare className="w-6 h-6 text-gray-600 group-hover:text-[var(--gold)] transition-colors" />
                                                    <span className="text-xs font-medium text-gray-500 group-hover:text-white">Review Request</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
