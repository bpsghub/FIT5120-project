import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Facility_Event from '@/views/Facility_Event.vue'
import FacilityDetailPage from '@/views/FacilityDetailPage.vue'
import EventDetailPage from '@/views/EventDetailPage.vue'
import LearnEnglish from '@/views/LearnEnglish.vue'
import PassCode from '@/views/PassCode.vue'

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/passcode',
      name: 'passcode',
      component: PassCode,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
<<<<<<< HEAD:frontend/src/router/index.js
      path: '/FindFacility_Event',
      name: '/facility_event',
      component: Facility_Event,
=======
      path: '/FacilityEvent',
      name: 'facilityevent',
      component: FacilityEvent,
      meta: { requiresAuth: true },
>>>>>>> 2f0264ad6c7a38531a5e4c8d888f46df9399da5a:src/router/index.js
    },
      { path: '/facility/:id', name: 'FacilityDetail', component: FacilityDetailPage, props: true },
  { path: '/event/:id', name: 'EventDetail', component: EventDetailPage, props: true },
    {
      path: '/learnenglish',
      name: '/learn_english',
      component: LearnEnglish,
      meta: { requiresAuth: true },
    },
<<<<<<< HEAD:frontend/src/router/index.js
=======
    {
      path: '/flashcards/:category/:language',
      name: 'flashcards',
      component: () => import('../views/FlashcardsView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
>>>>>>> 2f0264ad6c7a38531a5e4c8d888f46df9399da5a:src/router/index.js
  ],
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/passcode')
  }
  // If user is authenticated and trying to access passcode page, redirect to home
  else if (to.name === 'passcode' && isAuthenticated()) {
    next('/')
  }
  // Otherwise, proceed normally
  else {
    next()
  }
})

export default router
