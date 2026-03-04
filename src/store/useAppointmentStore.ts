import { create } from 'zustand';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Appointment, AppointmentStatus, PaymentStatus } from '../types';

interface AppointmentState {
    appointments: Appointment[];
    addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Promise<void>;
    updateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
    updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
    cancelAppointment: (id: string) => Promise<void>;
    getByCustomer: (customerId: string) => Appointment[];
    getByStaff: (staffId: string) => Appointment[];
    getByDate: (date: string) => Appointment[];
    isSlotTaken: (staffId: string, date: string, timeSlot: string, excludeId?: string) => boolean;
    init: () => void;
}

export const useAppointmentStore = create<AppointmentState>()((set, get) => ({
    appointments: [],

    init: () => {
        const q = query(collection(db, 'appointments'), orderBy('date', 'desc'));
        onSnapshot(q, (snapshot) => {
            const appointments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Appointment));
            set({ appointments });
        });
    },

    addAppointment: async (apt) => {
        await addDoc(collection(db, 'appointments'), {
            ...apt,
            createdAt: new Date().toISOString(), // Fallback or use serverTimestamp
        });
    },

    updateStatus: async (id, status) => {
        await updateDoc(doc(db, 'appointments', id), { status });
    },

    updatePaymentStatus: async (id, paymentStatus) => {
        await updateDoc(doc(db, 'appointments', id), { paymentStatus });
    },

    cancelAppointment: async (id) => {
        await updateDoc(doc(db, 'appointments', id), {
            status: 'Cancelled',
            paymentStatus: 'Refunded'
        });
    },

    getByCustomer: (customerId) => {
        return get().appointments.filter(a => a.customerId === customerId);
    },

    getByStaff: (staffId) => {
        return get().appointments.filter(a => a.staffId === staffId);
    },

    getByDate: (date) => {
        return get().appointments.filter(a => a.date === date);
    },

    isSlotTaken: (staffId, date, timeSlot, excludeId) => {
        return get().appointments.some(a =>
            a.staffId === staffId &&
            a.date === date &&
            a.timeSlot === timeSlot &&
            a.status !== 'Cancelled' &&
            a.id !== excludeId
        );
    },
}));

// Auto-initialize
useAppointmentStore.getState().init();
