<template>
  <div class="event-detail-page">
    <button @click="$router.go(-1)" class="back-btn">← Back</button>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading event details...</p>
    </div>

    <div v-if="error && !loading" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="loadEventDetail" class="retry-btn">Try Again</button>
    </div>

    <div v-if="!loading && !error && event" class="detail-content">
      <div class="detail-header">
        <div class="header-image">
          <img :src="event.imageUrl || defaultImage" :alt="event.name" />
        </div>

        <div class="header-info">
          <div class="status-container">
            <h1 class="event-name">{{ event.name }}</h1>
            <span class="status-badge" :class="event.isActive ? 'active' : 'inactive'">
              {{ event.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <p class="event-type">{{ event.type }}</p>

          <div class="date-time">
            <p>
              <strong>Dates:</strong> {{ formatDate(event.startDate) }}
              <span v-if="event.endDate">to {{ formatDate(event.endDate) }}</span>
            </p>
            <p>
              <strong>Time:</strong> {{ formatTime(event.startTime) }}
              <span v-if="event.endTime">to {{ formatTime(event.endTime) }}</span>
            </p>
          </div>

          <div class="address">
            <p>{{ event.address }}</p>
          </div>

          <div class="contact-info">
            <p v-if="event.contactPhone">📞 {{ event.contactPhone }}</p>
            <a v-if="event.website" :href="event.website" target="_blank" class="website-link">
              🌐 Event Website
            </a>
          </div>

          <div class="action-buttons">
            <button @click="getDirections" class="directions-btn">
              🧭 Get Directions
            </button>
          </div>
        </div>
      </div>

      <div class="detail-tabs">
        <div class="tab-buttons">
          <button
            @click="activeTab = 'description'"
            :class="['tab-btn', activeTab === 'description' ? 'active' : '']"
          >
            Description
          </button>
          <button
            @click="activeTab = 'details'"
            :class="['tab-btn', activeTab === 'details' ? 'active' : '']"
          >
            Details
          </button>
          <button
            @click="activeTab = 'map'"
            :class="['tab-btn', activeTab === 'map' ? 'active' : '']"
          >
            Map
          </button>
          <button
            @click="activeTab = 'registration'"
            :class="['tab-btn', activeTab === 'registration' ? 'active' : '']"
          >
            Registration
          </button>
        </div>

        <div v-if="activeTab === 'description'" class="tab-content">
          <h3>About This Event</h3>

          <div class="event-description">
            <p>{{ event.description || 'No description available.' }}</p>
          </div>

          <div class="event-highlights" v-if="event.highlights && event.highlights.length">
            <h4>Event Highlights</h4>
            <ul>
              <li v-for="(highlight, index) in event.highlights" :key="index">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="activeTab === 'details'" class="tab-content">
          <h3>Event Details</h3>

          <div class="details-grid">
            <div class="detail-item">
              <strong>Organizer:</strong>
              <p>{{ event.organizer || 'Not available' }}</p>
            </div>

            <div class="detail-item">
              <strong>Category:</strong>
              <p>{{ event.category || 'Not available' }}</p>
            </div>

            <div class="detail-item">
              <strong>Language:</strong>
              <p>{{ event.language || 'English' }}</p>
            </div>

            <div class="detail-item">
              <strong>Price:</strong>
              <p>{{ event.price || 'Free' }}</p>
            </div>

            <div class="detail-item">
              <strong>Capacity:</strong>
              <p>{{ event.capacity ? `${event.attendees || 0}/${event.capacity}` : 'Unlimited' }}</p>
            </div>

            <div class="detail-item">
              <strong>Age Restriction:</strong>
              <p>{{ event.ageRestriction || 'None' }}</p>
            </div>
          </div>

          <div class="special-instructions" v-if="event.specialInstructions">
            <h4>Special Instructions</h4>
            <p>{{ event.specialInstructions }}</p>
          </div>
        </div>

        <div v-if="activeTab === 'map'" class="tab-content">
          <div id="eventMap" class="detail-map"></div>

          <div class="map-actions">
            <button @click="getDirections" class="directions-btn">
              🧭 Get Directions from Your Location
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'registration'" class="tab-content">
          <h3>Register for This Event</h3>

          <div v-if="!event.isActive" class="event-closed">
            <p>This event is no longer accepting registrations.</p>
          </div>

          <form
            v-else
            @submit.prevent="submitRegistration"
            class="registration-form"
          >
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                v-model="registrationData.fullName"
                required
                placeholder="Enter your full name"
              >
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input
                type="email"
                id="email"
                v-model="registrationData.email"
                required
                placeholder="Enter your email address"
              >
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                v-model="registrationData.phone"
                placeholder="Enter your phone number"
              >
            </div>

            <div class="form-group">
              <label for="participants">Number of Participants *</label>
              <input
                type="number"
                id="participants"
                v-model="registrationData.participants"
                min="1"
                value="1"
                required
              >
            </div>

            <div class="form-group">
              <label for="specialNeeds">Special Requirements (Optional)</label>
              <textarea
                id="specialNeeds"
                v-model="registrationData.specialNeeds"
                rows="3"
                placeholder="Please let us know if you have any special requirements"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="submitting">
                {{ submitting ? 'Processing...' : 'Complete Registration' }}
              </button>
            </div>
          </form>

          <div v-if="registrationSuccess" class="registration-success">
            <div class="success-icon">✓</div>
            <h3>Registration Successful!</h3>
            <p>Thank you for registering for {{ event.name }}.</p>
            <p>You will receive a confirmation email shortly.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import eventService from '@/services/eventService'

// State management
const route = useRoute()
const event = ref(null)
const loading = ref(true)
const error = ref('')
const activeTab = ref('description')
const defaultImage = 'https://picsum.photos/800/500?grayscale'
const map = ref(null)
const routingControl = ref(null)

// Registration related
const registrationData = ref({
  fullName: '',
  email: '',
  phone: '',
  participants: 1,
  specialNeeds: ''
})
const submitting = ref(false)
const registrationSuccess = ref(false)

// User location
const userLocation = ref({ lat: -37.8136, lng: 144.9631 })
const userLocationFound = ref(false)

// Load event details
const loadEventDetail = async () => {
  const { id } = route.params
  loading.value = true
  error.value = ''
  registrationSuccess.value = false

  try {
    await getUserLocation()
    const response = await eventService.getEventDetail(id)
    event.value = response.data

    if (event.value.location) {
      setTimeout(() => {
        initializeMap()
      }, 500)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load event details'
    console.error('Error loading event details:', err)
  } finally {
    loading.value = false
  }
}

// Get user location
const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported')
      resolve()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        console.log('User location:', userLocation.value)
        userLocationFound.value = true
        resolve()
      },
      (err) => {
        console.warn('Error getting location:', err)
        resolve()
      }
    )
  })
}

// Initialize map
const initializeMap = async () => {
  await nextTick()

  const mapElement = document.getElementById('eventMap')
  if (!mapElement || !event.value?.location) return

  const L = window.L || $L
  map.value = L.map(mapElement).setView(
    [event.value.location.latitude, event.value.location.longitude],
    16
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)

  // Add event marker
  const eventIcon = L.divIcon({
    className: 'event-marker',
    html: `
      <div style="
        background-color: #9b59b6;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">
        🎉
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })

  L.marker(
    [event.value.location.latitude, event.value.location.longitude],
    { icon: eventIcon }
  ).addTo(map.value)
   .bindPopup(`<b>${event.value.name}</b><br>${event.value.address}`)
   .openPopup()

  // Add user location marker
  if (userLocationFound.value) {
    L.marker([userLocation.value.lat, userLocation.value.lng])
      .addTo(map.value)
      .bindPopup('Your Location')
  }
}

// Get directions
const getDirections = () => {
  if (!map.value || !event.value?.location) return

  if (!userLocationFound.value) {
    getUserLocation().then(() => {
      if (userLocationFound.value) {
        initializeMap()
        drawRoute()
      } else {
        alert('Could not get your location. Please enable location services.')
      }
    })
    return
  }

  drawRoute()
}

// Draw route
const drawRoute = () => {
  if (!map.value) return

  // Clear existing route
  if (routingControl.value) {
    map.value.removeControl(routingControl.value)
  }

  const L = window.L || $L
  routingControl.value = L.Routing.control({
    waypoints: [
      L.latLng(userLocation.value.lat, userLocation.value.lng),
      L.latLng(event.value.location.latitude, event.value.location.longitude)
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    createMarker: () => null,
    lineOptions: {
      styles: [{ color: '#9b59b6', weight: 6, opacity: 0.7 }]
    }
  }).addTo(map.value)
}

// Submit registration
const submitRegistration = async () => {
  const { id } = route.params
  submitting.value = true

  try {
    await eventService.registerForEvent(id, registrationData.value)
    registrationSuccess.value = true
    registrationData.value = {
      fullName: '',
      email: '',
      phone: '',
      participants: 1,
      specialNeeds: ''
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
    console.error('Registration error:', err)
  } finally {
    submitting.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format time
const formatTime = (timeString) => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':')
  const date = new Date()
  date.setHours(hours, minutes)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Component lifecycle
onMounted(() => {
  loadEventDetail()
})

onUnmounted(() => {
  if (routingControl.value && map.value) {
    map.value.removeControl(routingControl.value)
  }
})
</script>

<style scoped>
.event-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.back-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #f0f2f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.back-btn:hover {
  background-color: #e1e4e8;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9b59b6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 30px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  margin: 30px 0;
}

.retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.detail-content {
  margin-bottom: 60px;
}

.detail-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.header-image {
  flex: 0 0 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.header-info {
  flex: 1;
  min-width: 300px;
}

.status-container {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 10px;
}

.event-name {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 5px;
}

.status-badge.active {
  background: #e6f4ea;
  color: #1e7e34;
}

.status-badge.inactive {
  background: #fce8e6;
  color: #c82333;
}

.event-type {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
}

.date-time {
  margin-bottom: 20px;
}

.date-time p {
  margin: 5px 0;
  color: #333;
}

.address {
  margin: 0 0 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  max-width: 600px;
}

.address p {
  margin: 0;
  color: #333;
  line-height: 1.5;
}

.contact-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
}

.contact-info p {
  margin: 0;
  color: #333;
}

.website-link {
  color: #9b59b6;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.website-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.directions-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.directions-btn:hover {
  background: #218838;
}

.detail-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 15px 25px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #9b59b6;
  background: #f8f9fa;
}

.tab-btn.active {
  color: #9b59b6;
  border-bottom-color: #9b59b6;
}

.tab-content {
  padding: 30px;
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.event-description {
  line-height: 1.8;
  color: #555;
  margin-bottom: 30px;
}

.event-highlights {
  margin-top: 30px;
}

.event-highlights h4 {
  margin-bottom: 15px;
  color: #333;
}

.event-highlights ul {
  padding-left: 20px;
  margin: 0;
}

.event-highlights li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.detail-item strong {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.detail-item p {
  margin: 0;
  color: #666;
}

.special-instructions {
  padding: 20px;
  background: #e3f2fd;
  border-radius: 8px;
}

.special-instructions h4 {
  margin-top: 0;
  color: #0d47a1;
}

.detail-map {
  height: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.map-actions {
  text-align: center;
}

.event-closed {
  padding: 20px;
  background: #fce8e6;
  border-radius: 8px;
  color: #c82333;
  text-align: center;
  margin-bottom: 30px;
}

.registration-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.submit-btn {
  background: #9b59b6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #7b1fa2;
}

.submit-btn:disabled {
  background: #ce93d8;
  cursor: not-allowed;
}

.registration-success {
  text-align: center;
  padding: 40px 20px;
  background: #e8f5e9;
  border-radius: 8px;
  color: #2e7d32;
  margin-top: 30px;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.registration-success h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.registration-success p {
  margin: 0 0 10px 0;
}
</style>
