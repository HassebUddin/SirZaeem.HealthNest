import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

const SLIDES = [
  {
    tag: 'Book in seconds',
    title: 'Your health, one tap away',
    text: 'Find trusted doctors, check real-time availability, and book appointments instantly — no phone calls, no waiting rooms.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'AI Powered',
    title: 'Not sure who to see?',
    text: 'Describe your symptoms and our AI Symptom Checker instantly recommends the right specialist for you.',
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'Live updates',
    title: 'Skip the waiting room anxiety',
    text: 'Check in online and track your live queue position in real time — know exactly when it\'s your turn.',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'Trusted network',
    title: 'Care from doctors who show up for you',
    text: 'Every specialist on HealthNest is verified, rated, and ready to help — from routine checkups to urgent concerns.',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'Family care',
    title: 'Healthcare for your whole family',
    text: 'Pediatricians, dermatologists, cardiologists and more — book the right specialist for every member of your family.',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'Always accessible',
    title: 'Healthcare that fits your schedule',
    text: 'Evening slots, weekend availability, and instant confirmations — book care around your life, not the other way around.',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'Modern clinics',
    title: 'Partnered with leading clinics',
    text: 'HealthNest connects you with modern, well-equipped clinics and hospitals across the city.',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'Real conversations',
    title: 'A doctor who actually listens',
    text: 'Detailed profiles and patient reviews help you find a doctor whose approach matches what you need.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1800&auto=format&fit=crop'
  },
  {
    tag: 'Peace of mind',
    title: 'Your health data, always secure',
    text: 'Your appointment history and health details are encrypted and only ever visible to you and your doctor.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1800&auto=format&fit=crop'
  }
]

export default function HeroSlider({ children }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[index]

  const next = () => setIndex((i) => (i + 1) % SLIDES.length)
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)

  return (
    <div className="hero-slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={slide.image}
            alt=""
            className="hero-slide-img"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'linear' }}
          />
          <div className="hero-slide-content">
            <motion.span
              className="hero-tag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {slide.tag}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {slide.text}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button className="hero-slider-arrow left" onClick={prev} aria-label="Previous slide"><FaChevronLeft /></button>
      <button className="hero-slider-arrow right" onClick={next} aria-label="Next slide"><FaChevronRight /></button>

      <div className="hero-slider-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
