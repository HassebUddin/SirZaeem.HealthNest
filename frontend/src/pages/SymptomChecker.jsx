import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStethoscope, FaWandMagicSparkles, FaUserDoctor } from 'react-icons/fa6'
import api from '../api/client'
import { photoForDoctor } from '../utils/doctorPhotos'

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const analyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.post('/symptomchecker/analyze', { symptoms })
      setResult(data)
    } catch (err) {
      setError(err.response?.data ?? 'Could not analyze symptoms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <motion.div
        className="hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516841273335-e39b37888115?q=80&w=1600&auto=format&fit=crop')" }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-content">
          <h1><FaWandMagicSparkles /> AI Symptom Checker</h1>
          <p>Describe how you're feeling in plain words — our AI will recommend the right specialist and match you with available doctors instantly.</p>
        </div>
      </motion.div>

      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3><FaStethoscope /> Describe your symptoms</h3>
        <form onSubmit={analyze} className="symptom-form">
          <textarea
            placeholder="e.g. I've had a bad headache and blurry vision since yesterday..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            required
          />
          <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}>
            <FaWandMagicSparkles /> {loading ? 'Analyzing...' : 'Check Symptoms'}
          </motion.button>
        </form>
        {error && <p className="error-text" style={{ marginTop: '1rem' }}>{error}</p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="symptom-result"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="symptom-result-header">
              <span className="symptom-result-icon"><FaUserDoctor /></span>
              <div>
                <h3 style={{ marginBottom: '0.15rem' }}>Recommended: {result.recommendedSpecialization}</h3>
              </div>
            </div>
            <p className="explanation">{result.explanation}</p>

            {result.matchingDoctors.length > 0 ? (
              <div className="doctor-list">
                {result.matchingDoctors.map((d, i) => (
                  <motion.div
                    key={d.doctorProfileId}
                    className="doctor-card"
                    onClick={() => navigate('/')}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="doctor-photo">
                      <img src={photoForDoctor(d.fullName)} alt={d.fullName} loading="lazy" />
                      <span className={`plan-badge ${d.plan.toLowerCase()}`}>{d.plan}</span>
                    </div>
                    <h3>{d.fullName}</h3>
                    <p className="doctor-spec">{d.specialization}</p>
                    <p className="doctor-fee">Fee: ${d.consultationFee}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p>No {result.recommendedSpecialization} available right now. Check back later.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
