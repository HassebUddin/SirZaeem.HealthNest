import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaXmark, FaHeartPulse, FaGraduationCap, FaLinkedinIn, FaBuilding } from 'react-icons/fa6'
import { FaUserGraduate } from 'react-icons/fa'
import { LOGICOSE_LOGO } from '../assets/logicoseLogo'

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
    id: 'B2210006053',
    detail: 'Senior Software Engineer (.NET / React)',
    company: 'Logicose Pvt Ltd',
    companyLogo: LOGICOSE_LOGO,
    image: 'https://scontent-ams2-1.cdninstagram.com/v/t51.82787-19/753282262_17898099765516129_6817168787032967633_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=100&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy45OTIuQzMifQ%3D%3D&_nc_ohc=GFrriF4IWqoQ7kNvwEOJL4A&_nc_oc=AdoaGmXMvcIl-nLIr5TvKUvYaCGDIjkZgJhwDwcWwYOWLuaUKIJreBRBTdLUo389UUw&_nc_zt=24&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=3trgi2F75Jbsqrmk6SBNAQ&_nc_ss=7baaf&oh=00_AQLe_92nNqsrOZrcMvfRSWceriKg-acyKIxAhtojfF7kRA&oe=6AAB8866',
    linkedin: 'https://www.linkedin.com/in/haseeb-uddin-5594042a7/'
  },
  {
    name: 'Daniyal Ahmed',
    id: 'B21110006024',
    detail: 'Student at UBIT',
    image: null
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
