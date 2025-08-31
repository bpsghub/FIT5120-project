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
}

export default new MockFacilityService()
