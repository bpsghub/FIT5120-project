// Real facility service that loads data from JSON files

class FacilityService {
  constructor() {
    this.facilitiesData = null
    this.eventsData = null
    this.loadPromise = null
  }

  // Load data from JSON files
  async loadData() {
    if (this.loadPromise) {
      return this.loadPromise
    }

    this.loadPromise = this._loadJsonData()
    return this.loadPromise
  }

  async _loadJsonData() {
    try {
      console.log('🔄 Starting to load JSON data...')

      const [facilitiesResponse, eventsResponse] = await Promise.all([
        fetch('/facilities_frontend.json'),
        fetch('/events_frontend.json'),
      ])

      console.log('📡 Fetch responses:', {
        facilities: facilitiesResponse.status,
        events: eventsResponse.status,
      })

      if (!facilitiesResponse.ok || !eventsResponse.ok) {
        throw new Error(
          `Failed to load data files: facilities=${facilitiesResponse.status}, events=${eventsResponse.status}`,
        )
      }

      this.facilitiesData = await facilitiesResponse.json()
      this.eventsData = await eventsResponse.json()

      console.log('✅ Data loaded successfully:', {
        facilities: this.facilitiesData.length,
        events: this.eventsData.length,
      })
    } catch (error) {
      console.error('❌ Error loading data:', error)
      // Fallback to empty arrays
      this.facilitiesData = []
      this.eventsData = []
      throw error
    }
  }

  // Ensure data is loaded before proceeding
  async ensureDataLoaded() {
    if (!this.facilitiesData || !this.eventsData) {
      await this.loadData()
    }
  }

  // Simulate API delay for realistic UX
  delay(ms = 800) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // ================================
  // FACILITIES METHODS
  // ================================

  // Get all facilities with pagination
  async getAllFacilities(page = 1, limit = 20) {
    await this.ensureDataLoaded()
    await this.delay(600)

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = this.facilitiesData.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: this.facilitiesData.length,
        totalPages: Math.ceil(this.facilitiesData.length / limit),
      },
    }
  }

  // Filter facilities
  async filterFacilities(filters) {
    await this.ensureDataLoaded()
    await this.delay(400)

    let filtered = [...this.facilitiesData]

    // Filter by country/ethnic group
    if (filters.country) {
      filtered = filtered.filter((facility) =>
        facility.ethnicTags?.some((tag) =>
          tag.toLowerCase().includes(filters.country.toLowerCase()),
        ),
      )
    }

    // Filter by category/type
    if (filters.category) {
      filtered = filtered.filter(
        (facility) => facility.type?.toLowerCase() === filters.category.toLowerCase(),
      )
    }

    // Filter by location (simple address check)
    if (filters.location) {
      filtered = filtered.filter((facility) =>
        facility.address?.toLowerCase().includes(filters.location.toLowerCase()),
      )
    }

    return {
      success: true,
      data: filtered,
      filters: filters,
    }
  }

  // Search facilities by keyword
  async searchFacilities(keyword) {
    await this.ensureDataLoaded()
    await this.delay(300)

    if (!keyword || keyword.trim() === '') {
      return this.getAllFacilities()
    }

    const searchTerm = keyword.toLowerCase()
    const filtered = this.facilitiesData.filter(
      (facility) =>
        facility.name?.toLowerCase().includes(searchTerm) ||
        facility.address?.toLowerCase().includes(searchTerm) ||
        facility.type?.toLowerCase().includes(searchTerm) ||
        facility.ethnicTags?.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        facility.raw?.description?.toLowerCase().includes(searchTerm),
    )

    return {
      success: true,
      data: filtered,
      searchTerm: keyword,
    }
  }

  // Get nearby facilities
  async getNearbyFacilities(lat, lng, radius = 5) {
    await this.ensureDataLoaded()
    await this.delay(500)

    // Simple distance calculation (not accurate, just for demo)
    const filtered = this.facilitiesData.filter((facility) => {
      if (!facility.coordinates) return false

      const distance =
        Math.sqrt(
          Math.pow(facility.coordinates.lat - lat, 2) + Math.pow(facility.coordinates.lng - lng, 2),
        ) * 111 // Rough conversion to km

      return distance <= radius
    })

    return {
      success: true,
      data: filtered,
      userLocation: { lat, lng },
      radius,
    }
  }

  // ================================
  // EVENTS METHODS
  // ================================

  // Get all events with pagination
  async getAllEvents(page = 1, limit = 20) {
    await this.ensureDataLoaded()
    await this.delay(600)

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = this.eventsData.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: this.eventsData.length,
        totalPages: Math.ceil(this.eventsData.length / limit),
      },
    }
  }

  // Filter events
  async filterEvents(filters) {
    await this.ensureDataLoaded()
    await this.delay(400)

    let filtered = [...this.eventsData]

    // Filter by country/ethnic group
    if (filters.country) {
      filtered = filtered.filter((event) =>
        event.ethnicTags?.some((tag) => tag.toLowerCase().includes(filters.country.toLowerCase())),
      )
    }

    // Filter by event type
    if (filters.eventType) {
      filtered = filtered.filter(
        (event) => event.type?.toLowerCase() === filters.eventType.toLowerCase(),
      )
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(
        (event) => event.category?.toLowerCase() === filters.category.toLowerCase(),
      )
    }

    // Filter by location (simple address check)
    if (filters.location) {
      filtered = filtered.filter((event) =>
        event.address?.toLowerCase().includes(filters.location.toLowerCase()),
      )
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (event) => event.date && new Date(event.date) >= new Date(filters.dateFrom),
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (event) => event.date && new Date(event.date) <= new Date(filters.dateTo),
      )
    }

    return {
      success: true,
      data: filtered,
      filters: filters,
    }
  }

  // Search events by keyword
  async searchEvents(keyword) {
    await this.ensureDataLoaded()
    await this.delay(300)

    if (!keyword || keyword.trim() === '') {
      return this.getAllEvents()
    }

    const searchTerm = keyword.toLowerCase()
    const filtered = this.eventsData.filter(
      (event) =>
        event.name?.toLowerCase().includes(searchTerm) ||
        event.address?.toLowerCase().includes(searchTerm) ||
        event.type?.toLowerCase().includes(searchTerm) ||
        event.category?.toLowerCase().includes(searchTerm) ||
        event.description?.toLowerCase().includes(searchTerm) ||
        event.ethnicTags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )

    return {
      success: true,
      data: filtered,
      searchTerm: keyword,
    }
  }

  // Get nearby events
  async getNearbyEvents(lat, lng, radius = 5) {
    await this.ensureDataLoaded()
    await this.delay(500)

    // Simple distance calculation (not accurate, just for demo)
    const filtered = this.eventsData.filter((event) => {
      if (!event.coordinates) return false

      const distance =
        Math.sqrt(
          Math.pow(event.coordinates.lat - lat, 2) + Math.pow(event.coordinates.lng - lng, 2),
        ) * 111 // Rough conversion to km

      return distance <= radius
    })

    return {
      success: true,
      data: filtered,
      userLocation: { lat, lng },
      radius,
    }
  }
}

export default new FacilityService()
