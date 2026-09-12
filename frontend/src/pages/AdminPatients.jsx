import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaMagnifyingGlass } from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../components/AdminNav'
import { photoForDoctor } from '../utils/doctorPhotos'

export default function AdminPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/patients').then(({ data }) => {
      setPatients(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) =>
      p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    )
  }, [patients, search])

  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaUsers /> Patients</h2>
        <p className="subtitle">{patients.length} patients registered on the platform.</p>
      </div>

      <div className="search-bar">
        <div className="input-group">
          <FaMagnifyingGlass />
          <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Email</th>
                <th>Appointments</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="table-doctor-cell">
                      <img src={photoForDoctor(p.fullName)} alt="" className="table-avatar" />
                      {p.fullName}
                    </td>
                    <td>{p.email}</td>
                    <td>{p.totalAppointments}</td>
                    <td>{new Date(p.joinedAt).toLocaleDateString()}</td>
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
