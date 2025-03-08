import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { sanitizeCity } from '@/utils/urlUtils'

export function useUrlParams() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const updateCity = useCallback((city: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    const sanitizedCity = sanitizeCity(city)
    params.set('city', sanitizedCity)
    router.push(`/?${params.toString()}`)
  }, [searchParams, router])

  const getCity = useCallback(() => {
    return searchParams ? searchParams.get('city') : null
  }, [searchParams])

  return { updateCity, getCity }
} 