import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaForward, FaClipboardCheck } from 'react-icons/fa6'
import api from '../api/client'
import { useSignalR } from '../context/SignalRContext'

export function PatientQueueStatus({ appointmentId }) {
  const [status, setStatus] = useState(null)
  const [checkedIn, setCheckedIn] = useState(false)
  const connection = useSignalR()

  const loadStatus = async () => {
    try {
      const { data } = await api.get(`/queue/status/${appointmentId}`)
      setStatus(data)
      setCheckedIn(true)
    } catch {
      setCheckedIn(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [appointmentId])

  useEffect(() => {
    if (!connection) return
    const handler = () => loadStatus()
    connection.on('QueueUpdated', handler)
    return () => connection.off('QueueUpdated', handler)
  }, [connection])

  const checkIn = async () => {
    await api.post(`/queue/check-in/${appointmentId}`)
    loadStatus()
  }

  if (!checkedIn) {
    return (
      <button className="checkin-btn" onClick={checkIn}>
        <FaClipboardCheck style={{ marginRight: '0.35rem' }} /> Check In
      </button>
    )
  }

  if (!status) return null

  return (
    <span className="queue-status">
      {status.position === 1 ? (
        <span className="queue-now">You're next!</span>
      ) : (
        <>#{status.position} · {status.peopleAhead} ahead · ~{status.estimatedWaitMinutes}m wait</>
      )}
    </span>
  )
}

export function DoctorLiveQueue({ doctorProfileId }) {
  const [queue, setQueue] = useState([])
  const connection = useSignalR()

  const loadQueue = async () => {
    const { data } = await api.get(`/queue/doctor/${doctorProfileId}`)
    setQueue(data)
  }

  useEffect(() => {
    if (doctorProfileId) loadQueue()
  }, [doctorProfileId])

  useEffect(() => {
    if (!connection) return
    const handler = (updatedQueue) => setQueue(updatedQueue)
    connection.on('QueueUpdated', handler)
    return () => connection.off('QueueUpdated', handler)
  }, [connection])

  const callNext = async () => {
    await api.post('/queue/next')
    loadQueue()
  }

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h3><FaUsers /> Live Waiting Room ({queue.length})</h3>
      {queue.length === 0 ? (
        <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
          <FaUsers />
          <p>No patients checked in yet.</p>
        </div>
      ) : (
        <>
          <ul className="live-queue-list">
            <AnimatePresence>
              {queue.map((q) => (
                <motion.li
                  key={q.appointmentId}
                  className={`queue-item ${q.isCurrent ? 'queue-current' : ''}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  layout
                >
                  <span className="queue-number">{q.position}</span>
                  {q.patientName}
                  {q.isCurrent && <span className="badge">Now Serving</span>}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <button onClick={callNext}><FaForward style={{ marginRight: '0.4rem' }} /> Call Next Patient</button>
        </>
      )}
    </motion.section>
  )
}
