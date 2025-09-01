import { ref, computed, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet-routing-machine'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_TILE_URL,
  MAP_ATTRIBUTION,
} from '@/utils/constants.js'

export function useMap() {
  const map = ref(null)
  const mapContainer = ref(null)
  const markersLayer = ref(null)
  const markers = ref([])
  const routingControl = ref(null)
  const userLocationMarker = ref(null)
  const mapLoaded = ref(false)
  const mapLoading = ref(true)
  const userLocation = ref(DEFAULT_MAP_CENTER)
  const userLocationFound = ref(false)
  const showLocationPermission = ref(false)
  const locationError = ref('')

  // Initialize map
  const initializeMap = async (
    items = [],
    activeTab = 'facilities',
    containerId = 'facilityMap',
  ) => {
    await nextTick()

    const container = mapContainer.value || document.getElementById(containerId)
    if (!container) {
      console.error('Map container not found!')
      return false
    }

    // Clean up existing map
    if (map.value) {
      try {
        map.value.remove()
      } catch (error) {
        console.error('Error removing existing map:', error)
      }
      map.value = null
      markersLayer.value = null
      markers.value = []
      mapLoaded.value = false
    }

    try {
      // Clear container
      container.innerHTML = ''

      // Create map
      map.value = L.map(container).setView(
        [userLocation.value.lat, userLocation.value.lng],
        DEFAULT_MAP_ZOOM,
      )

      // Add tile layer
      L.tileLayer(MAP_TILE_URL, {
        attribution: MAP_ATTRIBUTION,
      }).addTo(map.value)

      // Create markers layer
      markersLayer.value = L.layerGroup().addTo(map.value)

      mapLoading.value = false
      mapLoaded.value = true // Invalidate size to ensure proper rendering
      setTimeout(() => {
        if (map.value) {
          map.value.invalidateSize()
        }
      }, 100)

      // Add markers if items provided
      if (items && items.length > 0) {
        addMarkers(items, activeTab)
      }

      return true
    } catch (error) {
      console.error('Error initializing map:', error)
      mapLoading.value = false
      return false
    }
  }

  // Add markers to map
  const addMarkers = (items, activeTab = 'facilities') => {
    if (!map.value || !markersLayer.value) return

    // Clear existing markers
    markersLayer.value.clearLayers()
    markers.value = []

    // Add new markers
    items.forEach((item) => {
      try {
        const marker = createMarker(item, activeTab)
        markersLayer.value.addLayer(marker)
        markers.value.push(marker)
      } catch (error) {
        console.error(`Error creating marker for ${item.name}:`, error)
      }
    })

    // Fit map bounds to show all markers
    if (markers.value.length > 0) {
      try {
        const group = new L.featureGroup(markers.value)
        map.value.fitBounds(group.getBounds().pad(0.1))
      } catch (error) {
        console.error('Error fitting map bounds:', error)
      }
    } else {
      map.value.setView([userLocation.value.lat, userLocation.value.lng], DEFAULT_MAP_ZOOM)
    }

    // Refresh map display
    setTimeout(() => {
      if (map.value) {
        map.value.invalidateSize()
      }
    }, 100)
  }

  // Create marker for item
  const createMarker = (item, activeTab) => {
    const iconColor = getMarkerColor(item.type)
    const iconSymbol = getMarkerSymbol(item.type)

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${iconColor};
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: bold;
        ">
          ${iconSymbol}
        </div>
      `,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    })

    const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: customIcon })
    marker.itemId = item.id

    // Create popup content
    const popupContent =
      activeTab === 'facilities' ? createFacilityPopup(item) : createEventPopup(item)

    marker.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup',
    })

    return marker
  }

  // Get marker color based on type
  const getMarkerColor = (type) => {
    const colors = {
      restaurant: '#e74c3c',
      supermarket: '#27ae60',
      'community center': '#3498db',
      'cultural event': '#9b59b6',
      'food event': '#f39c12',
      workshop: '#16a085',
    }
    return colors[type] || '#95a5a6'
  }

  // Get marker symbol based on type
  const getMarkerSymbol = (type) => {
    const symbols = {
      restaurant: '🍽️',
      supermarket: '🏪',
      'community center': '🏢',
      'cultural event': '🎭',
      'food event': '🍜',
      workshop: '🎨',
    }
    return symbols[type] || '📍'
  }

  // Create facility popup content
  const createFacilityPopup = (facility) => {
    return `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
          ${facility.name}
        </h4>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Type:</strong> ${facility.type}
        </p>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Address:</strong> ${facility.address}
        </p>
        ${
          facility.ethnicTags
            ? `
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
            <strong>Ethnic Tags:</strong> ${facility.ethnicTags.join(', ')}
          </p>
        `
            : ''
        }
        ${
          facility.phone
            ? `
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
            <strong>Phone:</strong> ${facility.phone}
          </p>
        `
            : ''
        }
      </div>
    `
  }

  // Create event popup content
  const createEventPopup = (event) => {
    return `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
          ${event.name}
        </h4>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Type:</strong> ${event.type}
        </p>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}
        </p>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Time:</strong> ${event.time}
        </p>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Price:</strong> ${event.price}
        </p>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
          <strong>Address:</strong> ${event.address}
        </p>
        ${
          event.ethnicTags
            ? `
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
            <strong>Cultural Focus:</strong> ${event.ethnicTags.join(', ')}
          </p>
        `
            : ''
        }
      </div>
    `
  }
  // Clean up map resources
  const cleanup = () => {
    if (routingControl.value && map.value) {
      map.value.removeControl(routingControl.value)
    }
    if (map.value) {
      try {
        map.value.remove()
      } catch (error) {
        console.error('Error cleaning up map:', error)
      }
      map.value = null
      markersLayer.value = null
      markers.value = []
      mapLoaded.value = false
    }
  }

  // Geolocation functions
  const getUserLocation = () => {
    locationError.value = ''

    if (!navigator.geolocation) {
      locationError.value = 'Geolocation is not supported by this browser.'
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        userLocationFound.value = true
        showLocationPermission.value = false
        addUserLocationMarker()
      },
      (error) => {
        console.error('Error getting location:', error)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            locationError.value = 'Location access denied by user.'
            break
          case error.POSITION_UNAVAILABLE:
            locationError.value = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            locationError.value = 'Location request timed out.'
            break
          default:
            locationError.value = 'An unknown error occurred while getting location.'
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const addUserLocationMarker = () => {
    if (!map.value || !userLocationFound.value) return

    if (userLocationMarker.value) {
      map.value.removeLayer(userLocationMarker.value)
    }

    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="
          background-color: #007bff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    userLocationMarker.value = L.marker([userLocation.value.lat, userLocation.value.lng], {
      icon: userIcon,
    }).addTo(map.value)

    userLocationMarker.value.bindPopup('Your Location', {
      className: 'user-location-popup',
    })
  }

  const requestUserLocationForDirections = (item) => {
    if (!userLocationFound.value) {
      showLocationPermission.value = true
    } else {
      showDirections(item)
    }
  }

  const showDirections = (item) => {
    if (!map.value || !userLocationFound.value) return

    if (routingControl.value) {
      map.value.removeControl(routingControl.value)
    }

    routingControl.value = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.value.lat, userLocation.value.lng),
        L.latLng(item.coordinates.lat, item.coordinates.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: function () {
        return null
      },
      lineOptions: {
        styles: [{ color: '#007bff', weight: 6, opacity: 0.8 }],
      },
      show: true,
      showAlternatives: false,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
    }).addTo(map.value)
  }

  const clearDirections = () => {
    if (routingControl.value && map.value) {
      map.value.removeControl(routingControl.value)
      routingControl.value = null
    }
  }

  const closeLocationDialog = () => {
    showLocationPermission.value = false
    locationError.value = ''
  }

  return {
    map: computed(() => map.value),
    mapContainer,
    mapLoaded: computed(() => mapLoaded.value),
    mapLoading: computed(() => mapLoading.value),
    userLocation: computed(() => userLocation.value),
    userLocationFound: computed(() => userLocationFound.value),
    showLocationPermission: computed(() => showLocationPermission.value),
    locationError: computed(() => locationError.value),
    initializeMap,
    addMarkers,
    getUserLocation,
    requestUserLocationForDirections,
    clearDirections,
    closeLocationDialog,
    cleanup,
  }
}
