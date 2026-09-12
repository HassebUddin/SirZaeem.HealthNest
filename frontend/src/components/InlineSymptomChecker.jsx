import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWandMagicSparkles, FaArrowRight, FaUserDoctor } from 'react-icons/fa6'
import api from '../api/client'
import { photoForDoctor } from '../utils/doctorPhotos'

export default function InlineSymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.post('/symptomchecker/analyze', { symptoms })
      setResult(data)
    } catch {
      setError('Could not analyze right now. Please try the full Symptom Checker page.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="inline-symptom">
      <div className="inline-symptom-header">
        <span className="form-icon-wrap"><FaWandMagicSparkles /></span>
        <div>
          <h3>Try it right here</h3>
          <p>Describe your symptoms and see the AI recommendation instantly — no page change needed.</p>
        </div>
      </div>

      <form onSubmit={analyze} className="inline-symptom-form">
        <textarea
          placeholder="e.g. I've had a sore throat and mild fever since yesterday..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
        />
        <motion.button type="submit" disabled={loading || !symptoms.trim()} whileTap={{ scale: 0.97 }}>
          {loading ? 'Analyzing...' : <><FaWandMagicSparkles /> Analyze</>}
        </motion.button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <AnimatePresence>
        {result && (
          <motion.div
            className="inline-symptom-result"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-symptom-badge">
              <FaUserDoctor />
              Recommended: <strong>{result.recommendedSpecialization}</strong>
            </div>
            <p>{result.explanation}</p>

            {result.matchingDoctors.length > 0 && (
              <div className="inline-symptom-doctors">
                {result.matchingDoctors.slice(0, 3).map((d) => (
                  <div key={d.doctorProfileId} className="inline-symptom-doctor">
                    <img src={photoForDoctor(d.doctorProfileId)} alt={d.fullName} />
                    <span>{d.fullName}</span>
                  </div>
                ))}
              </div>
            )}

            <Link to="/find-doctor" className="btn-outline btn-sm">
              View Matching Doctors <FaArrowRight />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
