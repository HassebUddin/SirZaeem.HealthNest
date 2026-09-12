import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarCheck } from 'react-icons/fa6'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useSignalR } from '../context/SignalRContext'
import DashboardLayout from '../components/DashboardLayout'
import { DOCTOR_NAV_ITEMS } from '../components/DoctorNav'

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const connection = useSignalR()

  const loadAppointments = async () => {
    const { data } = await api.get('/appointments/doctor')
    setAppointments(data)
    setLoading(false)
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    if (!connection || !user) return
    connection.invoke('JoinDoctorGroup', String(user.userId))
    connection.on('NewAppointment', (appointment) => {
      setAppointments((prev) => [...prev, appointment])
    })
    return () => connection.off('NewAppointment')
  }, [connection, user])

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    })
    loadAppointments()
  }

  const filtered = filter === 'All' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <DashboardLayout navItems={DOCTOR_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaCalendarCheck /> Appointments</h2>
        <p className="subtitle">View and manage all your patient bookings.</p>
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
            {filtered.map((a) => (
              <motion.div
                key={a.id}
                className="appt-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="appt-info">
                  <strong>{a.patientName}</strong>
                  <span>{new Date(a.startTime).toLocaleString()}</span>
                </div>
                <div className="appt-actions">
                  <span className={`status-pill ${a.status.toLowerCase()}`}>{a.status}</span>
                  {a.status === 'Confirmed' && (
                    <button className="btn-danger btn-sm" onClick={() => updateStatus(a.id, 'Cancelled')}>Cancel</button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  )
}
