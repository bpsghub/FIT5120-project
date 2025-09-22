import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FacilityEvent from '@/views/FacilityEvent.vue'
import LearnEnglish from '@/views/LearnEnglish.vue'
import PassCode from '@/views/PassCode.vue'
import SocialNorms from '@/views/socialNorms.vue'
import MeetingPeople from '@/views/MeetingPeople.vue'
import EatingOut from '@/views/EatingOut.vue'

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
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/facilities',
      name: 'facilities',
      component: FacilityEvent,
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
    {
      path: '/socialnorms',
      name: 'socialnorms',
      component: SocialNorms,
      meta: { requiresAuth: true },
    },
    {
      path: '/socialnorms/meetingpeople',
      name: 'meetingpeople',
      component: MeetingPeople,
      meta: { requiresAuth: true },
    },
    {
      path: '/socialnorms/eatingout',
      name: 'eatingout',
      component: EatingOut,
      meta: { requiresAuth: true },
    },
    {
      path: '/navigatelife',
      name: 'navigatelife',
      component: () => import('../views/NavigateYourLife.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/publicTransportation',
      name: 'publictransportation',
      component: () => import('../views/PublicTransportation.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/grocceriesShopping',
      name: 'grocceriesshopping',
      component: () => import('../views/Grocceries Shopping.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/medicalAttention',
      name: 'medicalattention',
      component: () => import('../views/MedicalAttention.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/passcode')
  } else if (to.name === 'passcode' && isAuthenticated()) {
    next('/')
  } else {
    next()
  }
})

export default router
