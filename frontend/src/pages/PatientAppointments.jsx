import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarCheck, FaUserDoctor, FaClock } from 'react-icons/fa6'
import api from '../api/client'
import { useSignalR } from '../context/SignalRContext'
import { PatientQueueStatus } from '../components/LiveQueue'
import DashboardLayout from '../components/DashboardLayout'
import { PATIENT_NAV_ITEMS } from '../components/PatientNav'

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
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
    if (!connection) return
    connection.on('AppointmentStatusChanged', (id, status) => {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    })
    return () => connection.off('AppointmentStatusChanged')
  }, [connection])

  const filtered = filter === 'All' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <DashboardLayout navItems={PATIENT_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaCalendarCheck /> My Appointments</h2>
        <p className="subtitle">Track your bookings and live queue status in real time.</p>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FaCalendarCheck />
          <p>No appointments found for this filter.</p>
        </div>
      ) : (
        <div className="appt-list">
          <AnimatePresence>
            {filtered.map((a, i) => (
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
    </DashboardLayout>
  )
}
