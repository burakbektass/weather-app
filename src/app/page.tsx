'use client'
import { useState, useEffect } from 'react'
import WeatherCard from './components/WeatherCard'
import ForecastRow from './components/ForecastRow'
import SearchBar from './components/SearchBar'
import Toast from './components/Toast'
import { useWeather, WeatherData } from '@/hooks/useWeather'

export default function Home() {
  const [city, setCity] = useState('Istanbul')
  const [showError, setShowError] = useState(true)
  const { data, isError, error } = useWeather(city)
  const [previousData, setPreviousData] = useState<WeatherData | null>(null)

  useEffect(() => {
    if (data && !isError) {
      setPreviousData(data)
    }
  }, [data, isError])

  const displayData = data || (isError ? previousData : null)

  return (
    <main className="h-screen w-full bg-[url('/rainy.jpg')] bg-cover bg-center">
      <SearchBar onSearch={setCity} />
      <Toast 
        message={error?.message || ''} 
        isVisible={isError && showError} 
        onClose={() => setShowError(false)}
      />
      {displayData && (
        <div className="h-screen w-full p-8 flex flex-col gap-4">
          <div className="flex h-full">
            <div className="self-end mb-8 ml-8">
              <div className="text-white p-6 rounded-xl bg-black/10 backdrop-blur-md inline-block">
                <h1 className="text-8xl font-light mb-3">{displayData.current.temperature ?? '--'}°C</h1>
                <h2 className="text-4xl font-medium mb-2">{displayData.current.location ?? '--'}</h2>
                <p className="text-lg opacity-80">
                  {displayData.current.time ?? '--'} | H:{displayData.current.high ?? '--'}° L:{displayData.current.low ?? '--'}°
                </p>
              </div>
            </div>

            <div className="ml-auto flex flex-col gap-6 w-[450px] justify-center mr-8">
              <div className="bg-black/10 backdrop-blur-md rounded-xl p-6">
                <div className="flex justify-between text-white gap-[30px] px-4">
                  {displayData.hourly.map((hour:any, index: number) => (
                    <WeatherCard
                      key={index}
                      time={hour.time}
                      temperature={hour.temperature.toString()}
                      icon={hour.icon}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-black/10 backdrop-blur-md rounded-xl p-6">
                <div className="border-b border-white/20 pb-2 mb-4">
                  <h3 className="text-white text-base mb-2">5-Day Forecast</h3>
                </div>
                <div className="text-white px-4 space-y-3">
                  {displayData.daily.map((day:any, index: number) => (
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
      )}
    </main>
  )
}
