export const sanitizeCity = (city: string | null): string => {
  if (!city) return 'Istanbul'
  
  // Sadece harflere, rakamlara, boşluklara ve bazı özel karakterlere izin ver
  const sanitized = city
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .slice(0, 50) // Maksimum uzunluk
  
  return sanitized || 'Istanbul'
} 