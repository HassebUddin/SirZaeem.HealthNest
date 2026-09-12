import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserDoctor, FaClock, FaCalendarCheck, FaPlus, FaFloppyDisk, FaCircleCheck, FaStethoscope, FaSackDollar, FaPenNib, FaGauge, FaUsers } from 'react-icons/fa6'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useSignalR } from '../context/SignalRContext'
import { DoctorLiveQueue } from '../components/LiveQueue'
import DashboardLayout from '../components/DashboardLayout'

const NAV_ITEMS = [
  { to: '/doctor', label: 'Overview', end: true, icon: <FaGauge /> },
  { to: '/doctor#profile', label: 'My Profile', icon: <FaUserDoctor /> },
  { to: '/doctor#slots', label: 'Time Slots', icon: <FaClock /> },
  { to: '/doctor#queue', label: 'Live Queue', icon: <FaUsers /> },
  { to: '/doctor#appointments', label: 'Appointments', icon: <FaCalendarCheck /> }
]

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [profile, setProfile] = useState({ specialization: '', consultationFee: 0, bio: '' })
  const [doctorProfileId, setDoctorProfileId] = useState(null)
  const [slotStart, setSlotStart] = useState('')
  const [slotEnd, setSlotEnd] = useState('')
  const [toast, setToast] = useState('')
  const { user } = useAuth()
  const connection = useSignalR()

  useEffect(() => {
    api.get('/doctors/me').then(({ data }) => setDoctorProfileId(data.doctorProfileId)).catch(() => {})
  }, [])

  const loadAppointments = async () => {
    const { data } = await api.get('/appointments/doctor')
    setAppointments(data)
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    if (!connection || !user) return
    connection.invoke('JoinDoctorGroup', String(user.userId))
    connection.on('NewAppointment', (appointment) => {
      setAppointments((prev) => [...prev, appointment])
      showToast('New appointment booked!')
    })
    return () => connection.off('NewAppointment')
  }, [connection, user])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    await api.put('/doctors/profile', profile)
    showToast('Profile updated successfully')
  }

  const addSlot = async (e) => {
    e.preventDefault()
    await api.post('/doctors/slots', { startTime: slotStart, endTime: slotEnd })
    setSlotStart('')
    setSlotEnd('')
    showToast('Time slot added')
  }

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    })
    loadAppointments()
  }

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      <div className="page-header">
        <h2><FaUserDoctor /> Doctor Dashboard</h2>
        <p className="subtitle">Manage your profile, slots and appointments in real time.</p>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.p
            className="success-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FaCircleCheck /> {toast}
          </motion.p>
        )}
      </AnimatePresence>

      <div id="profile" className="charts-grid">
        <motion.section className="form-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h3><span className="form-icon-wrap"><FaUserDoctor /></span> My Profile</h3>
          <form onSubmit={saveProfile}>
            <div className="field">
              <label>Specialization</label>
              <div className="input-group">
                <FaStethoscope />
                <input
                  placeholder="e.g. Cardiologist"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label>Consultation Fee ($)</label>
              <div className="input-group">
                <FaSackDollar />
                <input
                  type="number"
                  placeholder="50"
                  value={profile.consultationFee}
                  onChange={(e) => setProfile({ ...profile, consultationFee: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="field">
              <label>Bio</label>
              <div className="input-group">
                <FaPenNib />
                <textarea
                  placeholder="Short professional bio..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  style={{ paddingLeft: '2.8rem' }}
                />
              </div>
            </div>
            <motion.button type="submit" whileTap={{ scale: 0.97 }}><FaFloppyDisk /> Save Profile</motion.button>
          </form>
        </motion.section>

        <motion.section id="slots" className="form-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h3><span className="form-icon-wrap"><FaClock /></span> Add Time Slot</h3>
          <form onSubmit={addSlot}>
            <div className="field-row">
              <div className="field">
                <label>Start Time</label>
                <input type="datetime-local" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} required />
              </div>
              <div className="field">
                <label>End Time</label>
                <input type="datetime-local" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} required />
              </div>
            </div>
            <motion.button type="submit" whileTap={{ scale: 0.97 }}><FaPlus /> Add Slot</motion.button>
          </form>
        </motion.section>
      </div>

      <div id="queue">
        {doctorProfileId && <DoctorLiveQueue doctorProfileId={doctorProfileId} />}
      </div>

      <motion.section id="appointments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3><FaCalendarCheck /> My Appointments</h3>
        {appointments.length === 0 ? (
          <div className="empty-state">
            <FaCalendarCheck />
            <p>No appointments yet.</p>
          </div>
        ) : (
          <div className="appt-list">
            <AnimatePresence>
              {appointments.map((a) => (
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
      </motion.section>
    </DashboardLayout>
  )
}
