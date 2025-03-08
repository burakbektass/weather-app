import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key)
      if (!item) return initialValue
      
      try {
        return JSON.parse(item)
      } catch {
        return item as T
      }
    }
    return initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key, value])

  return [value, setValue] as const
} 