import { useQuery } from '@tanstack/react-query'
import { weatherApi } from '@/services/weatherApi'
import { useAppDispatch } from '@/redux/hooks'
import { addRecentSearch } from '@/redux/features/weatherSlice'

export function useWeather(city: string) {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['weather', city],
    queryFn: async () => {
      const data = await weatherApi.getForecast(city)
      if (city.trim()) {
        dispatch(addRecentSearch(city))
      }
      return data
    },
    enabled: Boolean(city),
    retry: false,
    select: (data) => ({
      current: {
        temperature: data.current.temp_c,
        location: data.location.name,
        time: data.location.localtime,
        high: data.forecast?.forecastday[0]?.day.maxtemp_c ?? 0,
        low: data.forecast?.forecastday[0]?.day.mintemp_c ?? 0,
        condition: data.current.condition
      },
      hourly: data.forecast?.forecastday[0]?.hour
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
        })) ?? [],
      daily: data.forecast?.forecastday.map((day, index) => ({
        day: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        icon: day.day.condition.icon,
        minTemp: Math.round(day.day.mintemp_c),
        maxTemp: Math.round(day.day.maxtemp_c)
      })) ?? []
    })
  })
} 