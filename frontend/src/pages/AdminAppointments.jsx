import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarCheck } from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../components/AdminNav'
import { photoForDoctor } from '../utils/doctorPhotos'

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  const load = async (status) => {
    setLoading(true)
    const { data } = await api.get('/admin/appointments', {
      params: status && status !== 'All' ? { status } : {}
    })
    setAppointments(data)
    setLoading(false)
  }

  useEffect(() => {
    load(filter)
  }, [filter])

  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaCalendarCheck /> Appointments</h2>
        <p className="subtitle">{appointments.length} appointments {filter !== 'All' ? `(${filter})` : 'across the platform'}.</p>
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
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <FaCalendarCheck />
          <p>No appointments found for this filter.</p>
        </div>
      ) : (
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Checked In</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {appointments.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.4) }}
                  >
                    <td className="table-doctor-cell">
                      <img src={photoForDoctor(a.doctorName)} alt="" className="table-avatar" />
                      <div>
                        <div>{a.doctorName}</div>
                        <span className="table-subtext">{a.specialization}</span>
                      </div>
                    </td>
                    <td>{a.patientName}</td>
                    <td>{new Date(a.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td><span className={`status-pill ${a.status.toLowerCase()}`}>{a.status}</span></td>
                    <td>{a.checkedIn ? '✓' : '—'}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
