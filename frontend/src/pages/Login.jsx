import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaHeartPulse, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa6'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data)
      navigate(data.role === 'Doctor' ? '/doctor' : data.role === 'Patient' ? '/patient' : '/admin')
    } catch (err) {
      setError(err.response?.data ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <span className="brand-icon"><FaHeartPulse /></span>
        <h2>Welcome back</h2>
        <p className="subtitle">Login to manage your appointments</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <div className="input-group">
              <FaEnvelope />
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-group">
              <FaLock />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.6rem' }}
                required
              />
              <button
                type="button"
                className="input-visibility-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="error-text">{String(error)}</p>}

          <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }} whileHover={{ x: 2 }}>
            {loading ? 'Logging in...' : <>Login <FaArrowRight /></>}
          </motion.button>
        </form>

        <p className="auth-switch">No account? <Link to="/register">Register</Link></p>
      </motion.div>
    </div>
  )
}
