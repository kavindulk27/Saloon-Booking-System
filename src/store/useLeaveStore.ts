import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LeaveRequest, LeaveStatus } from '../types';
import { mockLeaveRequests } from '../utils/mockData';

interface LeaveState {
    leaves: LeaveRequest[];
    addRequest: (request: LeaveRequest) => void;
    updateStatus: (id: string, status: LeaveStatus, adminComment?: string) => void;
    getRequestsByStaff: (staffId: string) => LeaveRequest[];
}

export const useLeaveStore = create<LeaveState>()(
    persist(
        (set, get) => ({
            leaves: [...mockLeaveRequests],

            addRequest: (request) => {
                set(state => ({ leaves: [request, ...state.leaves] }));
            },

            updateStatus: (id, status, adminComment) => {
                set(state => ({
                    leaves: state.leaves.map(l =>
                        l.id === id
                            ? { ...l, status, adminComment, approvedAt: status === 'Approved' ? new Date().toISOString() : undefined }
                            : l
                    ),
                }));
            },

            getRequestsByStaff: (staffId) => {
                return get().leaves.filter(l => l.staffId === staffId);
            },
        }),
        {
            name: 'saloon-leaves',
        }
    )
);
