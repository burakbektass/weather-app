import { useQuery } from '@tanstack/react-query'
import { weatherApi } from '@/services/weatherApi'
import { useAppDispatch } from '@/redux/hooks'
import { addRecentSearch } from '@/redux/features/weatherSlice'
import { useState } from 'react'
import { sanitizeCity } from '@/utils/urlUtils'

export interface WeatherData {
  current: {
    temperature: number;
    location: string;
    country: string;
    time: string;
    high: number;
    low: number;
    humidity: number;    // Nem
    windSpeed: number;   // Rüzgar hızı
    condition: {
      text: string;
      icon: string;
    };
  };
  hourly: Array<{
    time: string;
    temperature: number;
    icon: string;
  }>;
  daily: Array<{
    day: string;
    icon: string;
    minTemp: number;
    maxTemp: number;
  }>;
}

const formatHourlyData = (forecast: any) => {
  const now = new Date()
  const currentHour = now.getHours()
  
  const today = forecast.forecastday[0].hour
  const tomorrow = forecast.forecastday[1].hour
  
  let hourlyData = []
  
  const remainingHoursToday = today.slice(currentHour)
  hourlyData.push(...remainingHoursToday)
  
  if (hourlyData.length < 12) {
    const neededHours = 12 - hourlyData.length
    const tomorrowHours = tomorrow.slice(0, neededHours)
    hourlyData.push(...tomorrowHours)
  }
  
  return hourlyData.slice(0, 12).map((hour: any) => ({
    time: new Date(hour.time).getHours() + ':00',
    temperature: hour.temp_c,
    icon: hour.condition.icon
  }))
}

export const useWeather = (city: string) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: async () => {
      const response = await weatherApi.getForecast(city)
      return {
        current: {
          temperature: response.current.temp_c,
          high: response.forecast.forecastday[0].day.maxtemp_c,
          low: response.forecast.forecastday[0].day.mintemp_c,
          humidity: response.current.humidity,
          windSpeed: response.current.wind_kph,
          condition: response.current.condition,
          location: response.location.name,
          country: response.location.country,
          time: new Date(response.location.localtime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        },
        hourly: formatHourlyData(response.forecast),
        daily: response.forecast.forecastday.map((day: any) => ({
          day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          minTemp: day.day.mintemp_c,
          maxTemp: day.day.maxtemp_c,
          icon: day.day.condition.icon
        }))
      }
    },
    enabled: Boolean(city)
  })
} 