import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaQuoteLeft, FaStar } from 'react-icons/fa'
import { photoForDoctor } from '../utils/doctorPhotos'

export default function TestimonialSlider({ testimonials }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisible(1)
      else if (window.innerWidth < 1024) setVisible(2)
      else setVisible(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - visible)

  // Auto-advance cards at their own smooth pace (every 2 seconds)
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, 2000)
    return () => clearInterval(timer)
  }, [paused, maxIndex])

  const itemWidth = 100 / visible

  return (
    <div
      className="testimonial-carousel-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testimonial-carousel-viewport">
        <motion.div
          className="testimonial-carousel-track"
          animate={{ x: `-${index * itemWidth}%` }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name + i}
              className="testimonial-carousel-item"
              style={{ flex: `0 0 ${itemWidth}%`, width: `${itemWidth}%` }}
            >
              <div className="testimonial-card">
                <FaQuoteLeft className="quote-icon" />
                <p>{t.text}</p>
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} style={{ display: 'inline-flex' }}>
                      <FaStar className={s < t.rating ? 'filled' : ''} />
                    </span>
                  ))}
                </div>
                <div className="testimonial-author">
                  <span className="doctor-avatar small">
                    <img src={t.photo || photoForDoctor(t.name)} alt={t.name} loading="lazy" />
                  </span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
