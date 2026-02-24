import { create } from 'zustand';
import type { Appointment, AppointmentStatus } from '../types';
import { mockAppointments } from '../utils/mockData';

interface AppointmentState {
    appointments: Appointment[];
    addAppointment: (apt: Appointment) => void;
    updateStatus: (id: string, status: AppointmentStatus) => void;
    cancelAppointment: (id: string) => void;
    getByCustomer: (customerId: string) => Appointment[];
    getByStaff: (staffId: string) => Appointment[];
    getByDate: (date: string) => Appointment[];
    isSlotTaken: (staffId: string, date: string, timeSlot: string, excludeId?: string) => boolean;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
    appointments: [...mockAppointments],

    addAppointment: (apt) => {
        set(state => ({ appointments: [apt, ...state.appointments] }));
    },

    updateStatus: (id, status) => {
        set(state => ({
            appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a),
        }));
    },

    cancelAppointment: (id) => {
        set(state => ({
            appointments: state.appointments.map(a =>
                a.id === id ? { ...a, status: 'Cancelled', paymentStatus: 'Refunded' } : a
            ),
        }));
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
