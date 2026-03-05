import { create } from 'zustand';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    setDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Appointment, AppointmentStatus, PaymentStatus } from '../types';

interface AppointmentState {
    appointments: Appointment[];
    addAppointment: (apt: Appointment) => Promise<void>;
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
        try {
            await setDoc(doc(db, 'appointments', apt.id), {
                ...apt,
                createdAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error adding appointment:", error);
            throw error;
        }
    },

    updateStatus: async (id, status) => {
        try {
            await updateDoc(doc(db, 'appointments', id), { status });
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    },

    updatePaymentStatus: async (id, paymentStatus) => {
        try {
            await updateDoc(doc(db, 'appointments', id), { paymentStatus });
        } catch (error) {
            console.error("Error updating payment status:", error);
            throw error;
        }
    },

    cancelAppointment: async (id) => {
        try {
            await updateDoc(doc(db, 'appointments', id), {
                status: 'Cancelled',
                paymentStatus: 'Refunded'
            });
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            throw error;
        }
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
