import { useEffect, useState } from 'react'
import api from '../api/client'

export function useDoctorProfileId() {
  const [doctorProfileId, setDoctorProfileId] = useState(null)

  useEffect(() => {
    api.get('/doctors/me').then(({ data }) => setDoctorProfileId(data.doctorProfileId)).catch(() => {})
  }, [])

  return doctorProfileId
}
