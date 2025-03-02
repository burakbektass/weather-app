'use client'
import { useState, useEffect } from 'react'
import WeatherCard from './WeatherCard'
import ForecastRow from './ForecastRow'
import SearchBar from './SearchBar'
import Toast from './Toast'
import { useWeather, WeatherData } from '@/hooks/useWeather'
import TemperatureToggle from './TemperatureToggle'
import LoadingScreen from './LoadingScreen'
import WindSpeedToggle from './WindSpeedToggle'
import { useSearchParams, useRouter } from 'next/navigation'
import { sanitizeCity } from '@/utils/urlUtils'

export default function WeatherContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [city, setCity] = useState(() => {
    if (typeof window !== 'undefined') {
      return searchParams?.get('city') || localStorage.getItem('lastSearch') || 'Istanbul'
    }
    return 'Istanbul'
  })
  const [showError, setShowError] = useState(true)
  const [unit, setUnit] = useState<'C' | 'F'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('tempUnit') as 'C' | 'F') || 'C'
    }
    return 'C'
  })
  const [windUnit, setWindUnit] = useState<'KPH' | 'MPH'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('windUnit') as 'KPH' | 'MPH') || 'KPH'
    }
    return 'KPH'
  })
  const { data, isError, error, isLoading } = useWeather(city)
  const [previousData, setPreviousData] = useState<WeatherData | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    localStorage.setItem('lastSearch', city)
  }, [city])

  useEffect(() => {
    localStorage.setItem('tempUnit', unit)
  }, [unit])

  useEffect(() => {
    localStorage.setItem('windUnit', windUnit)
  }, [windUnit])

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

  useEffect(() => {
    if (data || isError) {
      setIsInitialLoad(false)
    }
  }, [data, isError])

  const displayData = data || (isError ? previousData : null)

  const convertTemp = (celsius: number) => {
    return unit === 'C' ? celsius : Math.round(celsius * 9/5 + 32)
  }

  const convertWindSpeed = (kph: number) => {
    return windUnit === 'KPH' ? Math.round(kph) : Math.round(kph * 0.621371)
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

  const handleSearch = (newCity: string) => {
    setCity(newCity)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('city', newCity)
    router.push(`/?${params.toString()}`)
  }

  useEffect(() => {
    const urlCity = searchParams ? searchParams.get('city') : null
    if (urlCity) {
      const sanitizedCity = sanitizeCity(urlCity)
      if (sanitizedCity !== urlCity) {
        const params = new URLSearchParams(searchParams?.toString() || '')
        params.set('city', sanitizedCity)
        router.replace(`/?${params.toString()}`)
      }
    }
  }, [searchParams, router])

  if (isInitialLoad || isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className={`min-h-screen w-full ${
      displayData 
        ? getWeatherBackground(displayData.current.condition.text)
        : 'bg-[url("/rainy.jpg")]'
    } bg-cover bg-center`}>
      <div className="relative h-28 md:h-24">
        <TemperatureToggle unit={unit} onToggle={setUnit} />
        <SearchBar onSearch={handleSearch} />
        <Toast 
          message={error?.message || ''} 
          isVisible={isError && showError} 
          onClose={() => setShowError(false)}
        />
      </div>

      {displayData && (
        <div className="min-h-[calc(100vh-6rem)] w-full p-4 lg:p-8 flex flex-col">
          <div className="flex flex-col lg:flex-row h-full items-center lg:items-end gap-8 lg:gap-0">
            {/* Sol taraf - Ana hava durumu */}
            <div className="w-full lg:w-auto lg:mb-8 lg:ml-8">
              <div className="text-white p-6 rounded-xl bg-black/40 backdrop-blur-2xl shadow-xl 
                            w-full lg:w-auto">
                <h1 className="text-6xl lg:text-8xl font-light mb-3 text-center lg:text-left">
                  {convertTemp(displayData.current.temperature)}°{unit}
                </h1>
                <div className="mb-2 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-medium">
                    {displayData.current.location}
                  </h2>
                  <p className="text-lg lg:text-xl text-white/80">
                    {displayData.current.country}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-base lg:text-lg opacity-80 text-center lg:text-left">
                  <p>{displayData.current.time} | H:{convertTemp(displayData.current.high)}° L:{convertTemp(displayData.current.low)}°</p>
                  <div className="flex items-center justify-center lg:justify-start">
                    <span>Humidity: {displayData.current.humidity}% | Wind: {convertWindSpeed(displayData.current.windSpeed)}</span>
                    <WindSpeedToggle unit={windUnit} onToggle={setWindUnit} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ taraf - Tahminler */}
            <div className="w-full lg:w-[450px] lg:ml-auto flex flex-col gap-6 lg:mr-8">
              {/* Saatlik tahmin */}
              <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-6 shadow-xl overflow-x-auto">
                <div className="flex justify-between text-white gap-[30px] px-4 min-w-[600px] lg:min-w-0">
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

              {/* 5 günlük tahmin */}
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