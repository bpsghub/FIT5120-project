// Date formatting utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Distance calculation using Haversine formula
export const calculateDistance = (coord1, coord2) => {
  const lat1 = coord1.lat
  const lng1 = coord1.lng
  const lat2 = coord2.lat
  const lng2 = coord2.lng

  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal
}

// Simple distance calculation for demo purposes
export const calculateSimpleDistance = (coord1, coord2) => {
  return (
    Math.sqrt(Math.pow(coord1.lat - coord2.lat, 2) + Math.pow(coord1.lng - coord2.lng, 2)) * 111
  ) // Rough conversion to km
}

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Generate unique IDs
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Check if user is on mobile device
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Format price display
export const formatPrice = (price) => {
  if (price === 'Free' || price === 'free') return 'Free'
  if (price.startsWith('$')) return price
  return `$${price}`
}
