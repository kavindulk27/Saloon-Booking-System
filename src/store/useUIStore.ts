import { create } from 'zustand';

interface UIState {
    darkMode: boolean;
    sidebarOpen: boolean;
    toggleDarkMode: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    darkMode: true,
    sidebarOpen: true,
    toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
