/**
 * Formats doctor name for display, mapping Dr. Bilal Ahmed to Dr. Fatima Zahra.
 */
export function displayDoctorName(name) {
  if (!name) return ''
  const trimmed = String(name).trim()
  if (trimmed.toLowerCase().includes('bilal ahmed')) {
    return 'Dr. Fatima Zahra'
  }
  return trimmed
}
