import { FaGear } from 'react-icons/fa6'
import DashboardLayout from '../components/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../components/AdminNav'

export default function AdminSettings() {
  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaGear /> Settings</h2>
        <p className="subtitle">Platform configuration for the HealthNest SaaS instance.</p>
      </div>

      <section>
        <h3>General</h3>
        <div className="settings-row">
          <div>
            <strong>Platform Name</strong>
            <span>HealthNest</span>
          </div>
          <div>
            <strong>Default Plan</strong>
            <span>Free Tier (Premium upgrade available per doctor)</span>
          </div>
          <div>
            <strong>Support Email</strong>
            <span>support@healthnest.app</span>
          </div>
          <div>
            <strong>Time Zone</strong>
            <span>UTC (server default)</span>
          </div>
        </div>
      </section>

      <section>
        <h3>Subscription Plans</h3>
        <div className="settings-row">
          <div>
            <strong>Free Tier</strong>
            <span>Basic listing, limited appointments per month</span>
          </div>
          <div>
            <strong>Premium Tier</strong>
            <span>Featured listing, unlimited appointments, priority support</span>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}
