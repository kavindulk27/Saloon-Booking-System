import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    resetPassword: (email: string) => Promise<{ success: boolean }>;
    init: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true, // Start with loading while we check the session

            init: () => {
                onAuthStateChanged(auth, async (firebaseUser) => {
                    if (firebaseUser) {
                        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                        if (userDoc.exists()) {
                            set({
                                user: userDoc.data() as User,
                                isAuthenticated: true,
                                isLoading: false
                            });
                        } else {
                            // This handle cases where user exists in Auth but not in Firestore
                            set({ user: null, isAuthenticated: false, isLoading: false });
                        }
                    } else {
                        set({ user: null, isAuthenticated: false, isLoading: false });
                    }
                });
            },

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data() as User;
                        set({ user: userData, isAuthenticated: true, isLoading: false });
                        return { success: true };
                    }

                    set({ isLoading: false });
                    return { success: false, error: 'User profile not found in database.' };
                } catch (error: any) {
                    console.error("Login Error:", error);
                    set({ isLoading: false });
                    let message = 'Login failed. Please try again.';

                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                        message = 'Invalid email or password.';
                    } else if (error.code === 'auth/invalid-email') {
                        message = 'The email address is not valid.';
                    } else if (error.code === 'auth/user-disabled') {
                        message = 'This account has been disabled.';
                    } else if (error.code === 'auth/too-many-requests') {
                        message = 'Too many failed attempts. Please try again later.';
                    }

                    return { success: false, error: message };
                }
            },

            register: async (name, email, password, phone) => {
                set({ isLoading: true });
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                    const newUser: User = {
                        id: userCredential.user.uid,
                        name,
                        email,
                        phone,
                        role: 'customer',
                        loyaltyPoints: 50,
                        joinDate: new Date().toISOString().split('T')[0],
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                    };

                    await setDoc(doc(db, 'users', newUser.id), newUser);
                    set({ user: newUser, isAuthenticated: true, isLoading: false });
                    return { success: true };
                } catch (error: any) {
                    console.error("Registration Error:", error);
                    set({ isLoading: false });
                    let message = 'Registration failed. Please try again.';

                    if (error.code === 'auth/email-already-in-use') {
                        message = 'This email is already in use.';
                    } else if (error.code === 'auth/invalid-email') {
                        message = 'The email address is not valid.';
                    } else if (error.code === 'auth/weak-password') {
                        message = 'The password is too weak.';
                    } else if (error.code === 'auth/operation-not-allowed') {
                        message = 'Email/Password sign-in is not enabled in Firebase Console.';
                    } else if (error.code === 'permission-denied') {
                        message = 'Database permission denied. Please check Firestore rules.';
                    }

                    return { success: false, error: message };
                }
            },

            logout: async () => {
                await signOut(auth);
                set({ user: null, isAuthenticated: false });
            },

            updateProfile: async (updates) => {
                const current = get().user;
                if (current) {
                    await updateDoc(doc(db, 'users', current.id), updates);
                    set({ user: { ...current, ...updates } });
                }
            },

            resetPassword: async (email) => {
                try {
                    await sendPasswordResetEmail(auth, email);
                    return { success: true };
                } catch (error) {
                    return { success: false };
                }
            },
        }),
        {
            name: 'saloon-auth',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);

// Auto-initialize
useAuthStore.getState().init();
