// Application constants
export const COUNTRIES = ['Chinese', 'Vietnamese', 'Indonesian', 'Korean', 'Japanese', 'Thai']

export const FACILITY_CATEGORIES = ['restaurant', 'supermarket', 'community center']

export const EVENT_TYPES = ['cultural event', 'food event', 'workshop']

export const EVENT_CATEGORIES = ['festival', 'educational', 'entertainment', 'market']

export const DEFAULT_MAP_CENTER = {
  lat: -37.8136,
  lng: 144.9631, // Melbourne CBD
}

export const DEFAULT_MAP_ZOOM = 13
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const MAP_ATTRIBUTION = '© OpenStreetMap contributors'

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
}

export const API_DELAYS = {
  short: 500,
  medium: 600,
  long: 800,
}
