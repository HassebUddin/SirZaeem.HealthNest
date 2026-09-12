import { FaGauge, FaCalendarCheck, FaUserDoctor, FaStethoscope } from 'react-icons/fa6'

export const PATIENT_NAV_ITEMS = [
  { to: '/patient', label: 'Overview', end: true, icon: <FaGauge /> },
  { to: '/patient/appointments', label: 'Appointments', icon: <FaCalendarCheck /> },
  { to: '/find-doctor', label: 'Find Doctor', icon: <FaUserDoctor /> },
  { to: '/symptom-checker', label: 'Symptom Checker', icon: <FaStethoscope /> }
]
