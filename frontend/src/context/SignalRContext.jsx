import { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { useAuth } from './AuthContext'

const SignalRContext = createContext(null)

export function SignalRProvider({ children }) {
  const { user } = useAuth()
  const connectionRef = useRef(null)
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('token')
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_HUB_URL}?access_token=${token}`)
      .withAutomaticReconnect()
      .build()

    conn.start()
      .then(() => {
        if (user.role === 'Patient') {
          conn.invoke('JoinPatientGroup', String(user.userId))
        }
        setConnection(conn)
      })
      .catch((err) => console.error('SignalR connection error:', err))

    connectionRef.current = conn

    return () => {
      conn.stop()
    }
  }, [user])

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  )
}

export function useSignalR() {
  return useContext(SignalRContext)
}
