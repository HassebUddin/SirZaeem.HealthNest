import { motion } from 'framer-motion'
import { FaBullseye, FaEye, FaHeartCircleCheck, FaUsers, FaAward, FaGlobe } from 'react-icons/fa6'
import { photoForDoctor } from '../utils/doctorPhotos'

const VALUES = [
  { icon: <FaHeartCircleCheck />, title: 'Patient First', text: 'Every decision we make starts with what\'s best for the people using our platform to find care.' },
  { icon: <FaAward />, title: 'Trust & Quality', text: 'We verify every doctor profile so patients can book with complete confidence.' },
  { icon: <FaGlobe />, title: 'Accessible Care', text: 'Healthcare booking should be simple and available to everyone, anywhere.' }
]

const TEAM = [
  { name: 'Zaeem Abbas', role: 'Founder & Product Lead' },
  { name: 'Hasseb Uddin', role: 'Lead Engineer' },
  { name: 'Ayesha Malik', role: 'Design Lead' },
  { name: 'Usman Tariq', role: 'Operations' }
]

export default function About() {
  return (
    <div className="page-static">
      <section className="static-hero">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow light">About HealthNest</span>
          <h1>Reimagining how people access healthcare</h1>
          <p>We're building the easiest way for patients to find doctors and for doctors to manage their practice — powered by real-time technology and AI.</p>
        </motion.div>
      </section>

      <section className="page section-narrow">
        <div className="split-section">
          <motion.div className="split-col" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="form-icon-wrap"><FaBullseye /></span>
            <h2>Our Mission</h2>
            <p>To remove every friction point between a patient needing care and a doctor ready to provide it — through instant booking, AI-guided triage, and live communication.</p>
          </motion.div>
          <motion.div className="split-col" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <span className="form-icon-wrap"><FaEye /></span>
            <h2>Our Vision</h2>
            <p>A world where booking a doctor's appointment is as easy as ordering food online — transparent, fast, and built around the patient's time.</p>
          </motion.div>
        </div>
      </section>

      <section className="page section-narrow">
        <div className="section-heading">
          <span className="eyebrow">What we stand for</span>
          <h2>Our Values</h2>
        </div>
        <div className="feature-grid">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              className="feature-card icon-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="feature-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="page section-narrow">
        <div className="section-heading">
          <span className="eyebrow"><FaUsers /> The people behind it</span>
          <h2>Our Team</h2>
        </div>
        <div className="team-grid">
          {TEAM.map((t, i) => (
            <motion.div
              key={t.name}
              className="team-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="doctor-avatar" style={{ width: 76, height: 76, margin: '0 auto 0.85rem' }}>
                <img src={photoForDoctor(t.name)} alt={t.name} loading="lazy" />
              </div>
              <h3>{t.name}</h3>
              <p className="doctor-spec">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
