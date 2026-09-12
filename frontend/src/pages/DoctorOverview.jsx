import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaGauge, FaCalendarCheck, FaHourglassHalf, FaCircleCheck, FaArrowRight, FaClock, FaUserDoctor
} from 'react-icons/fa6'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { DOCTOR_NAV_ITEMS } from '../components/DoctorNav'

export default function DoctorOverview() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/appointments/doctor').then(({ data }) => {
      setAppointments(data)
      setLoading(false)
    })
  }, [])

  const { upcoming, pendingCount, completedCount, nextAppointment } = useMemo(() => {
    const now = new Date()
    const upcoming = appointments.filter((a) => new Date(a.startTime) >= now && a.status !== 'Cancelled')
    const sorted = [...upcoming].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    return {
      upcoming,
      pendingCount: appointments.filter((a) => a.status === 'Pending').length,
      completedCount: appointments.filter((a) => a.status === 'Completed').length,
      nextAppointment: sorted[0] ?? null
    }
  }, [appointments])

  return (
    <DashboardLayout navItems={DOCTOR_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaGauge /> Welcome back, Dr. {user?.fullName?.split(' ').slice(-1)[0]}</h2>
        <p className="subtitle">Here's what's happening with your practice today.</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="stat-grid">
            <motion.div className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <span className="stat-icon"><FaCalendarCheck /></span>
              <span className="stat-value">{upcoming.length}</span>
              <span className="stat-label">Upcoming Appointments</span>
            </motion.div>
            <motion.div className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <span className="stat-icon"><FaHourglassHalf /></span>
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">Pending Requests</span>
            </motion.div>
            <motion.div className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <span className="stat-icon"><FaCircleCheck /></span>
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed Visits</span>
            </motion.div>
            <motion.div className="stat-card next-appt-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <span className="stat-icon"><FaClock /></span>
              {nextAppointment ? (
                <>
                  <span className="stat-value" style={{ fontSize: '1.1rem' }}>{nextAppointment.patientName}</span>
                  <span className="stat-label">Next: {new Date(nextAppointment.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </>
              ) : (
                <>
                  <span className="stat-value" style={{ fontSize: '1.1rem' }}>No upcoming visit</span>
                  <span className="stat-label">Add a time slot to get booked</span>
                </>
              )}
            </motion.div>
          </div>

          <div className="quick-links-grid">
            <Link to="/doctor/profile" className="quick-link-card">
              <span className="form-icon-wrap"><FaUserDoctor /></span>
              <div>
                <strong>My Profile</strong>
                <span>Update specialization, fee & bio</span>
              </div>
              <FaArrowRight className="quick-link-arrow" />
            </Link>
            <Link to="/doctor/slots" className="quick-link-card">
              <span className="form-icon-wrap"><FaClock /></span>
              <div>
                <strong>Time Slots</strong>
                <span>Add new availability</span>
              </div>
              <FaArrowRight className="quick-link-arrow" />
            </Link>
            <Link to="/doctor/appointments" className="quick-link-card">
              <span className="form-icon-wrap"><FaCalendarCheck /></span>
              <div>
                <strong>Appointments</strong>
                <span>View and manage all bookings</span>
              </div>
              <FaArrowRight className="quick-link-arrow" />
            </Link>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
