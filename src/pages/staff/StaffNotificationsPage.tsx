import { motion } from 'framer-motion';
import { Bell, Calendar, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'New Booking Recieved',
        message: 'Kavindu Perera has booked "Classic Hair Cut" for tomorrow at 10:00 AM.',
        time: new Date().toISOString(),
        type: 'booking',
        isRead: false
    },
    {
        id: '2',
        title: 'Appointment Cancelled',
        message: 'The appointment with Dilini Madushika for "Hair Color" has been cancelled.',
        time: new Date(Date.now() - 3600000 * 24).toISOString(),
        type: 'alert',
        isRead: true
    },
    {
        id: '3',
        title: 'Schedule Update',
        message: 'Your working hours for next Friday have been adjusted by the administrator.',
        time: new Date(Date.now() - 3600000 * 48).toISOString(),
        type: 'info',
        isRead: true
    },
    {
        id: '4',
        title: 'Customer Check-in',
        message: 'Your 2:00 PM customer Sithara De Silva has arrived at the saloon.',
        time: new Date(Date.now() - 3600000 * 5).toISOString(),
        type: 'checkin',
        isRead: false
    }
];

const getIcon = (type: string) => {
    switch (type) {
        case 'booking': return <Calendar className="w-5 h-5 text-blue-400" />;
        case 'alert': return <AlertTriangle className="w-5 h-5 text-red-400" />;
        case 'info': return <Info className="w-5 h-5 text-indigo-400" />;
        case 'checkin': return <CheckCircle className="w-5 h-5 text-green-400" />;
        default: return <Bell className="w-5 h-5 text-[var(--gold)]" />;
    }
};

export default function StaffNotificationsPage() {
    return (
        <div className="p-6 max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-white">Notifications</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Stay updated with your latest alerts</p>
                </div>
                <button className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] font-medium">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-3">
                {MOCK_NOTIFICATIONS.map((n, i) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`card p-4 flex gap-4 transition-all hover:border-[var(--gold)]/30 ${!n.isRead ? 'border-l-2 border-l-[var(--gold)]' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-[var(--gold)]/10' : 'bg-white/5'}`}>
                            {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className={`text-sm font-semibold truncate ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>
                                    {n.title}
                                </h3>
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(n.time), 'MMM d, h:mm a')}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                {n.message}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {MOCK_NOTIFICATIONS.length === 0 && (
                <div className="text-center py-20">
                    <Bell className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">You're all caught up!</p>
                </div>
            )}
        </div>
    );
}
