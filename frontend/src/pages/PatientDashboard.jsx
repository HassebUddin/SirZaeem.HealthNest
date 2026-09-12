import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCalendarCheck, FaUserDoctor, FaClock, FaGauge, FaStethoscope,
  FaCalendarDays, FaHourglassHalf, FaCircleCheck, FaArrowRight
} from 'react-icons/fa6'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useSignalR } from '../context/SignalRContext'
import { PatientQueueStatus } from '../components/LiveQueue'
import DashboardLayout from '../components/DashboardLayout'

const NAV_ITEMS = [
  { to: '/patient', label: 'Overview', end: true, icon: <FaGauge /> },
  { to: '/patient#appointments', label: 'Appointments', icon: <FaCalendarCheck /> },
  { to: '/find-doctor', label: 'Find Doctor', icon: <FaUserDoctor /> },
  { to: '/symptom-checker', label: 'Symptom Checker', icon: <FaStethoscope /> }
]

const BANNERS = [
  {
    title: 'Stay ahead of allergy season',
    text: 'Book a same-day consult with our top ENT specialists.',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Free health checkups this month',
    text: 'Ask your doctor about our seasonal wellness package.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Not feeling well?',
    text: 'Try our AI Symptom Checker to find the right specialist in seconds.',
    image: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1200&auto=format&fit=crop'
  }
]

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [bannerIndex, setBannerIndex] = useState(0)
  const { user } = useAuth()
  const connection = useSignalR()

  const loadAppointments = async () => {
    const { data } = await api.get('/appointments/patient')
    setAppointments(data)
    setLoading(false)
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setBannerIndex((i) => (i + 1) % BANNERS.length), 4500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!connection) return
    connection.on('AppointmentStatusChanged', (id, status) => {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    })
    return () => connection.off('AppointmentStatusChanged')
  }, [connection])

  const { upcoming, nextAppointment, completedCount } = useMemo(() => {
    const now = new Date()
    const upcoming = appointments.filter((a) => new Date(a.startTime) >= now && a.status !== 'Cancelled')
    const sorted = [...upcoming].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    return {
      upcoming,
      nextAppointment: sorted[0] ?? null,
      completedCount: appointments.filter((a) => a.status === 'Completed').length
    }
  }, [appointments])

  const banner = BANNERS[bannerIndex]

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      <div className="page-header">
        <h2>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h2>
        <p className="subtitle">Here's what's happening with your care today.</p>
      </div>

      <div className="patient-banner-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIndex}
            className="patient-banner"
            style={{ backgroundImage: `linear-gradient(100deg, rgba(6,20,35,0.88), rgba(8,45,45,0.55)), url(${banner.image})` }}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h3>{banner.title}</h3>
              <p>{banner.text}</p>
            </div>
            <Link to="/find-doctor" className="btn-white">Explore <FaArrowRight /></Link>
          </motion.div>
        </AnimatePresence>
        <div className="hero-slider-dots">
          {BANNERS.map((_, i) => (
            <button key={i} className={`hero-dot ${i === bannerIndex ? 'active' : ''}`} onClick={() => setBannerIndex(i)} />
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <motion.div className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="stat-icon"><FaCalendarDays /></span>
          <span className="stat-value">{upcoming.length}</span>
          <span className="stat-label">Upcoming Appointments</span>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <span className="stat-icon"><FaCircleCheck /></span>
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed Visits</span>
        </motion.div>
        <motion.div className="stat-card next-appt-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <span className="stat-icon"><FaHourglassHalf /></span>
          {nextAppointment ? (
            <>
              <span className="stat-value" style={{ fontSize: '1.1rem' }}>Dr. {nextAppointment.doctorName}</span>
              <span className="stat-label">Next: {new Date(nextAppointment.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </>
          ) : (
            <>
              <span className="stat-value" style={{ fontSize: '1.1rem' }}>No upcoming visit</span>
              <span className="stat-label">Book a doctor to get started</span>
            </>
          )}
        </motion.div>
      </div>

      <section id="appointments">
        <h3><FaCalendarCheck /> My Appointments</h3>
        {loading ? (
          <div className="spinner" />
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <FaCalendarCheck />
            <p>No appointments yet. Find a doctor to get started.</p>
          </div>
        ) : (
          <div className="appt-list">
            <AnimatePresence>
              {appointments.map((a, i) => (
                <motion.div
                  key={a.id}
                  className="appt-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="appt-info">
                    <strong><FaUserDoctor style={{ marginRight: '0.4rem', color: 'var(--primary)' }} />Dr. {a.doctorName}</strong>
                    <span><FaClock style={{ marginRight: '0.3rem' }} />{new Date(a.startTime).toLocaleString()}</span>
                  </div>
                  <div className="appt-actions">
                    <span className={`status-pill ${a.status.toLowerCase()}`}>{a.status}</span>
                    {a.status === 'Confirmed' && <PatientQueueStatus appointmentId={a.id} />}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}
