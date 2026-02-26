import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface CustomConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default function CustomConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: CustomConfirmModalProps) {
    const colors = {
        danger: {
            bg: 'bg-[var(--status-cancelled-bg)]',
            border: 'border-[var(--status-cancelled)]/20',
            text: 'text-[var(--status-cancelled)]',
            button: 'bg-[var(--status-cancelled)] hover:brightness-110',
            icon: <AlertTriangle className="w-6 h-6 text-[var(--status-cancelled)]" />
        },
        warning: {
            bg: 'bg-[var(--status-pending-bg)]',
            border: 'border-[var(--status-pending)]/20',
            text: 'text-[var(--status-pending)]',
            button: 'bg-[var(--status-pending)] hover:brightness-110',
            icon: <AlertTriangle className="w-6 h-6 text-[var(--status-pending)]" />
        },
        info: {
            bg: 'bg-[var(--status-confirmed-bg)]',
            border: 'border-[var(--status-confirmed)]/20',
            text: 'text-[var(--status-confirmed)]',
            button: 'bg-[var(--status-confirmed)] hover:brightness-110',
            icon: <AlertTriangle className="w-6 h-6 text-[var(--status-confirmed)]" />
        }
    };

    const config = colors[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${config.bg} ${config.border} border`}>
                                    {config.icon}
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl bg-[var(--bg-glass)] hover:bg-[var(--bg-glass)] hover:brightness-110 text-[var(--text-muted)] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2">{title}</h2>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-widest hover:bg-[var(--bg-glass)] hover:brightness-110 transition-all"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 py-4 px-6 rounded-2xl ${config.button} text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
