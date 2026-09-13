// Curated distinct stock photos for each doctor
const MALE_PHOTOS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=500&auto=format&fit=crop',   // Dr. Ahmed Khan
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop',   // Dr. Usman Tariq
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=500&auto=format&fit=crop',   // Dr. Kamran Sheikh
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=500&auto=format&fit=crop',   // Dr. Fahad Iqbal
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=500&auto=format&fit=crop',   // Dr. Danish Malik
]

const FEMALE_PHOTOS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500&auto=format&fit=crop',   // 0: Dr. Sana Malik
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=500&auto=format&fit=crop',   // 1: Dr. Fatima Zahra (distinct!)
  'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=500&auto=format&fit=crop',   // 2: Dr. Ayesha Raza
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop',   // 3: Dr. Hina Farooq
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=500&auto=format&fit=crop',   // 4: Dr. Zara Nadeem
  'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?q=80&w=500&auto=format&fit=crop',   // 5: Dr. Mahnoor Siddiqui
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=500&auto=format&fit=crop',   // 6: Dr. Rabia Chaudhry
]

// 1-to-1 unique mapping for every doctor in the database
const DOCTOR_MAP = {
  // IDs (1-based from DataSeeder)
  '1': MALE_PHOTOS[0],    // Dr. Ahmed Khan
  '2': FEMALE_PHOTOS[0],  // Dr. Sana Malik (Short hair, outdoor white coat)
  '3': FEMALE_PHOTOS[1],  // Dr. Fatima Zahra (Distinct smiling doctor in white coat with stethoscope)
  '4': FEMALE_PHOTOS[2],  // Dr. Ayesha Raza
  '5': MALE_PHOTOS[1],    // Dr. Usman Tariq
  '6': FEMALE_PHOTOS[3],  // Dr. Hina Farooq
  '7': MALE_PHOTOS[2],    // Dr. Kamran Sheikh
  '8': FEMALE_PHOTOS[4],  // Dr. Zara Nadeem
  '9': MALE_PHOTOS[3],    // Dr. Fahad Iqbal
  '10': FEMALE_PHOTOS[5], // Dr. Mahnoor Siddiqui
  '11': MALE_PHOTOS[4],   // Dr. Danish Malik
  '12': FEMALE_PHOTOS[6], // Dr. Rabia Chaudhry

  // Name keys (case-insensitive)
  'ahmed khan': MALE_PHOTOS[0],
  'dr. ahmed khan': MALE_PHOTOS[0],
  'sana malik': FEMALE_PHOTOS[0],
  'dr. sana malik': FEMALE_PHOTOS[0],
  'fatima zahra': FEMALE_PHOTOS[1],
  'dr. fatima zahra': FEMALE_PHOTOS[1],
  'bilal ahmed': FEMALE_PHOTOS[1],
  'dr. bilal ahmed': FEMALE_PHOTOS[1],
  'ayesha raza': FEMALE_PHOTOS[2],
  'dr. ayesha raza': FEMALE_PHOTOS[2],
  'usman tariq': MALE_PHOTOS[1],
  'dr. usman tariq': MALE_PHOTOS[1],
  'hina farooq': FEMALE_PHOTOS[3],
  'dr. hina farooq': FEMALE_PHOTOS[3],
  'kamran sheikh': MALE_PHOTOS[2],
  'dr. kamran sheikh': MALE_PHOTOS[2],
  'zara nadeem': FEMALE_PHOTOS[4],
  'dr. zara nadeem': FEMALE_PHOTOS[4],
  'fahad iqbal': MALE_PHOTOS[3],
  'dr. fahad iqbal': MALE_PHOTOS[3],
  'mahnoor siddiqui': FEMALE_PHOTOS[5],
  'dr. mahnoor siddiqui': FEMALE_PHOTOS[5],
  'danish malik': MALE_PHOTOS[4],
  'dr. danish malik': MALE_PHOTOS[4],
  'rabia chaudhry': FEMALE_PHOTOS[6],
  'dr. rabia chaudhry': FEMALE_PHOTOS[6],

  // Specific patient testimonials
  'jalil khan': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
  'sara khan': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop',
  'ali hassan': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop',
  'amna khalid': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop',
  'omar farooqi': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop',
  'maria yousaf': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop',
}

// Known female first names
const FEMALE_NAMES = new Set([
  'sana', 'fatima', 'ayesha', 'hina', 'zara', 'mahnoor', 'rabia',
  'maria', 'amna', 'sadia', 'iqra', 'sara', 'mehak', 'zoya', 'nadia'
])

const FEMALE_IDS = new Set([2, 3, 4, 6, 8, 10, 12])

const assignedCache = new Map()

function hashOf(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return hash
}

function isFemale(nameOrId, nameFallback) {
  const num = Number(nameOrId)
  if (!isNaN(num) && FEMALE_IDS.has(num)) return true

  const combined = `${nameOrId ?? ''} ${nameFallback ?? ''}`.toLowerCase()
  for (const fn of FEMALE_NAMES) {
    if (combined.includes(fn)) return true
  }
  return false
}

/**
 * Returns a unique, gender-appropriate photo for a given doctor or patient.
 */
export function photoForDoctor(nameOrId, nameFallback) {
  const key = String(nameOrId ?? '').trim()
  const lowerKey = key.toLowerCase()

  // 1. Direct lookup by known ID or name
  if (DOCTOR_MAP[lowerKey]) {
    return DOCTOR_MAP[lowerKey]
  }

  if (nameFallback) {
    const lowerFallback = String(nameFallback).trim().toLowerCase()
    if (DOCTOR_MAP[lowerFallback]) {
      return DOCTOR_MAP[lowerFallback]
    }
  }

  // 2. Check session cache
  if (assignedCache.has(key)) {
    return assignedCache.get(key)
  }

  // 3. Fallback to pool based on gender
  const female = isFemale(nameOrId, nameFallback)
  const pool = female ? FEMALE_PHOTOS : MALE_PHOTOS

  const used = new Set(assignedCache.values())
  const startIndex = hashOf(key) % pool.length

  let chosen = pool[startIndex]
  for (let offset = 0; offset < pool.length; offset++) {
    const candidate = pool[(startIndex + offset) % pool.length]
    if (!used.has(candidate)) {
      chosen = candidate
      break
    }
  }

  assignedCache.set(key, chosen)
  return chosen
}
