export const sanitizeCity = (city: string | null): string => {
  if (!city) return 'Istanbul'
  
  const sanitized = city
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .slice(0, 50)
  
  return sanitized || 'Istanbul'
} 