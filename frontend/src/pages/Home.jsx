import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaUserDoctor, FaCalendarCheck, FaStar, FaArrowRight, FaChartLine, FaStethoscope
} from 'react-icons/fa6'
import { FaQuoteLeft } from 'react-icons/fa'
import api from '../api/client'
import HeroSlider from '../components/HeroSlider'
import TiltCard from '../components/TiltCard'
import InlineSymptomChecker from '../components/InlineSymptomChecker'
import { photoForDoctor } from '../utils/doctorPhotos'
import { useCountUp } from '../hooks/useCountUp'

function CountStat({ target, decimals, suffix = '', label }) {
  const [ref, display] = useCountUp(target, { decimals })
  return (
    <motion.div
      ref={ref}
      className="stat-block"
      initial={{ opacity: 0, y: 18, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 180, damping: 14 }}
    >
      <span className="stat-block-value">{display}{suffix}</span>
      <span className="stat-block-label">{label}</span>
    </motion.div>
  )
}

const FEATURES = [
  {
    image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=600&auto=format&fit=crop',
    title: 'Instant Booking',
    text: 'Real-time slot availability with live updates — no back-and-forth calls.'
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop',
    title: 'AI Symptom Checker',
    text: 'Describe your symptoms and get matched with the right specialist instantly.'
  },
  {
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop',
    title: 'Live Queue Tracking',
    text: 'Check in online and watch your position update in real time.'
  },
  {
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop',
    title: 'Verified Doctors',
    text: 'Every doctor profile is reviewed so you always book with confidence.'
  }
]

const TESTIMONIALS = [
  { name: 'Ayesha Raza', role: 'Patient', text: 'I booked a cardiologist in under two minutes and got a live queue update — no more sitting around wondering when it\'s my turn.', rating: 5 },
  { name: 'Dr. Bilal Ahmed', role: 'Dermatologist', text: 'HealthNest\'s dashboard makes managing my schedule effortless. The real-time notifications are a game changer.', rating: 5 },
  { name: 'Sara Khan', role: 'Patient', text: 'The AI symptom checker pointed me to exactly the right specialist. Genuinely impressed by how smooth this platform is.', rating: 4 }
]

export default function Home() {
  const [doctors, setDoctors] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/doctors').then(({ data }) => setDoctors(data.slice(0, 4))).catch(() => {})
  }, [])

  return (
    <div className="home-page">
      <HeroSlider>
        <div className="hero-cta">
          <Link to="/find-doctor"><FaUserDoctor /> Find a Doctor</Link>
          <Link to="/symptom-checker" className="btn-outline"><FaStethoscope /> Check Symptoms</Link>
        </div>
      </HeroSlider>

      <motion.section
        className="stats-strip"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="stats-strip-inner">
          <CountStat target={50} suffix="+" label={<><FaUserDoctor /> Verified Doctors</>} />
          <CountStat target={2400} suffix="+" label={<><FaCalendarCheck /> Appointments Booked</>} />
          <CountStat target={12} label={<><FaChartLine /> Specializations</>} />
          <CountStat target={4.8} decimals={1} suffix="/5" label={<><FaStar /> Average Rating</>} />
        </div>
      </motion.section>

      <section className="page section-narrow">
        <div className="showcase-split">
          <motion.div
            className="showcase-image"
            initial={{ opacity: 0, x: -60, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=1000&auto=format&fit=crop"
              alt="Doctor consulting with patient"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            className="showcase-text"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why HealthNest
            </motion.span>
            <h2>Everything you need for modern healthcare booking</h2>
            <p className="subtitle">A complete platform connecting patients and doctors with real-time technology — no more phone tag, paper forms, or guessing your wait time.</p>
            <motion.div whileHover={{ x: 4 }} style={{ display: 'inline-block' }}>
              <Link to="/register" className="btn-outline">Create Free Account <FaArrowRight /></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="page section-narrow">
        <div className="section-heading">
          <span className="eyebrow"><FaStethoscope /> AI-Powered</span>
          <h2>Not sure who to see?</h2>
          <p className="subtitle">Our AI Symptom Checker works right here — describe how you feel and get an instant recommendation.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 640, margin: '0 auto' }}
        >
          <InlineSymptomChecker />
        </motion.div>
      </section>

      <section className="page section-narrow">
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
            >
              <div className="feature-photo">
                <img src={f.image} alt={f.title} loading="lazy" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {doctors.length > 0 && (
        <section className="page section-narrow">
          <motion.div
            className="featured-banner"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1800&auto=format&fit=crop"
              alt="Our medical specialists"
              loading="lazy"
            />
            <div className="featured-banner-overlay">
              <span className="eyebrow light">Meet our specialists</span>
              <h2>Featured Doctors</h2>
              <p>Top-rated professionals ready to help you today.</p>
            </div>
          </motion.div>

          <div className="doctor-list">
            {doctors.map((d, i) => (
              <motion.div
                key={d.doctorProfileId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard className="doctor-card">
                  <div className="doctor-photo">
                    <img src={photoForDoctor(d.doctorProfileId)} alt={d.fullName} loading="lazy" />
                    <span className={`plan-badge ${d.plan.toLowerCase()}`}>{d.plan}</span>
                  </div>
                  <h3>{d.fullName}</h3>
                  <p className="doctor-spec">{d.specialization}</p>
                  <p className="doctor-fee">Fee: ${d.consultationFee}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="section-cta">
            <motion.div whileHover={{ x: 4 }} style={{ display: 'inline-block' }}>
              <Link to="/find-doctor" className="btn-outline">View All Doctors <FaArrowRight /></Link>
            </motion.div>
          </div>
        </section>
      )}

      <section className="testimonial-section">
        <div className="page section-narrow">
          <div className="section-heading">
            <span className="eyebrow">Loved by patients & doctors</span>
            <h2>What people are saying</h2>
          </div>

          <div className="testimonial-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, rotate: 0 }}
              >
                <FaQuoteLeft className="quote-icon" />
                <p>{t.text}</p>
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + s * 0.05 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <FaStar className={s < t.rating ? 'filled' : ''} />
                    </motion.span>
                  ))}
                </div>
                <div className="testimonial-author">
                  <span className="doctor-avatar small">
                    <img src={photoForDoctor(t.name)} alt={t.name} loading="lazy" />
                  </span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        className="cta-banner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-banner-inner">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to take control of your healthcare?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of patients and doctors already using HealthNest.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-block' }}
          >
            <Link to="/register" className="btn-white">Get Started Free <FaArrowRight /></Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
