import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Send, Clock3, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLeaveStore } from '../../store/useLeaveStore';
import { formatDate } from '../../utils/helpers';
import type { LeaveStatus } from '../../types';
import toast from 'react-hot-toast';

export default function StaffLeavePage() {
    const { user } = useAuthStore();
    const { leaves, addRequest } = useLeaveStore();

    // Form state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const myLeaves = leaves.filter(l => l.staffId === user?.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newRequest = {
            id: `lv-${Date.now()}`,
            staffId: user?.id || '',
            staffName: user?.name || '',
            startDate,
            endDate,
            reason,
            status: 'Pending' as LeaveStatus,
            appliedAt: new Date().toISOString()
        };

        addRequest(newRequest);
        setIsSubmitting(false);
        setStartDate('');
        setEndDate('');
        setReason('');
        toast.success('Leave request submitted successfully!');
    };

    const getStatusIcon = (status: LeaveStatus) => {
        switch (status) {
            case 'Pending': return <Clock3 className="w-4 h-4 text-amber-400" />;
            case 'Approved': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case 'Rejected': return <XCircle className="w-4 h-4 text-red-400" />;
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="font-serif text-2xl font-bold text-white">Leave Management</h1>
                <p className="text-gray-500 text-sm mt-1">Request time off and track your approval status</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Form */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-6">
                        <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
                            <Send className="w-4 h-4 text-[var(--gold)]" /> New Request
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="input-field pl-10 w-full"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="input-field pl-10 w-full"
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="Explain why you need leave..."
                                    className="input-field w-full min-h-[100px] py-3 resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-gradient flex items-center justify-center gap-2 py-3"
                            >
                                {isSubmitting ? 'Submitting...' : (
                                    <>Submit Request <Send className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Status List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[var(--gold)]" /> My Requests
                    </h2>

                    {myLeaves.length === 0 ? (
                        <div className="card p-12 text-center text-gray-500 border-dashed">
                            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No leave requests found</p>
                        </div>
                    ) : (
                        myLeaves.map((l, i) => (
                            <motion.div
                                key={l.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card p-5 hover:border-[var(--gold)]/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                                            <Calendar className="w-5 h-5 text-[var(--gold)]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">
                                                {formatDate(l.startDate)} - {formatDate(l.endDate)}
                                            </div>
                                            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                Applied on {formatDate(l.appliedAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${l.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            l.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                        {getStatusIcon(l.status)} {l.status}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed pl-[52px]">
                                    "{l.reason}"
                                </p>
                                {l.adminComment && (
                                    <div className="mt-4 ml-[52px] p-3 rounded-lg bg-white/5 border-l-2 border-[var(--gold)]/30">
                                        <div className="text-[10px] font-bold text-[var(--gold)] uppercase mb-1">Admin Feedback</div>
                                        <p className="text-xs text-gray-500 italic">
                                            {l.adminComment}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
