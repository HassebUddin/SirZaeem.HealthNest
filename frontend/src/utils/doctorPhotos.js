const PHOTOS = [
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?q=80&w=400&auto=format&fit=crop'
]

const assignedCache = new Map()

function hashOf(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * Returns a photo for a given entity, guaranteeing distinct photos across
 * distinct keys for as long as there are more photos than callers within a session.
 */
export function photoForDoctor(nameOrId) {
  const key = String(nameOrId ?? '')

  if (assignedCache.has(key)) {
    return assignedCache.get(key)
  }

  const used = new Set(assignedCache.values())
  const startIndex = hashOf(key) % PHOTOS.length

  let chosen = PHOTOS[startIndex]
  for (let offset = 0; offset < PHOTOS.length; offset++) {
    const candidate = PHOTOS[(startIndex + offset) % PHOTOS.length]
    if (!used.has(candidate)) {
      chosen = candidate
      break
    }
  }

  assignedCache.set(key, chosen)
  return chosen
}
