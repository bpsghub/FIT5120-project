// Service exports for easy importing
import mockFacilityService from './mock/facilityService.js'

// For now, always use mock service in development
const facilityService = mockFacilityService

export { facilityService }
export { default as mockFacilityService } from './mock/facilityService.js'
