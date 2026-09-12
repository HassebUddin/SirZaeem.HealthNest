import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function useCountUp(target, { duration = 1.6, decimals = 0 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    let frame
    const start = performance.now()

    const tick = (now) => {
      const elapsed = (now - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration])

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()

  return [ref, display]
}
