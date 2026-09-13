import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeartPulse } from 'react-icons/fa6'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/find-doctor', label: 'Find Doctor' },
  { to: '/symptom-checker', label: 'Symptom Checker' },
  { to: '/contact', label: 'Contact' }
]

export default function PublicNavbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const dashboardPath = user?.role === 'Doctor' ? '/doctor' : user?.role === 'Admin' ? '/admin' : '/patient'

  return (
    <nav className="navbar public-navbar">
      <Link to="/" className="brand">
        <span className="brand-icon"><FaHeartPulse /></span>
        HealthNest
      </Link>

      <div className="nav-links desktop-only">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}

        {!user ? (
          <>
            <Link to="/login" className="nav-btn-login">Login</Link>
            <Link to="/register" className="nav-btn-cta">Get Started</Link>
          </>
        ) : (
          <button className="nav-btn-cta" onClick={() => navigate(dashboardPath)}>Go to Dashboard</button>
        )}
      </div>

      <button className="mobile-menu-btn mobile-only" onClick={() => setOpen(true)}>
        <FaBars />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <button className="mobile-nav-close" onClick={() => setOpen(false)}><FaTimes /></button>
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                {l.label}
              </NavLink>
            ))}
            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="nav-btn-cta mobile-nav-cta" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            ) : (
              <button className="nav-btn-cta mobile-nav-cta" onClick={() => { setOpen(false); navigate(dashboardPath) }}>Go to Dashboard</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
