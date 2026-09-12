import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserDoctor, FaMagnifyingGlass } from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../components/AdminNav'
import { photoForDoctor } from '../utils/doctorPhotos'

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/doctors').then(({ data }) => {
      setDoctors(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return doctors
    return doctors.filter((d) =>
      d.fullName.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)
    )
  }, [doctors, search])

  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaUserDoctor /> Doctors</h2>
        <p className="subtitle">{doctors.length} doctors registered on the platform.</p>
      </div>

      <div className="search-bar">
        <div className="input-group">
          <FaMagnifyingGlass />
          <input placeholder="Search by name or specialization..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
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
                <div className="doctor-photo">
                  <img src={photoForDoctor(d.fullName)} alt={d.fullName} loading="lazy" />
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
    </DashboardLayout>
  )
}
