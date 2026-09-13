import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserDoctor, FaCircleCheck, FaClock, FaStethoscope, FaShieldHeart, FaBolt, FaXmark } from 'react-icons/fa6'
import { FaSearch } from 'react-icons/fa'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useSignalR } from '../context/SignalRContext'
import { photoForDoctor } from '../utils/doctorPhotos'
import { formatFee } from '../utils/currency'
import { displayDoctorName } from '../utils/doctorName'

const FILTERS = ['All', 'Available', 'Booked']

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState([])
  const [specialization, setSpecialization] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [message, setMessage] = useState('')
  const [authNeeded, setAuthNeeded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const { user } = useAuth()
  const connection = useSignalR()

  const loadDoctors = async () => {
    setLoading(true)
    const { data } = await api.get('/doctors', { params: { specialization } })
    setDoctors(data)
    setLoading(false)
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    if (!connection) return
    connection.on('SlotBooked', (slotId) => {
      setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, isBooked: true } : s)))
    })
    connection.on('SlotAdded', (slot) => {
      setSlots((prev) => [...prev, slot])
    })
    return () => {
      connection.off('SlotBooked')
      connection.off('SlotAdded')
    }
  }, [connection])

  const viewSlots = async (doctor) => {
    setSelectedDoctor(doctor)
    setMessage('')
    setFilter('All')
    const { data } = await api.get(`/doctors/${doctor.doctorProfileId}/slots`)
    setSlots(data)
  }

  const closeModal = () => {
    setSelectedDoctor(null)
    setSlots([])
    setMessage('')
    setAuthNeeded(false)
  }

  const book = async (slotId) => {
    setMessage('')
    setAuthNeeded(false)

    if (!user) {
      setMessage('Please log in or register as a patient to book this appointment.')
      setAuthNeeded(true)
      return
    }

    if (user.role !== 'Patient') {
      setMessage('Only patient accounts can book appointments.')
      return
    }

    try {
      await api.post('/appointments/book', { timeSlotId: slotId })
      setMessage('Appointment booked successfully!')
      setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, isBooked: true } : s)))
    } catch (err) {
      setMessage(err.response?.data ?? 'Booking failed')
    }
  }

  const filteredSlots = useMemo(() => {
    if (filter === 'Available') return slots.filter((s) => !s.isBooked)
    if (filter === 'Booked') return slots.filter((s) => s.isBooked)
    return slots
  }, [slots, filter])

  const availableCount = slots.filter((s) => !s.isBooked).length
  const bookedCount = slots.filter((s) => s.isBooked).length

  return (
    <div className="page">
      <motion.div
        className="hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1600&auto=format&fit=crop')" }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-content">
          <h1>Book the right doctor, in seconds.</h1>
          <p>Search specialists, view live availability, and get real-time updates on your appointment — all in one place.</p>
          <div className="hero-badges">
            <span className="hero-badge"><FaBolt /> Real-time booking</span>
            <span className="hero-badge"><FaShieldHeart /> Verified doctors</span>
            <span className="hero-badge"><FaStethoscope /> AI symptom match</span>
          </div>
        </div>
      </motion.div>

      <div className="search-bar">
        <div className="input-group">
          <FaSearch />
          <input
            placeholder="Search by specialization (e.g. Cardiologist)..."
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadDoctors()}
          />
        </div>
        <button onClick={loadDoctors}>Search</button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <FaUserDoctor />
          <p>No doctors found. Try a different specialization.</p>
        </div>
      ) : (
        <div className="doctor-list">
          <AnimatePresence>
            {doctors.map((d, i) => (
              <motion.div
                key={d.doctorProfileId}
                className="doctor-card"
                onClick={() => viewSlots(d)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="doctor-photo">
                  <img src={photoForDoctor(d.fullName || d.doctorProfileId, d.fullName)} alt={displayDoctorName(d.fullName)} loading="lazy" />
                  <span className={`plan-badge ${d.plan.toLowerCase()}`}>{d.plan}</span>
                </div>
                <h3>{displayDoctorName(d.fullName)}</h3>
                <p className="doctor-spec">{d.specialization}</p>
                <p className="doctor-fee">Consultation Fee: {formatFee(d.consultationFee, d.plan)}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal} aria-label="Close"><FaXmark /></button>

              <div className="modal-doctor-header">
                <img src={photoForDoctor(selectedDoctor.fullName || selectedDoctor.doctorProfileId, selectedDoctor.fullName)} alt={displayDoctorName(selectedDoctor.fullName)} className="modal-doctor-photo" />
                <div>
                  <h3>{displayDoctorName(selectedDoctor.fullName)}</h3>
                  <p className="doctor-spec">{selectedDoctor.specialization}</p>
                  <span className={`plan-badge ${selectedDoctor.plan.toLowerCase()}`}>{selectedDoctor.plan}</span>
                </div>
              </div>

              {message && (
                <div style={{ marginBottom: '1rem' }}>
                  <p className={message.includes('success') ? 'success-banner' : 'error-text'}>
                    {message.includes('success') && <FaCircleCheck />} {message}
                  </p>
                  {authNeeded && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem' }}>
                      <Link to="/login" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}>
                        Log In Now
                      </Link>
                      <Link to="/register" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}>
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="filter-tabs">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                    {f === 'Available' && ` (${availableCount})`}
                    {f === 'Booked' && ` (${bookedCount})`}
                  </button>
                ))}
              </div>

              <div className="modal-body">
                {filteredSlots.length === 0 ? (
                  <div className="empty-state">
                    <FaClock />
                    <p>No {filter !== 'All' ? filter.toLowerCase() : 'upcoming'} slots.</p>
                  </div>
                ) : (
                  <div className="slots-grid">
                    {filteredSlots.map((s) => (
                      <div key={s.id} className={`slot-chip ${s.isBooked ? 'booked' : ''}`}>
                        <div className="slot-time">
                          <strong>{new Date(s.startTime).toLocaleDateString()}</strong>
                          <span>{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {s.isBooked ? (
                          <span className="status-pill cancelled">Booked</span>
                        ) : (
                          <button onClick={() => book(s.id)}>Book</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
