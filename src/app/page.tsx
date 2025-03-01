'use client'
import { useState, useEffect } from 'react'
import WeatherCard from './components/WeatherCard'
import ForecastRow from './components/ForecastRow'
import SearchBar from './components/SearchBar'
import Toast from './components/Toast'
import { useWeather, WeatherData } from '@/hooks/useWeather'
import TemperatureToggle from './components/TemperatureToggle'

export default function Home() {
  const [city, setCity] = useState('Istanbul')
  const [showError, setShowError] = useState(true)
  const [unit, setUnit] = useState<'C' | 'F'>('C')
  const { data, isError, error } = useWeather(city)
  const [previousData, setPreviousData] = useState<WeatherData | null>(null)

  useEffect(() => {
    if (isError) {
      setShowError(true)
    }
  }, [isError, city])

  useEffect(() => {
    if (data && !isError) {
      setPreviousData(data)
    }
  }, [data, isError])

  const displayData = data || (isError ? previousData : null)

  const convertTemp = (celsius: number) => {
    return unit === 'C' ? celsius : Math.round(celsius * 9/5 + 32)
  }

  const getWeatherBackground = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return 'bg-[url("/rainy.jpg")]'
    }
    if (lowerCondition.includes('snow')) {
      return 'bg-[url("/snowy.jpg")]'
    }
    if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return 'bg-[url("/cloudy.jpg")]'
    }
    return 'bg-[url("/sunny.jpg")]'
  }

  return (
    <main className={`h-screen w-full ${
      displayData 
        ? getWeatherBackground(displayData.current.condition.text)
        : 'bg-[url("/rainy.jpg")]'
    } bg-cover bg-center`}>
      <SearchBar onSearch={setCity} />
      <TemperatureToggle unit={unit} onToggle={setUnit} />
      <Toast 
        message={error?.message || ''} 
        isVisible={isError && showError} 
        onClose={() => setShowError(false)}
      />
      {displayData && (
        <div className="h-screen w-full p-8 flex flex-col gap-4">
          <div className="flex h-full">
            <div className="self-end mb-8 ml-8">
              <div className="text-white p-6 rounded-xl bg-black/40 backdrop-blur-2xl shadow-xl inline-block">
                <h1 className="text-8xl font-light mb-3">
                  {convertTemp(displayData.current.temperature)}°{unit}
                </h1>
                <h2 className="text-4xl font-medium mb-2">{displayData.current.location ?? '--'}</h2>
                <p className="text-lg opacity-80">
                  {displayData.current.time} | H:{convertTemp(displayData.current.high)}° L:{convertTemp(displayData.current.low)}°
                </p>
              </div>
            </div>

            <div className="ml-auto flex flex-col gap-6 w-[450px] justify-center mr-8">
              <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-6 shadow-xl">
                <div className="flex justify-between text-white gap-[30px] px-4">
                  {displayData.hourly.map((hour:any, index: number) => (
                    <WeatherCard
                      key={index}
                      time={hour.time}
                      temperature={convertTemp(hour.temperature).toString()}
                      icon={hour.icon}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-6 shadow-xl">
                <div className="border-b border-white/20 pb-2 mb-4">
                  <h3 className="text-white text-base mb-2">5-Day Forecast</h3>
                </div>
                <div className="text-white px-4 space-y-3">
                  {displayData.daily.map((day:any, index: number) => (
                    <ForecastRow
                      key={index}
                      day={day.day}
                      icon={day.icon}
                      minTemp={convertTemp(day.minTemp).toString()}
                      maxTemp={convertTemp(day.maxTemp).toString()}
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
