const PHOTOS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571772805064-207c8435df79?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1592621385612-4d7129426394?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584467735815-f778f274e296?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1667489022797-ab608913feeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580281657702-257584239a55?q=80&w=400&auto=format&fit=crop'
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
