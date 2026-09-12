import { FaGauge, FaUserDoctor, FaClock, FaUsers, FaCalendarCheck } from 'react-icons/fa6'

export const DOCTOR_NAV_ITEMS = [
  { to: '/doctor', label: 'Overview', end: true, icon: <FaGauge /> },
  { to: '/doctor/profile', label: 'My Profile', icon: <FaUserDoctor /> },
  { to: '/doctor/slots', label: 'Time Slots', icon: <FaClock /> },
  { to: '/doctor/queue', label: 'Live Queue', icon: <FaUsers /> },
  { to: '/doctor/appointments', label: 'Appointments', icon: <FaCalendarCheck /> }
]
