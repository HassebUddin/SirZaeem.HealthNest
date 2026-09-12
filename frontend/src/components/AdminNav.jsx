import { FaGauge, FaUserDoctor, FaUsers, FaCalendarCheck, FaChartLine, FaGear } from 'react-icons/fa6'

export const ADMIN_NAV_ITEMS = [
  { to: '/admin', label: 'Overview', end: true, icon: <FaGauge /> },
  { to: '/admin/doctors', label: 'Doctors', icon: <FaUserDoctor /> },
  { to: '/admin/patients', label: 'Patients', icon: <FaUsers /> },
  { to: '/admin/appointments', label: 'Appointments', icon: <FaCalendarCheck /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <FaChartLine /> },
  { to: '/admin/settings', label: 'Settings', icon: <FaGear /> }
]
