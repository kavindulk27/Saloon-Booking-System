import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, isAuthenticated } = useAuthStore();
    const { darkMode, sidebarOpen } = useUIStore();
    const location = useLocation();

    const isLoginRoute = ['/login', '/admin', '/register', '/staff'].includes(location.pathname);
    const isDashboard = (user?.role === 'admin' || user?.role === 'staff') && isAuthenticated;
    const isSoloLoginView = isLoginRoute && !isAuthenticated;

    const layoutClass = `${darkMode ? '' : 'light'}`;

    if (isDashboard) {
        return (
            <div className={`flex h-screen bg-[var(--bg-primary)] overflow-hidden ${layoutClass}`}>
                <Sidebar />
                <main
                    className="flex-1 overflow-y-auto transition-all duration-300 w-full min-w-0"
                    style={{
                        // On desktop, push content by sidebar width. On mobile sidebar is overlay.
                        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
                            ? (sidebarOpen ? '256px' : '72px')
                            : '0px'
                    }}
                >
                    {/* Mobile top spacer so content doesn't hide behind the hamburger button */}
                    <div className="md:hidden h-14" />
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[var(--bg-primary)] ${layoutClass}`}>
            {!isSoloLoginView && <Navbar />}
            <main className={isSoloLoginView ? '' : 'pt-16'}>{children}</main>
        </div>
    );
}
