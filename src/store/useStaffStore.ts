import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Staff } from '../types';
import { mockStaff } from '../utils/mockData';

interface StaffState {
    staff: Staff[];
    addStaff: (member: Staff) => void;
    updateStaff: (id: string, member: Partial<Staff>) => void;
    deleteStaff: (id: string) => void;
    getStaffById: (id: string) => Staff | undefined;
}

export const useStaffStore = create<StaffState>()(
    persist(
        (set, get) => ({
            staff: [...mockStaff],

            addStaff: (member) => {
                set(state => ({ staff: [member, ...state.staff] }));
            },

            updateStaff: (id, member) => {
                set(state => ({
                    staff: state.staff.map(s => s.id === id ? { ...s, ...member } as Staff : s),
                }));
            },

            deleteStaff: (id) => {
                set(state => ({
                    staff: state.staff.filter(s => s.id !== id),
                }));
            },

            getStaffById: (id) => {
                return get().staff.find(s => s.id === id);
            },
        }),
        {
            name: 'saloon-staff',
        }
    )
);
