import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/shared/Navbar';
import LoginPage from './pages/LoginPage';
import ReportForm from './pages/citizen/ReportForm';
import TrackStatus from './pages/citizen/TrackStatus';
import ResponderDashboard from './pages/responder/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import LandingPage from './pages/LandingPage';
import About from './pages/public/About';
import Blog from './pages/public/Blog';
import Contact from './pages/public/Contact';
import Graphs from './pages/public/Graphs';

// ... (keep ProtectedRoute as is)
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {user && <Navbar />}
      <div style={{ flex: 1, position: 'relative', overflowY: 'auto', background: 'var(--bg)' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/" element={
            user ? (
              user.role === 'admin' ? <Navigate to="/admin" replace /> :
              user.role === 'responder' ? <Navigate to="/dashboard" replace /> :
              <Navigate to="/report" replace />
            ) : <LandingPage />
          } />
          <Route path="/report" element={
            <ProtectedRoute roles={['citizen']}>
              <ReportForm />
            </ProtectedRoute>
          } />
          <Route path="/track" element={
            <ProtectedRoute roles={['citizen']}>
              <TrackStatus />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['responder','admin']}>
              <ResponderDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
              },
            }}
          />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}