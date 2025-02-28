import { useQuery } from '@tanstack/react-query'
import { weatherApi, WeatherResponse } from '@/services/weatherApi'
import { useAppDispatch } from '@/redux/hooks'
import { addRecentSearch } from '@/redux/features/weatherSlice'
import { useState } from 'react'

export interface WeatherData {
  current: {
    temperature: number;
    location: string;
    time: string;
    high: number;
    low: number;
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

export function useWeather(city: string) {
  const dispatch = useAppDispatch()
  const [previousData, setPreviousData] = useState<WeatherResponse | null>(null)

  return useQuery<WeatherResponse, Error, WeatherData>({
    queryKey: ['weather', city],
    queryFn: async () => {
      try {
        const data = await weatherApi.getForecast(city)
        if (city.trim()) {
          dispatch(addRecentSearch(city))
          setPreviousData(data)
        }
        return data
      } catch (error: any) {
        throw new Error(
          error.response?.status === 400 || error.response?.status === 404
            ? 'The city you searched for could not be found. Please try another location.'
            : 'An error occurred while fetching weather data. Please try again.'
        )
      }
    },
    enabled: Boolean(city),
    retry: false,
    gcTime: Infinity,
    placeholderData: previousData || undefined,
    select: (data) => ({
      current: {
        temperature: data.current.temp_c,
        location: data.location.name,
        time: data.location.localtime,
        high: data.forecast.forecastday[0].day.maxtemp_c,
        low: data.forecast.forecastday[0].day.mintemp_c,
        condition: data.current.condition
      },
      hourly: data.forecast.forecastday[0].hour
        .filter((hour) => {
          const hourTime = new Date(hour.time)
          const now = new Date()
          return hourTime > now
        })
        .slice(0, 6)
        .map(hour => ({
          time: new Date(hour.time).getHours() + ':00',
          temperature: hour.temp_c,
          icon: hour.condition.icon
        })),
      daily: data.forecast.forecastday.map((day, index) => ({
        day: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        icon: day.day.condition.icon,
        minTemp: Math.round(day.day.mintemp_c),
        maxTemp: Math.round(day.day.maxtemp_c)
      }))
    })
  })
} 