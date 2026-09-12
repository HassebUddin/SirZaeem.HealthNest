import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserDoctor, FaStethoscope, FaSackDollar, FaPenNib, FaFloppyDisk, FaCircleCheck } from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { DOCTOR_NAV_ITEMS } from '../components/DoctorNav'

export default function DoctorProfile() {
  const [profile, setProfile] = useState({ specialization: '', consultationFee: 0, bio: '' })
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    await api.put('/doctors/profile', profile)
    showToast('Profile updated successfully')
  }

  return (
    <DashboardLayout navItems={DOCTOR_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaUserDoctor /> My Profile</h2>
        <p className="subtitle">Keep your specialization, fee and bio up to date.</p>
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
        <h3><span className="form-icon-wrap"><FaUserDoctor /></span> Profile Details</h3>
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
    </DashboardLayout>
  )
}
