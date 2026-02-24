import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { mockUsers } from '../utils/mockData';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
    resetPassword: (email: string) => Promise<{ success: boolean }>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                await new Promise(r => setTimeout(r, 800)); // simulate API call

                const found = mockUsers.find(u => u.email === email);

                if (found && password === 'demo123') {
                    set({ user: found, isAuthenticated: true, isLoading: false });
                    return { success: true };
                }

                set({ isLoading: false });
                return { success: false, error: 'Invalid email or password. Use password: demo123' };
            },

            register: async (name, email, _password, phone) => {
                set({ isLoading: true });
                await new Promise(r => setTimeout(r, 1000));

                const exists = mockUsers.find(u => u.email === email);
                if (exists) {
                    set({ isLoading: false });
                    return { success: false, error: 'Email already registered.' };
                }

                const newUser: User = {
                    id: `u${Date.now()}`,
                    name,
                    email,
                    phone,
                    role: 'customer',
                    loyaltyPoints: 50, // welcome points
                    joinDate: new Date().toISOString().split('T')[0],
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                };

                mockUsers.push(newUser);
                set({ user: newUser, isAuthenticated: true, isLoading: false });
                return { success: true };
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },

            updateProfile: (updates) => {
                const current = get().user;
                if (current) {
                    set({ user: { ...current, ...updates } });
                }
            },

            resetPassword: async (email) => {
                await new Promise(r => setTimeout(r, 1000));
                const found = mockUsers.find(u => u.email === email);
                return { success: !!found };
            },
        }),
        {
            name: 'saloon-auth',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
