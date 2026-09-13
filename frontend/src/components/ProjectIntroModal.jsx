import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaXmark, FaHeartPulse, FaGraduationCap, FaLinkedinIn, FaBuilding } from 'react-icons/fa6'
import { FaUserGraduate } from 'react-icons/fa'
import { LOGICOSE_LOGO } from '../assets/logicoseLogo'
import daniyalAvatar from '../assets/daniyal.png'
import haseebAvatar from '../assets/haseeb.jpg'

const SUPERVISOR = {
  name: 'Sir Zaeem Tariq',
  role: 'Supervisor',
  detail: 'CEO FirmLeather | Teaching Associate, Dept. of Computer Science, University of Karachi',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGgOzCApuB1eXjp0yNrIcrE15WJjPDJv7weuoEVLhAxMdpzOkGAfWRDD91&s=10',
  linkedin: 'https://www.linkedin.com/in/zaemtariq/'
}

const TEAM = [
  {
    name: 'Haseeb Uddin',
    id: 'B22110006053',
    detail: 'Senior Software Engineer (.NET / React)',
    company: 'Logicose Pvt Ltd',
    companyLogo: LOGICOSE_LOGO,
    image: haseebAvatar,
    linkedin: 'https://www.linkedin.com/in/haseeb-uddin-5594042a7/'
  },
  {
    name: 'Daniyal Ahmed',
    id: 'B22110006024',
    detail: 'Full Stack Developer | CS Student',
    image: daniyalAvatar,
    linkedin: 'https://www.linkedin.com/in/daniyalahmedcs/'
  }
]

function initialsOf(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

function PersonAvatar({ person }) {
  const [failed, setFailed] = useState(false)

  if (!person.image || failed) {
    return <span className="intro-avatar intro-avatar-fallback">{initialsOf(person.name)}</span>
  }

  return (
    <img
      src={person.image}
      alt={person.name}
      className="intro-avatar"
      onError={() => setFailed(true)}
    />
  )
}

export default function ProjectIntroModal() {
  const [open, setOpen] = useState(true)

  const close = () => setOpen(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="modal-panel intro-panel"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={close} aria-label="Close"><FaXmark /></button>

            <div className="intro-header">
              <span className="brand-icon intro-brand-icon"><FaHeartPulse /></span>
              <h2>HealthNest</h2>
              <p className="subtitle">A SaaS-based Doctor Appointment &amp; Health Management Platform</p>
            </div>

            <div className="intro-course">
              <FaGraduationCap />
              <span>Internet Application Development</span>
            </div>

            <div className="intro-section">
              <span className="intro-label">Supervisor</span>
              <div className="intro-person intro-person-supervisor">
                <PersonAvatar person={SUPERVISOR} />
                <div>
                  <strong>{SUPERVISOR.name}</strong>
                  <span>{SUPERVISOR.role}</span>
                  <span className="intro-detail">{SUPERVISOR.detail}</span>
                  <a href={SUPERVISOR.linkedin} target="_blank" rel="noreferrer" className="intro-linkedin">
                    <FaLinkedinIn /> LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <div className="intro-section">
              <span className="intro-label"><FaUserGraduate /> Team</span>
              <div className="intro-team-grid">
                {TEAM.map((person) => (
                  <div className="intro-person" key={person.name}>
                    <PersonAvatar person={person} />
                    <div>
                      <strong>{person.name}</strong>
                      <span>{person.id}</span>
                      <span className="intro-detail">{person.detail}</span>
                      {person.company && (
                        <span className="intro-company">
                          {person.companyLogo
                            ? <img src={person.companyLogo} alt={person.company} className="intro-company-logo" />
                            : <FaBuilding />}
                          {person.company}
                        </span>
                      )}
                      {person.linkedin && (
                        <a href={person.linkedin} target="_blank" rel="noreferrer" className="intro-linkedin">
                          <FaLinkedinIn /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="intro-cta" onClick={close}>Explore HealthNest</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
