import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClock, FaPlus, FaCircleCheck } from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { DOCTOR_NAV_ITEMS } from '../components/DoctorNav'
import { useDoctorProfileId } from '../hooks/useDoctorProfile'

export default function DoctorSlots() {
  const [slotStart, setSlotStart] = useState('')
  const [slotEnd, setSlotEnd] = useState('')
  const [slots, setSlots] = useState([])
  const [toast, setToast] = useState('')
  const doctorProfileId = useDoctorProfileId()

  const loadSlots = async () => {
    if (!doctorProfileId) return
    const { data } = await api.get(`/doctors/${doctorProfileId}/slots`)
    setSlots(data)
  }

  useEffect(() => {
    loadSlots()
  }, [doctorProfileId])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const addSlot = async (e) => {
    e.preventDefault()
    await api.post('/doctors/slots', { startTime: slotStart, endTime: slotEnd })
    setSlotStart('')
    setSlotEnd('')
    showToast('Time slot added')
    loadSlots()
  }

  return (
    <DashboardLayout navItems={DOCTOR_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaClock /> Time Slots</h2>
        <p className="subtitle">Add new availability for patients to book.</p>
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

      <motion.section className="form-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 520 }}>
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

      <section>
        <h3><FaClock /> Upcoming Slots</h3>
        {slots.length === 0 ? (
          <div className="empty-state">
            <FaClock />
            <p>No upcoming slots. Add one above.</p>
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map((s) => (
              <div key={s.id} className={`slot-chip ${s.isBooked ? 'booked' : ''}`}>
                <div className="slot-time">
                  <strong>{new Date(s.startTime).toLocaleDateString()}</strong>
                  <span>{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className={`status-pill ${s.isBooked ? 'cancelled' : 'confirmed'}`}>{s.isBooked ? 'Booked' : 'Open'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}
