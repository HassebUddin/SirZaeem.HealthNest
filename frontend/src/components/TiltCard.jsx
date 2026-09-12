import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

export default function TiltCard({ children, className = '', ...props }) {
  const ref = useRef(null)
  const px = useMotionValue(50)
  const py = useMotionValue(50)

  const rotateX = useSpring(0, { stiffness: 220, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 220, damping: 20 })
  const glowX = useSpring(px, { stiffness: 220, damping: 25 })
  const glowY = useSpring(py, { stiffness: 220, damping: 25 })

  const background = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.35), transparent 60%)`

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const fracX = (e.clientX - rect.left) / rect.width
    const fracY = (e.clientY - rect.top) / rect.height
    px.set(fracX * 100)
    py.set(fracY * 100)
    rotateY.set((fracX - 0.5) * 14)
    rotateX.set((0.5 - fracY) * 14)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div className="tilt-card-glow" style={{ background }} />
      {children}
    </motion.div>
  )
}
