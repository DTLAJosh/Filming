import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'

// Public pages
import HomePage from './pages/HomePage'
import UnitsPage from './pages/UnitsPage'
import UnitDetailPage from './pages/UnitDetailPage'
import GuidelinesPage from './pages/GuidelinesPage'
import DocumentsPage from './pages/DocumentsPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'

// Auth
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SignupPage from './pages/SignupPage'

// Homeowner
import DashboardPage from './pages/dashboard/DashboardPage'
import NewUnitPage from './pages/dashboard/NewUnitPage'
import EditUnitPage from './pages/dashboard/EditUnitPage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUnits from './pages/admin/AdminUnits'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminGuidelines from './pages/admin/AdminGuidelines'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminContact from './pages/admin/AdminContact'
import AdminUsers from './pages/admin/AdminUsers'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-ed-white">
      <div className="text-ed-mid font-display text-2xl italic">Loading…</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (requireAdmin && profile?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/units" element={<UnitsPage />} />
      <Route path="/units/:id" element={<UnitDetailPage />} />
      <Route path="/guidelines" element={<GuidelinesPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Homeowner */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/units/new" element={<ProtectedRoute><NewUnitPage /></ProtectedRoute>} />
      <Route path="/dashboard/units/:id/edit" element={<ProtectedRoute><EditUnitPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/units" element={<ProtectedRoute requireAdmin><AdminUnits /></ProtectedRoute>} />
      <Route path="/admin/documents" element={<ProtectedRoute requireAdmin><AdminDocuments /></ProtectedRoute>} />
      <Route path="/admin/guidelines" element={<ProtectedRoute requireAdmin><AdminGuidelines /></ProtectedRoute>} />
      <Route path="/admin/testimonials" element={<ProtectedRoute requireAdmin><AdminTestimonials /></ProtectedRoute>} />
      <Route path="/admin/contact" element={<ProtectedRoute requireAdmin><AdminContact /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
    </Routes>
  )
}
