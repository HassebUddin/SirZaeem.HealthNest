import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import {
  FaChartLine, FaCalendarCheck, FaUserDoctor, FaUsers, FaSackDollar,
  FaHourglassHalf, FaCircleCheck, FaTriangleExclamation, FaArrowRight
} from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../components/AdminNav'
import { photoForDoctor } from '../utils/doctorPhotos'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [topDoctors, setTopDoctors] = useState([])
  const [dailyTrend, setDailyTrend] = useState([])

  useEffect(() => {
    const load = async () => {
      const [s, t, d] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/top-doctors'),
        api.get('/analytics/daily-trend')
      ])
      setSummary(s.data)
      setTopDoctors(t.data.slice(0, 5))
      setDailyTrend(d.data)
    }
    load()
  }, [])

  if (!summary) return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="loading-page">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    </DashboardLayout>
  )

  const mainStats = [
    { label: 'Total Appointments', value: summary.totalAppointments, icon: <FaCalendarCheck /> },
    { label: 'Doctors', value: summary.totalDoctors, icon: <FaUserDoctor /> },
    { label: 'Patients', value: summary.totalPatients, icon: <FaUsers /> },
    { label: 'Total Revenue', value: `$${summary.totalRevenue.toFixed(2)}`, icon: <FaSackDollar /> }
  ]

  const subStats = [
    { label: 'Pending', value: summary.pendingAppointments, icon: <FaHourglassHalf /> },
    { label: 'Confirmed', value: summary.confirmedAppointments, icon: <FaCalendarCheck /> },
    { label: 'Completed', value: summary.completedAppointments, icon: <FaCircleCheck /> },
    { label: 'Cancelled', value: summary.cancelledAppointments, icon: <FaTriangleExclamation /> }
  ]

  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaChartLine /> Admin Overview</h2>
        <p className="subtitle">Live snapshot of platform activity and revenue.</p>
      </div>

      <div className="stat-grid">
        {mainStats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="stat-grid">
        {subStats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card small"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
          >
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid">
        <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3>Appointments Trend (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9f2" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0d7a6c" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
          <h3>Top Doctors by Appointments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topDoctors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9f2" />
              <XAxis dataKey="doctorName" hide />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="appointmentCount" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div className="table-box" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
        <div className="table-box-header">
          <h3>Top Doctors</h3>
          <Link to="/admin/doctors" className="btn-outline btn-sm">View All <FaArrowRight /></Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Appointments</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topDoctors.map((d, i) => (
              <tr key={i}>
                <td className="table-doctor-cell">
                  <img src={photoForDoctor(d.doctorName)} alt="" className="table-avatar" />
                  {d.doctorName}
                </td>
                <td>{d.specialization}</td>
                <td>{d.appointmentCount}</td>
                <td>${d.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  )
}
