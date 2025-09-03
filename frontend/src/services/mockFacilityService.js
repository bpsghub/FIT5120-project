// Mock data for testing without backend
const mockFacilities = [
  {
    id: 1,
    name: 'Golden Dragon Restaurant',
    type: 'restaurant',
    address: '123 Collins Street, Melbourne VIC 3000',
    coordinates: { lat: -37.8136, lng: 144.9631 },
    ethnicTags: ['Chinese', 'Asian'],
    phone: '03 9123 4567',
    rating: 4.5,
    image:
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/24/a2/0b/golden-dragon-restaurant.jpg?w=900&h=500&s=1',
  },
  {
    id: 2,
    name: 'Pho Saigon',
    type: 'restaurant',
    address: '456 Chapel Street, Richmond VIC 3121',
    coordinates: { lat: -37.8226, lng: 144.9958 },
    ethnicTags: ['Vietnamese', 'Asian'],
    phone: '03 9456 7890',
    rating: 4.2,
    image:
      'https://www.phosaigoncabramatta.com.au/wp-content/uploads/2018/07/pho-saigon-welcome1.jpg',
  },
  {
    id: 3,
    name: 'Asian Grocery Mart',
    type: 'supermarket',
    address: '789 Swanston Street, Carlton VIC 3053',
    coordinates: { lat: -37.8014, lng: 144.9658 },
    ethnicTags: ['Chinese', 'Vietnamese', 'Korean'],
    phone: '03 9789 0123',
    rating: 4.0,
    image:
      'https://static.wixstatic.com/media/ee01dd_47af70c1191e4b7985faf84e98fe106e~mv2.jpg/v1/fill/w_640,h_688,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ee01dd_47af70c1191e4b7985faf84e98fe106e~mv2.jpg',
  },
  {
    id: 4,
    name: 'Vietnamese Community Center',
    type: 'community center',
    address: '321 Victoria Street, West Melbourne VIC 3003',
    coordinates: { lat: -37.8076, lng: 144.94 },
    ethnicTags: ['Vietnamese'],
    phone: '03 9321 4567',
    rating: 4.8,
    image:
      'https://media2.architecturemedia.net/site_media/media/cache/4e/70/4e7012e165a3360054ac70d61d5510a1.jpg',
  },
  {
    id: 5,
    name: 'Warung Indonesian',
    type: 'restaurant',
    address: '654 Lygon Street, Carlton VIC 3053',
    coordinates: { lat: -37.8014, lng: 144.9658 },
    ethnicTags: ['Indonesian', 'Asian'],
    phone: '03 9654 3210',
    rating: 4.3,
    image: 'https://www.livingthedreamrtw.com/wp-content/uploads/2015/01/IMG_8264-600x400.jpg',
  },
  {
    id: 6,
    name: 'China Town Supermarket',
    type: 'supermarket',
    address: '111 Little Bourke Street, Melbourne VIC 3000',
    coordinates: { lat: -37.8136, lng: 144.9631 },
    ethnicTags: ['Chinese'],
    phone: '03 9111 2233',
    rating: 4.1,
    image: 'https://www.okchinatownsupermarket.com/images/cs-building.jpg',
  },
]

// Mock events data
const mockEvents = [
  {
    id: 101,
    name: 'Chinese New Year Festival',
    type: 'cultural event',
    category: 'festival',
    address: 'Federation Square, Melbourne VIC 3000',
    coordinates: { lat: -37.8179, lng: 144.969 },
    ethnicTags: ['Chinese', 'Asian'],
    date: '2025-01-25',
    time: '10:00 AM - 8:00 PM',
    price: 'Free',
    rating: 4.8,
    description:
      'Celebrate Chinese New Year with traditional performances, food stalls, and cultural activities.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn_PPzmxvFRpN_2QTghlhquE92PQGu0kT2Yg&s',
  },
  {
    id: 102,
    name: 'Vietnamese Food Festival',
    type: 'food event',
    category: 'festival',
    address: 'Victoria Street, Richmond VIC 3121',
    coordinates: { lat: -37.8226, lng: 144.9958 },
    ethnicTags: ['Vietnamese', 'Asian'],
    date: '2025-02-15',
    time: '12:00 PM - 9:00 PM',
    price: '$10 entry',
    rating: 4.6,
    description:
      'Experience authentic Vietnamese cuisine with food stalls, cooking demonstrations, and live music.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Lq8wRI_VM5A1g_HsuXlL5DFxVhE2jqwTGg&s',
  },
  {
    id: 103,
    name: 'Korean Cultural Workshop',
    type: 'workshop',
    category: 'educational',
    address: '200 Spencer Street, Melbourne VIC 3000',
    coordinates: { lat: -37.8183, lng: 144.9648 },
    ethnicTags: ['Korean', 'Asian'],
    date: '2025-03-01',
    time: '2:00 PM - 5:00 PM',
    price: '$25 per person',
    rating: 4.7,
    description:
      'Learn traditional Korean arts including calligraphy, paper folding, and traditional music.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDipAQAKnHZ4-d3D3pCxEsaU0FGHfPf5vGcw&s',
  },
  {
    id: 104,
    name: 'Indonesian Market Day',
    type: 'cultural event',
    category: 'market',
    address: 'Carlton Gardens, Carlton VIC 3053',
    coordinates: { lat: -37.8014, lng: 144.9658 },
    ethnicTags: ['Indonesian', 'Asian'],
    date: '2025-03-10',
    time: '9:00 AM - 4:00 PM',
    price: 'Free entry',
    rating: 4.4,
    description:
      'Discover Indonesian culture through traditional crafts, spices, textiles, and authentic food.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwIRaoed0MLT-T3m9krO-eDhlmfV9V2RRsiQ&s',
  },
  {
    id: 105,
    name: 'Thai Cooking Class',
    type: 'workshop',
    category: 'educational',
    address: '145 Collins Street, Melbourne VIC 3000',
    coordinates: { lat: -37.8136, lng: 144.9631 },
    ethnicTags: ['Thai', 'Asian'],
    date: '2025-03-20',
    time: '6:00 PM - 9:00 PM',
    price: '$75 per person',
    rating: 4.9,
    description:
      'Learn to cook authentic Thai dishes with a professional chef in this hands-on cooking class.',
    image:
      'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/xmwwncqy1bityhs7kulv/ThaiAkhaKitchenCookingClassLocalMarketTourinChiangMai,Thailand-KlookAustralia.jpg',
  },
  {
    id: 106,
    name: 'Japanese Cherry Blossom Festival',
    type: 'cultural event',
    category: 'festival',
    address: 'Royal Botanic Gardens, Melbourne VIC 3004',
    coordinates: { lat: -37.8304, lng: 144.9803 },
    ethnicTags: ['Japanese', 'Asian'],
    date: '2025-04-05',
    time: '10:00 AM - 6:00 PM',
    price: 'Free',
    rating: 4.8,
    description:
      'Celebrate the beauty of cherry blossoms with traditional Japanese performances and tea ceremonies.',
    image:
      'https://res.cloudinary.com/enchanting/f_auto,q_70,w_900,h_490,c_fill/et-web/2019/03/Himeji-Castle.jpg',
  },
]

class MockFacilityService {
  // Simulate API delay
  delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Get all facilities with pagination
  async getAllFacilities(page = 1, limit = 20) {
    await this.delay(800)

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = mockFacilities.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockFacilities.length,
        totalPages: Math.ceil(mockFacilities.length / limit),
      },
    }
  }

  // Filter facilities
  async filterFacilities(filters) {
    await this.delay(600)

    let filtered = [...mockFacilities]

    // Filter by country/ethnic group
    if (filters.country) {
      filtered = filtered.filter((facility) =>
        facility.ethnicTags.some((tag) =>
          tag.toLowerCase().includes(filters.country.toLowerCase()),
        ),
      )
    }

    // Filter by category/type
    if (filters.category) {
      filtered = filtered.filter(
        (facility) => facility.type.toLowerCase() === filters.category.toLowerCase(),
      )
    }

    // Filter by location (simple postcode check)
    if (filters.location) {
      filtered = filtered.filter((facility) =>
        facility.address.toLowerCase().includes(filters.location.toLowerCase()),
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
    await this.delay(500)

    if (!keyword || keyword.trim() === '') {
      return this.getAllFacilities()
    }

    const searchTerm = keyword.toLowerCase()
    const filtered = mockFacilities.filter(
      (facility) =>
        facility.name.toLowerCase().includes(searchTerm) ||
        facility.address.toLowerCase().includes(searchTerm) ||
        facility.type.toLowerCase().includes(searchTerm) ||
        facility.ethnicTags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )

    return {
      success: true,
      data: filtered,
      searchTerm: keyword,
    }
  }

  // Get nearby facilities
  async getNearbyFacilities(lat, lng, radius = 5) {
    await this.delay(700)

    // Simple distance calculation (not accurate, just for demo)
    const filtered = mockFacilities.filter((facility) => {
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
    await this.delay(800)

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = mockEvents.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockEvents.length,
        totalPages: Math.ceil(mockEvents.length / limit),
      },
    }
  }

  // Filter events
  async filterEvents(filters) {
    await this.delay(600)

    let filtered = [...mockEvents]

    // Filter by country/ethnic group
    if (filters.country) {
      filtered = filtered.filter((event) =>
        event.ethnicTags.some((tag) => tag.toLowerCase().includes(filters.country.toLowerCase())),
      )
    }

    // Filter by event type
    if (filters.eventType) {
      filtered = filtered.filter(
        (event) => event.type.toLowerCase() === filters.eventType.toLowerCase(),
      )
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(
        (event) => event.category.toLowerCase() === filters.category.toLowerCase(),
      )
    }

    // Filter by location (simple postcode check)
    if (filters.location) {
      filtered = filtered.filter((event) =>
        event.address.toLowerCase().includes(filters.location.toLowerCase()),
      )
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((event) => new Date(event.date) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filtered = filtered.filter((event) => new Date(event.date) <= new Date(filters.dateTo))
    }

    return {
      success: true,
      data: filtered,
      filters: filters,
    }
  }

  // Search events by keyword
  async searchEvents(keyword) {
    await this.delay(500)

    if (!keyword || keyword.trim() === '') {
      return this.getAllEvents()
    }

    const searchTerm = keyword.toLowerCase()
    const filtered = mockEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm) ||
        event.address.toLowerCase().includes(searchTerm) ||
        event.type.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.ethnicTags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )

    return {
      success: true,
      data: filtered,
      searchTerm: keyword,
    }
  }

  // Get nearby events
  async getNearbyEvents(lat, lng, radius = 5) {
    await this.delay(700)

    // Simple distance calculation (not accurate, just for demo)
    const filtered = mockEvents.filter((event) => {
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

export default new MockFacilityService()
