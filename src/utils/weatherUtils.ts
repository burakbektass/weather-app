export const convertTemp = (celsius: number, unit: 'C' | 'F') => {
  return unit === 'C' ? celsius : Math.round(celsius * 9/5 + 32)
}

export const convertWindSpeed = (kph: number, unit: 'KPH' | 'MPH') => {
  return unit === 'KPH' ? Math.round(kph) : Math.round(kph * 0.621371)
}

export const getWeatherBackground = (condition: string): string => {
  const lowerCondition = condition.toLowerCase()
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return 'rainy'
  }
  if (lowerCondition.includes('snow')) {
    return 'snowy'
  }
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return 'cloudy'
  }
  return 'sunny'
} 