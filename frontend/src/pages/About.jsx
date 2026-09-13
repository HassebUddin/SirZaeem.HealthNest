import { motion } from 'framer-motion'
import { FaBullseye, FaEye, FaUsers, FaLinkedinIn } from 'react-icons/fa6'
import { photoForDoctor } from '../utils/doctorPhotos'
import daniyalAvatar from '../assets/daniyal.png'
import haseebAvatar from '../assets/haseeb.jpg'

const VALUES = [
  {
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop',
    title: 'Patient First',
    text: 'Every decision we make starts with what\'s best for the people using our platform to find care.'
  },
  {
    image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=600&auto=format&fit=crop',
    title: 'Trust & Quality',
    text: 'We verify every doctor profile so patients can book with complete confidence.'
  },
  {
    image: 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=600&auto=format&fit=crop',
    title: 'Accessible Care',
    text: 'Healthcare booking should be simple and available to everyone, anywhere.'
  }
]

const TEAM = [
  {
    name: 'Haseeb Uddin',
    role: 'Senior Software Engineer (.NET / React)',
    image: haseebAvatar,
    linkedin: 'https://www.linkedin.com/in/haseeb-uddin-5594042a7/'
  },
  {
    name: 'Daniyal Ahmed',
    role: 'Full Stack Developer | CS Student',
    image: daniyalAvatar,
    linkedin: 'https://www.linkedin.com/in/daniyalahmedcs/'
  }
]

export default function About() {
  return (
    <div className="page-static">
      <section className="static-hero">
        <span className="static-hero-glow one" />
        <span className="static-hero-glow two" />
        <span className="static-hero-glow three" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow light">About HealthNest</span>
          <h1>Reimagining how people access healthcare</h1>
          <p>We're building the easiest way for patients to find doctors and for doctors to manage their practice — powered by real-time technology and AI.</p>
        </motion.div>
      </section>

      <section className="page section-narrow">
        <div className="mv-block">
          <motion.div
            className="mv-image"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=1400&auto=format&fit=crop" alt="Our mission" loading="lazy" />
          </motion.div>
          <motion.div
            className="mv-text"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <span className="mv-number">01</span>
            <span className="form-icon-wrap"><FaBullseye /></span>
            <h2>Our Mission</h2>
            <p>To remove every friction point between a patient needing care and a doctor ready to provide it — through instant booking, AI-guided triage, and live communication.</p>
          </motion.div>
        </div>

        <div className="mv-block reverse">
          <motion.div
            className="mv-image"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1400&auto=format&fit=crop" alt="Our vision" loading="lazy" />
          </motion.div>
          <motion.div
            className="mv-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <span className="mv-number">02</span>
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
              className="feature-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="feature-photo">
                <img src={v.image} alt={v.title} loading="lazy" />
              </div>
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
        <div className="team-grid" style={{ maxWidth: 640, margin: '0 auto', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {TEAM.map((t, i) => (
            <motion.div
              key={t.name}
              className="team-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.75rem 1.25rem' }}
            >
              <div style={{ width: 88, height: 88, margin: '0 auto 1rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{t.name}</h3>
              <p className="doctor-spec" style={{ fontSize: '0.85rem', marginBottom: '0.85rem' }}>{t.role}</p>
              {t.linkedin && (
                <a
                  href={t.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    background: 'var(--bg-alt)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <FaLinkedinIn /> LinkedIn
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
