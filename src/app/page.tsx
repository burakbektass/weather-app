'use client'
import { useEffect } from 'react'
import WeatherCard from './components/WeatherCard'
import ForecastRow from './components/ForecastRow'
import SearchBar from './components/SearchBar'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { selectWeather, fetchWeatherData } from '@/redux/features/weatherSlice'

export default function Home() {
  const { current, hourly, daily } = useAppSelector(selectWeather)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // İlk yüklemede İstanbul için hava durumu verilerini getir
    dispatch(fetchWeatherData('Istanbul'))
  }, [dispatch])

  const handleSearch = (query: string) => {
    // İleride API entegrasyonu için burası kullanılacak
    console.log('Searching for:', query)
  }

  return (
    <main className="h-screen w-full bg-[url('/rainy.jpg')] bg-cover bg-center">
      <SearchBar onSearch={handleSearch} />
      <div className="h-screen w-full p-8 flex flex-col gap-4">
        {/* Main Content Layout */}
        <div className="flex h-full">
          {/* Current Weather - Left Side */}
          <div className="self-end mb-8 ml-8">
            <div className="text-white p-6 rounded-xl bg-black/10 backdrop-blur-md inline-block">
              <h1 className="text-8xl font-light mb-3">{current.temperature}°C</h1>
              <h2 className="text-4xl font-medium mb-2">{current.location}</h2>
              <p className="text-lg opacity-80">
                {current.time} | H:{current.high}° L:{current.low}°
              </p>
            </div>
          </div>

          {/* Right Side Forecasts */}
          <div className="ml-auto flex flex-col gap-6 w-[450px] justify-center mr-8">
            {/* Hourly Forecast */}
            <div className="bg-black/10 backdrop-blur-md rounded-xl p-6">
              <div className="flex justify-between text-white gap-[30px] px-4">
                {hourly.map((hour, index) => (
                  <WeatherCard
                    key={index}
                    time={hour.time}
                    temperature={hour.temperature.toString()}
                    icon={hour.icon}
                  />
                ))}
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-black/10 backdrop-blur-md rounded-xl p-6">
              <div className="border-b border-white/20 pb-2 mb-4">
                <h3 className="text-white text-base mb-2">5-Day Forecast</h3>
              </div>
              <div className="text-white px-4 space-y-3">
                {daily.map((day, index) => (
                  <ForecastRow
                    key={index}
                    day={day.day}
                    icon={day.icon}
                    minTemp={day.minTemp.toString()}
                    maxTemp={day.maxTemp.toString()}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
