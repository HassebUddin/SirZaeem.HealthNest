import { Link } from 'react-router-dom'
import { FaHeartPulse } from 'react-icons/fa6'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

export default function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-icon"><FaHeartPulse /></span>
            HealthNest
          </Link>
          <p>Book trusted doctors, get AI-powered symptom guidance, and manage your care — all in one modern platform.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/find-doctor">Find a Doctor</Link>
          <Link to="/symptom-checker">Symptom Checker</Link>
          <Link to="/register">Create Account</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <span>support@healthnest.app</span>
          <span>+92 300 1234567</span>
          <span>Karachi, Pakistan</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} HealthNest. All rights reserved.</span>
        <span>Built for SirZaeem's SaaS Project</span>
      </div>
    </footer>
  )
}
