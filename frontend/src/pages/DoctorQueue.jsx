import { FaUsers } from 'react-icons/fa6'
import DashboardLayout from '../components/DashboardLayout'
import { DOCTOR_NAV_ITEMS } from '../components/DoctorNav'
import { DoctorLiveQueue } from '../components/LiveQueue'
import { useDoctorProfileId } from '../hooks/useDoctorProfile'

export default function DoctorQueue() {
  const doctorProfileId = useDoctorProfileId()

  return (
    <DashboardLayout navItems={DOCTOR_NAV_ITEMS}>
      <div className="page-header">
        <h2><FaUsers /> Live Queue</h2>
        <p className="subtitle">See patients checked in right now and call the next one.</p>
      </div>

      {doctorProfileId ? (
        <DoctorLiveQueue doctorProfileId={doctorProfileId} />
      ) : (
        <div className="spinner" />
      )}
    </DashboardLayout>
  )
}
