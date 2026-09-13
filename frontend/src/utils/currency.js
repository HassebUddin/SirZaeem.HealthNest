/**
 * Formats consultation fee in PKR (Pakistani Rupees).
 * If the consultation plan is 'Free', returns 'Free' (no PKR fee).
 * Otherwise formats in the 1k - 5k PKR range.
 */
export function formatFee(fee, plan) {
  if (plan && String(plan).toLowerCase() === 'free') {
    return 'Free'
  }
  if (fee == null || fee === '' || Number(fee) === 0) return 'Free'
  const num = Number(fee)
  if (isNaN(num)) return 'Free'

  let pkrAmount = num
  // If stored as small seed number (under 100), map to 1k - 5k PKR range
  if (num > 0 && num <= 100) {
    pkrAmount = Math.round((1500 + (num - 20) * 87.5) / 100) * 100
    if (pkrAmount < 1000) pkrAmount = 1000
    if (pkrAmount > 5000) pkrAmount = 5000
  }

  return `PKR ${pkrAmount.toLocaleString()}`
}
