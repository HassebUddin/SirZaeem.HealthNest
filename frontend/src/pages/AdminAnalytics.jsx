import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { FaChartLine } from 'react-icons/fa6'
import api from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../components/AdminNav'

const COLORS = ['#0d7a6c', '#14b8a6', '#f59e0b', '#e11d48', '#16a34a', '#6366f1', '#ec4899', '#84cc16']

export default function AdminAnalytics() {
  const [topDoctors, setTopDoctors] = useState([])
  const [dailyTrend, setDailyTrend] = useState([])
  const [bySpecialization, setBySpecialization] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [t, d, b] = await Promise.all([
        api.get('/analytics/top-doctors'),
        api.get('/analytics/daily-trend'),
        api.get('/analytics/by-specialization')
      ])
      setTopDoctors(t.data)
      setDailyTrend(d.data)
      setBySpecialization(b.data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaChartLine /> Analytics</h2>
        <p className="subtitle">Deep dive into platform performance.</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="charts-grid">
            <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3>Appointments Trend (Last 14 Days)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e9e6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#0d7a6c" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
              <h3>Top Doctors by Appointments</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topDoctors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e9e6" />
                  <XAxis dataKey="doctorName" hide />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="appointmentCount" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}>
              <h3>Doctors by Specialization</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={bySpecialization}
                    dataKey="doctorCount"
                    nameKey="specialization"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {bySpecialization.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
              <h3>Revenue by Doctor</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topDoctors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e9e6" />
                  <XAxis dataKey="doctorName" hide />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div className="table-box" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 style={{ marginBottom: '1rem' }}>All Doctors — Performance</h3>
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
                    <td>{d.doctorName}</td>
                    <td>{d.specialization}</td>
                    <td>{d.appointmentCount}</td>
                    <td>${d.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </DashboardLayout>
  )
}
