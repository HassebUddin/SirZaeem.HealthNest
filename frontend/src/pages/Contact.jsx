import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaLocationDot, FaPaperPlane, FaUser } from 'react-icons/fa6'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="page-static">
      <section className="static-hero">
        <span className="static-hero-glow one" />
        <span className="static-hero-glow two" />
        <span className="static-hero-glow three" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow light">Contact Us</span>
          <h1>We'd love to hear from you</h1>
          <p>Questions, feedback, or partnership ideas — our team typically responds within 24 hours.</p>
        </motion.div>
      </section>

      <section className="page section-narrow">
        <div className="contact-grid">
          <motion.div className="contact-info" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="contact-image">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop" alt="Support team" loading="lazy" />
            </div>
            <div className="contact-info-item">
              <span className="form-icon-wrap"><FaEnvelope /></span>
              <div>
                <strong>Email</strong>
                <span>support@healthnest.app</span>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="form-icon-wrap"><FaPhone /></span>
              <div>
                <strong>Phone</strong>
                <span>+92 300 1234567</span>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="form-icon-wrap"><FaLocationDot /></span>
              <div>
                <strong>Location</strong>
                <span>Karachi, Pakistan</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card contact-form-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3><FaPaperPlane /> Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Full Name</label>
                <div className="input-group">
                  <FaUser />
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <div className="input-group">
                  <FaEnvelope />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                </div>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" required />
              </div>
              {sent && <p className="success-banner">Message sent! We'll get back to you soon.</p>}
              <motion.button type="submit" whileTap={{ scale: 0.97 }}><FaPaperPlane /> Send Message</motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          className="contact-map"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <img src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1400&auto=format&fit=crop" alt="HealthNest office location" loading="lazy" />
          <div className="contact-map-overlay">
            <FaLocationDot />
            <span>Find us in Karachi, Pakistan</span>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
