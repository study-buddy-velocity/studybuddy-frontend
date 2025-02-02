import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('info/start')
    }
  }, [router])

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  })

  return { getAuthHeaders }
}