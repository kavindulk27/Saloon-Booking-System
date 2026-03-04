import { create } from 'zustand';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Staff } from '../types';

interface StaffState {
    staff: Staff[];
    isLoading: boolean;
    error: string | null;
    addStaff: (member: Staff) => Promise<void>;
    updateStaff: (id: string, member: Partial<Staff>) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
    getStaffById: (id: string) => Staff | undefined;
    init: () => () => void;
}

export const useStaffStore = create<StaffState>()((set, get) => ({
    staff: [],
    isLoading: false,
    error: null,

    init: () => {
        set({ isLoading: true });
        const q = query(collection(db, 'staff'), orderBy('name', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const staffData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Staff));
            set({ staff: staffData, isLoading: false });
        }, (error) => {
            console.error("Error fetching staff:", error);
            set({ error: error.message, isLoading: false });
        });

        return unsubscribe;
    },

    addStaff: async (member) => {
        // ID is handled by Firestore or Auth UID
        const { id, ...data } = member;
        // If we have an ID (from Auth), use setDoc in the page, 
        // but here we can just add to 'staff' collection.
        // Actually, better to use the same ID for both.
        // So we'll skip addDoc and just use the store to sync with Firestore.
    },

    updateStaff: async (id, member) => {
        await updateDoc(doc(db, 'staff', id), member);
    },

    deleteStaff: async (id) => {
        await deleteDoc(doc(db, 'staff', id));
    },

    getStaffById: (id) => {
        return get().staff.find(s => s.id === id);
    },
}));

// Auto-initialize
const unsub = useStaffStore.getState().init();
// Note: In a real app, you might want to call unsub when the app unmounts.
