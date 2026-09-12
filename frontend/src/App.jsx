import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { SignalRProvider } from './context/SignalRContext'
import { ThemeProvider } from './context/ThemeContext'
import PublicNavbar from './components/PublicNavbar'
import PublicFooter from './components/PublicFooter'
import ProtectedRoute from './components/ProtectedRoute'
import SupportChatWidget from './components/SupportChatWidget'
import ProjectIntroModal from './components/ProjectIntroModal'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import DoctorSearch from './pages/DoctorSearch'
import SymptomChecker from './pages/SymptomChecker'
import AdminDashboard from './pages/AdminDashboard'
import AdminDoctors from './pages/AdminDoctors'
import AdminPatients from './pages/AdminPatients'
import AdminAppointments from './pages/AdminAppointments'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSettings from './pages/AdminSettings'
import DoctorOverview from './pages/DoctorOverview'
import DoctorProfile from './pages/DoctorProfile'
import DoctorSlots from './pages/DoctorSlots'
import DoctorQueue from './pages/DoctorQueue'
import DoctorAppointments from './pages/DoctorAppointments'
import PatientOverview from './pages/PatientOverview'
import PatientAppointments from './pages/PatientAppointments'

const DASHBOARD_PATHS = ['/admin', '/doctor', '/patient']

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/find-doctor" element={<PageTransition><DoctorSearch /></PageTransition>} />
        <Route path="/symptom-checker" element={<PageTransition><SymptomChecker /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute role="Admin">
              <AdminDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute role="Admin">
              <AdminPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="Admin">
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute role="Admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role="Admin">
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/slots"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorSlots />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/queue"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorQueue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="Patient">
              <PatientOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute role="Patient">
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell() {
  const location = useLocation()
  const isDashboard = DASHBOARD_PATHS.some((p) => location.pathname.startsWith(p))

  if (isDashboard) {
    return (
      <>
        <AnimatedRoutes />
        <SupportChatWidget />
      </>
    )
  }

  return (
    <>
      <PublicNavbar />
      <AnimatedRoutes />
      <PublicFooter />
      <SupportChatWidget />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SignalRProvider>
          <BrowserRouter>
            <div className="app-shell">
              <ProjectIntroModal />
              <AppShell />
            </div>
          </BrowserRouter>
        </SignalRProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
