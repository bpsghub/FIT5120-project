import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/passcode')
  }

  const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true'
  }

  return {
    logout,
    isAuthenticated,
  }
}
