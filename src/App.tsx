import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './layouts/Layout';
import { useAuthStore } from './store/useAuthStore';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServicesPage from './pages/ServicesPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import GalleryPage from './pages/GalleryPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminLeavePage from './pages/admin/AdminLeavePage';

// Staff
import StaffSchedulePage from './pages/staff/StaffSchedulePage';
import StaffLoginPage from './pages/staff/StaffLoginPage';
import StaffAppointmentsPage from './pages/staff/StaffAppointmentsPage';
import StaffNotificationsPage from './pages/staff/StaffNotificationsPage';
import StaffLeavePage from './pages/staff/StaffLeavePage';

// Route guards
function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AdminRoute({ children, allowedRoles = ['admin'] }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <LoginPage />;
  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function StaffRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <StaffLoginPage />;
  if (user && !['admin', 'staff'].includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1E1E',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
        }}
      />
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

          {/* Customer */}
          <Route path="/my-appointments" element={<PrivateRoute allowedRoles={['customer']}><MyAppointmentsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute allowedRoles={['customer']}><ProfilePage /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/appointments" element={<AdminRoute><AdminAppointmentsPage /></AdminRoute>} />
          <Route path="/admin/services" element={<AdminRoute><AdminServicesPage /></AdminRoute>} />
          <Route path="/admin/staff" element={<AdminRoute><AdminStaffPage /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><AdminCustomersPage /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />
          <Route path="/admin/leave" element={<AdminRoute><AdminLeavePage /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

          {/* Staff */}
          <Route path="/staff" element={<StaffRoute><StaffSchedulePage /></StaffRoute>} />
          <Route path="/staff/appointments" element={<StaffRoute><StaffAppointmentsPage /></StaffRoute>} />
          <Route path="/staff/notifications" element={<StaffRoute><StaffNotificationsPage /></StaffRoute>} />
          <Route path="/staff/leave" element={<StaffRoute><StaffLeavePage /></StaffRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
