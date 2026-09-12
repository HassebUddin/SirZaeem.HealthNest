import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaUserDoctor, FaMagnifyingGlass, FaPlus, FaXmark, FaCircleCheck,
  FaEnvelope, FaLock, FaStethoscope, FaSackDollar, FaPenNib, FaTrash
} from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../components/AdminNav'
import { photoForDoctor } from '../utils/doctorPhotos'

const EMPTY_FORM = {
  fullName: '',
  email: '',
  password: '',
  specialization: '',
  consultationFee: '',
  bio: '',
  plan: 'Free'
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  const loadDoctors = async () => {
    const { data } = await api.get('/admin/doctors')
    setDoctors(data)
    setLoading(false)
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return doctors
    return doctors.filter((d) =>
      d.fullName.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)
    )
  }, [doctors, search])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.post('/admin/doctors', {
        ...form,
        consultationFee: parseFloat(form.consultationFee) || 0
      })
      setShowForm(false)
      setForm(EMPTY_FORM)
      showToast('Doctor added successfully')
      loadDoctors()
    } catch (err) {
      setError(err.response?.data ?? 'Could not add doctor')
    } finally {
      setSaving(false)
    }
  }

  const removeDoctor = async (doctorProfileId) => {
    if (!window.confirm('Remove this doctor? This cannot be undone.')) return
    try {
      await api.delete(`/admin/doctors/${doctorProfileId}`)
      showToast('Doctor removed')
      loadDoctors()
    } catch (err) {
      showToast(err.response?.data ?? 'Could not remove doctor')
    }
  }

  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaUserDoctor /> Doctors</h2>
        <p className="subtitle">{doctors.length} doctors registered on the platform.</p>
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

      <div className="search-bar">
        <div className="input-group">
          <FaMagnifyingGlass />
          <input placeholder="Search by name or specialization..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowForm(true)}><FaPlus /> Add Doctor</button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="doctor-list">
          <AnimatePresence>
            {filtered.map((d, i) => (
              <motion.div
                key={d.doctorProfileId}
                className="doctor-card admin-doctor-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  className="admin-doctor-remove"
                  onClick={(e) => { e.stopPropagation(); removeDoctor(d.doctorProfileId) }}
                  aria-label="Remove doctor"
                  title="Remove doctor"
                >
                  <FaTrash />
                </button>
                <div className="doctor-photo">
                  <img src={photoForDoctor(d.doctorProfileId)} alt={d.fullName} loading="lazy" />
                  <span className={`plan-badge ${d.plan.toLowerCase()}`}>{d.plan}</span>
                </div>
                <h3>{d.fullName}</h3>
                <p className="doctor-spec">{d.specialization}</p>
                <p className="doctor-fee">{d.email}</p>
                <div className="admin-doctor-meta">
                  <span>Fee: ${d.consultationFee}</span>
                  <span>{d.totalAppointments} appointments</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close"><FaXmark /></button>

              <h3 style={{ marginBottom: '1.25rem' }}><FaUserDoctor /> Add New Doctor</h3>

              <form onSubmit={submitForm}>
                <div className="field">
                  <label>Full Name</label>
                  <input
                    placeholder="e.g. Amir Shah"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Email</label>
                    <div className="input-group">
                      <FaEnvelope />
                      <input
                        type="email"
                        placeholder="doctor@healthnest.app"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <div className="input-group">
                      <FaLock />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Specialization</label>
                    <div className="input-group">
                      <FaStethoscope />
                      <input
                        placeholder="e.g. Cardiologist"
                        value={form.specialization}
                        onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                        required
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
                        value={form.consultationFee}
                        onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label>Bio (optional)</label>
                  <div className="input-group">
                    <FaPenNib />
                    <textarea
                      placeholder="Short professional bio..."
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      style={{ paddingLeft: '2.8rem' }}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Plan</label>
                  <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>

                {error && <p className="error-text">{String(error)}</p>}

                <motion.button type="submit" disabled={saving} whileTap={{ scale: 0.97 }}>
                  {saving ? 'Adding...' : <><FaPlus /> Add Doctor</>}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
