import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeartPulse } from 'react-icons/fa6'
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ navItems, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="dash-shell">
      <button className="mobile-sidebar-toggle" onClick={() => setMobileOpen(true)}>
        <FaBars />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`dash-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="dash-sidebar-brand">
          <span className="brand-icon"><FaHeartPulse /></span>
          <span>HealthNest</span>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)}><FaTimes /></button>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user-chip">
            <span className="nav-user-avatar">{initials}</span>
            <div className="dash-user-info">
              <strong>{user?.fullName}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
          <button className="btn-logout dash-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="dash-content">
        {children}
      </main>
    </div>
  )
}
