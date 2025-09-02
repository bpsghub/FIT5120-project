// Simple test to verify facility service works
import fs from 'fs'
import path from 'path'

// Simulate the facility service functionality
class TestFacilityService {
  constructor() {
    this.facilitiesData = null
  }

  async loadData() {
    try {
      const filePath = path.join(process.cwd(), 'public', 'facilities_frontend.json')
      const data = fs.readFileSync(filePath, 'utf8')
      this.facilitiesData = JSON.parse(data)
      console.log('✅ Successfully loaded', this.facilitiesData.length, 'facilities')
      return this.facilitiesData
    } catch (error) {
      console.error('❌ Error loading facilities:', error.message)
      throw error
    }
  }

  async getAllFacilities() {
    if (!this.facilitiesData) {
      await this.loadData()
    }
    return {
      success: true,
      data: this.facilitiesData,
      total: this.facilitiesData.length,
    }
  }

  async searchFacilities(keyword) {
    if (!this.facilitiesData) {
      await this.loadData()
    }

    if (!keyword || keyword.trim() === '') {
      return this.getAllFacilities()
    }

    const searchTerm = keyword.toLowerCase()
    const filtered = this.facilitiesData.filter(
      (facility) =>
        facility.name?.toLowerCase().includes(searchTerm) ||
        facility.address?.toLowerCase().includes(searchTerm) ||
        facility.type?.toLowerCase().includes(searchTerm) ||
        facility.ethnicTags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )

    console.log(`🔍 Search for "${keyword}" found ${filtered.length} results`)
    return {
      success: true,
      data: filtered,
      searchTerm: keyword,
    }
  }
}

// Test the service
async function test() {
  const service = new TestFacilityService()

  try {
    // Test loading all facilities
    console.log('Testing loading all facilities...')
    const allResult = await service.getAllFacilities()
    console.log('All facilities result:', allResult.total)

    // Test searching
    console.log('\nTesting search...')
    const searchResult = await service.searchFacilities('chinese')
    console.log('Chinese facilities:', searchResult.data.length)

    const searchResult2 = await service.searchFacilities('table tennis')
    console.log('Table tennis facilities:', searchResult2.data.length)

    // Test empty search
    const emptySearch = await service.searchFacilities('')
    console.log('Empty search returns:', emptySearch.data.length)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

test()
