import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FacilityEvent from '@/views/FacilityEvent.vue'
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
      path: '/FacilityEvent',
      name: 'facilityevent',
      component: FacilityEvent,
      meta: { requiresAuth: true },
    },
    {
      path: '/learnenglish',
      name: 'learnenglish',
      component: LearnEnglish,
      meta: { requiresAuth: true },
    },
    {
      path: '/flashcards/:category/:language',
      name: 'flashcards',
      component: () => import('../views/FlashcardsView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
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
