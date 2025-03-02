'use client'
import { useState, useEffect, Suspense, lazy, useCallback } from 'react'
import { useWeather, WeatherData } from '@/hooks/useWeather'
import { useSearchParams, useRouter } from 'next/navigation'
import { sanitizeCity } from '@/utils/urlUtils'
import { getWeatherBackground } from '@/utils/weatherUtils'
import LoadingScreen from './LoadingScreen'

// Lazy loaded components
const WeatherCard = lazy(() => import('./WeatherCard'))
const ForecastRow = lazy(() => import('./ForecastRow'))
const SearchBar = lazy(() => import('./SearchBar'))
const Toast = lazy(() => import('./Toast'))
const TemperatureToggle = lazy(() => import('./TemperatureToggle'))
const WindSpeedToggle = lazy(() => import('./WindSpeedToggle'))

// Fallback components
const CardSkeleton = () => (
  <div className="animate-pulse bg-white/10 rounded-lg h-24 w-16" />
)

const ToggleSkeleton = () => (
  <div className="animate-pulse bg-white/10 rounded-lg h-10 w-20" />
)

// Utility functions
const convertTemp = (celsius: number, unit: 'C' | 'F') => {
  return unit === 'C' ? celsius : Math.round(celsius * 9/5 + 32)
}

const convertWindSpeed = (kph: number, unit: 'KPH' | 'MPH') => {
  return unit === 'KPH' ? Math.round(kph) : Math.round(kph * 0.621371)
}

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

  // Dönüşüm fonksiyonlarını memoize edelim
  const handleTempConvert = useCallback((celsius: number) => {
    return convertTemp(celsius, unit)
  }, [unit])

  const handleWindConvert = useCallback((kph: number) => {
    return convertWindSpeed(kph, windUnit)
  }, [windUnit])

  // URL handling
  const handleSearch = useCallback((newCity: string) => {
    setCity(newCity)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('city', newCity)
    router.push(`/?${params.toString()}`)
  }, [searchParams, router])

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
    <main 
      style={{ 
        backgroundImage: displayData 
          ? `url('/${getWeatherBackground(displayData.current.condition.text)}.jpg')`
          : "url('/rainy.jpg')" 
      }}
      className="min-h-screen w-full bg-cover bg-center"
    >
      <div className="relative h-28 md:h-24">
        <Suspense fallback={<ToggleSkeleton />}>
          <TemperatureToggle unit={unit} onToggle={setUnit} />
        </Suspense>
        <Suspense fallback={<div className="animate-pulse bg-white/10 h-12 rounded-xl" />}>
          <SearchBar onSearch={handleSearch} />
        </Suspense>
        <Suspense fallback={null}>
          <Toast 
            message={error?.message || ''} 
            isVisible={isError && showError} 
            onClose={() => setShowError(false)}
          />
        </Suspense>
      </div>

      {displayData && (
        <div className="min-h-[calc(100vh-6rem)] w-full p-4 lg:p-8 flex flex-col">
          <div className="flex flex-col lg:flex-row h-full items-center lg:items-end gap-8 lg:gap-0">
            {/* Sol taraf - Ana hava durumu */}
            <div className="w-full lg:w-auto lg:mb-8 lg:ml-8">
              <div className="text-white p-6 rounded-xl bg-black/40 backdrop-blur-2xl shadow-xl w-full lg:w-auto">
                <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-3">
                  <h1 className="text-5xl lg:text-6xl font-light">
                    {handleTempConvert(displayData.current.temperature)}°{unit}
                  </h1>
                  <span className="text-sm lg:text-base text-white/70">
                    {displayData.current.condition.text}
                  </span>
                </div>
                <div className="mb-2 text-center lg:text-left">
                  <h2 className="text-2xl lg:text-3xl font-medium">
                    {displayData.current.location}
                  </h2>
                  <p className="text-lg text-white/80">
                    {displayData.current.country}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-base lg:text-lg opacity-80 text-center lg:text-left">
                  <p>{displayData.current.time} | H:{handleTempConvert(displayData.current.high)}° L:{handleTempConvert(displayData.current.low)}°</p>
                  <div className="flex items-center justify-center lg:justify-start">
                    <span>Humidity: {displayData.current.humidity}% | Wind: {handleWindConvert(displayData.current.windSpeed)}</span>
                    <WindSpeedToggle unit={windUnit} onToggle={setWindUnit} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ taraf - Tahminler */}
            <div className="w-full lg:w-[450px] lg:ml-auto flex flex-col gap-6 lg:mr-8">
              {/* Saatlik tahmin */}
              <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-4 shadow-xl relative">
                {/* Scroll göstergesi */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-full 
                  bg-gradient-to-l from-black/20 to-transparent pointer-events-none rounded-r-xl" 
                />
                
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  <div className="flex justify-between mx-5 py-2 min-w-[900px] lg:min-w-full">
                    {displayData.hourly.map((hour:any, index: number) => (
                      <Suspense key={index}>
                        <WeatherCard
                          time={hour.time}
                          temperature={handleTempConvert(hour.temperature).toString()}
                          icon={hour.icon}
                          unit={unit}
                        />
                      </Suspense>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5 günlük tahmin */}
              <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-6 shadow-xl">
                <div className="border-b border-white/20 pb-2 mb-4">
                  <h3 className="text-white text-base mb-2">5-Day Forecast</h3>
                </div>
                <div className="text-white px-4 space-y-3">
                  {displayData.daily.map((day:any, index: number) => (
                    <Suspense key={index} fallback={<div className="animate-pulse bg-white/10 h-12 rounded-lg" />}>
                      <ForecastRow
                        day={day.day}
                        icon={day.icon}
                        minTemp={handleTempConvert(day.minTemp).toString()}
                        maxTemp={handleTempConvert(day.maxTemp).toString()}
                        unit={unit}
                      />
                    </Suspense>
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