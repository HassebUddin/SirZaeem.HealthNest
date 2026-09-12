import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineChatBubbleLeftRight, HiOutlineXMark, HiOutlinePaperAirplane } from 'react-icons/hi2'
import { FaRobot } from 'react-icons/fa'
import api from '../api/client'

const WELCOME = {
  role: 'bot',
  text: "Hi! I'm HealthNest's assistant. Tell me what symptoms you're experiencing and I'll help point you to the right specialist."
}

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/symptomchecker/analyze', { symptoms: text })
      const doctorLine = data.matchingDoctors.length > 0
        ? ` We have ${data.matchingDoctors.length} ${data.recommendedSpecialization}${data.matchingDoctors.length > 1 ? 's' : ''} available right now.`
        : ` We don't have a ${data.recommendedSpecialization} available right now, but check back soon.`

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `Based on what you described, I'd recommend seeing a **${data.recommendedSpecialization}**. ${data.explanation}${doctorLine}`,
          cta: data.matchingDoctors.length > 0
        }
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "Sorry, I couldn't process that right now. Try describing your symptoms differently, or use the full Symptom Checker page." }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        aria-label="Open support chat"
      >
        {open ? <HiOutlineXMark /> : <HiOutlineChatBubbleLeftRight />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-panel-header">
              <span className="chat-bot-icon"><FaRobot /></span>
              <div>
                <strong>HealthNest Assistant</strong>
                <span>AI-powered symptom guidance</span>
              </div>
            </div>

            <div className="chat-panel-body">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  {m.text}
                  {m.cta && (
                    <button className="chat-bubble-cta" onClick={() => { setOpen(false); navigate('/find-doctor') }}>
                      View Doctors
                    </button>
                  )}
                </div>
              ))}
              {loading && (
                <div className="chat-bubble bot chat-typing">
                  <span /><span /><span />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form className="chat-panel-input" onSubmit={send}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="Send">
                <HiOutlinePaperAirplane />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
