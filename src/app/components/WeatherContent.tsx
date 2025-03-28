'use client'
import { useState, useEffect, Suspense, lazy, useCallback } from 'react'
import { useWeather, WeatherData } from '@/hooks/useWeather'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useUrlParams } from '@/hooks/useUrlParams'
import { getWeatherBackground } from '@/utils/weatherUtils'
import LoadingScreen from './LoadingScreen'

const WeatherCard = lazy(() => import('./WeatherCard'))
const ForecastRow = lazy(() => import('./ForecastRow'))
const SearchBar = lazy(() => import('./SearchBar'))
const Toast = lazy(() => import('./Toast'))
const TemperatureToggle = lazy(() => import('./TemperatureToggle'))
const WindSpeedToggle = lazy(() => import('./WindSpeedToggle'))

const convertTemp = (celsius: number, unit: 'C' | 'F') => {
  return unit === 'C' ? celsius : Math.round(celsius * 9/5 + 32)
}

const convertWindSpeed = (kph: number, unit: 'KPH' | 'MPH') => {
  return unit === 'KPH' ? Math.round(kph) : Math.round(kph * 0.621371)
}

export default function WeatherContent() {
  const { updateCity, getCity } = useUrlParams()
  const [city, setCity] = useLocalStorage('lastSearch', 'Istanbul')
  const [unit, setUnit] = useLocalStorage<'C' | 'F'>('tempUnit', 'C')
  const [windUnit, setWindUnit] = useLocalStorage<'KPH' | 'MPH'>('windUnit', 'KPH')
  
  const [showError, setShowError] = useState(true)
  const [previousData, setPreviousData] = useState<WeatherData | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const { data, isError, error, isLoading } = useWeather(city)

  const handleSearch = useCallback((newCity: string) => {
    setCity(newCity)
    updateCity(newCity)
  }, [setCity, updateCity])

  useEffect(() => {
    const urlCity = getCity()
    if (urlCity && urlCity !== city) {
      setCity(urlCity)
    }
  }, [getCity, city, setCity])

  useEffect(() => {
    if (isError) setShowError(true)
  }, [isError])

  useEffect(() => {
    if (data && !isError) setPreviousData(data)
    if (data || isError) setIsInitialLoad(false)
  }, [data, isError])

  const displayData = data || (isError ? previousData : null)

  const handleTempConvert = useCallback((celsius: number) => (
    convertTemp(celsius, unit)
  ), [unit])

  const handleWindConvert = useCallback((kph: number) => (
    convertWindSpeed(kph, windUnit)
  ), [windUnit])

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
        <Suspense 
          fallback={
            <div className="absolute right-20 top-8 z-10">
              <div className="flex items-center bg-black/40 backdrop-blur-lg rounded-lg p-1.5 shadow-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white/20 rounded flex items-center justify-center">
                    <div className="w-5 h-5 bg-white/30 rounded-sm" />
                  </div>
                  <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center">
                    <div className="w-5 h-5 bg-white/20 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <TemperatureToggle unit={unit} onToggle={setUnit} />
        </Suspense>
        <Suspense 
          fallback={
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-md">
              <div className="mx-4 h-12 bg-white/10 backdrop-blur-lg rounded-xl animate-pulse flex items-center px-4">
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="ml-3 h-4 w-32 bg-white/20 rounded" />
              </div>
            </div>
          }
        >
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
            <div className="w-full lg:w-auto lg:mb-8 lg:ml-8">
              <Suspense
                fallback={
                  <div className="text-white p-6 rounded-xl bg-black/40 backdrop-blur-2xl shadow-xl w-full lg:w-auto animate-pulse">
                    <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-3">
                      <div className="h-14 w-32 bg-white/10 rounded" />
                      <div className="h-5 w-20 bg-white/10 rounded" />
                    </div>
                    <div className="mb-2 text-center lg:text-left">
                      <div className="h-8 w-40 bg-white/10 rounded mb-2" />
                      <div className="h-6 w-24 bg-white/10 rounded" />
                    </div>
                    <div className="flex flex-col gap-1 opacity-80 text-center lg:text-left">
                      <div className="h-5 w-64 bg-white/10 rounded" />
                      <div className="h-5 w-48 bg-white/10 rounded" />
                    </div>
                  </div>
                }
              >
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
              </Suspense>
            </div>

            <div className="w-full lg:w-[450px] lg:ml-auto flex flex-col gap-6 lg:mr-8">
              <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-4 shadow-xl relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-full 
                  bg-gradient-to-l from-black/20 to-transparent pointer-events-none rounded-r-xl" 
                />
                
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  <div className="flex justify-between mx-5 py-2 min-w-[900px] lg:min-w-full">
                    {displayData.hourly.map((hour:any, index: number) => (
                      <Suspense 
                        key={index} 
                        fallback={
                          <div className="mx-2 flex flex-col items-center animate-pulse">
                            <div className="h-4 w-8 bg-white/10 rounded mb-2" />
                            <div className="w-10 h-10 rounded-full bg-white/10 my-2" />
                            <div className="h-4 w-12 bg-white/10 rounded" />
                          </div>
                        }
                      >
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

              <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-6 shadow-xl">
                <div className="border-b border-white/20 pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white text-base mb-2">3-Day Forecast</h3>
                    <div className="group relative -mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80 cursor-pointer hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block w-72 z-50">
                        <div className="bg-black/95 text-white text-sm rounded-lg p-3 text-center shadow-xl border border-white/10">
                          Due to API free trial limitations, we currently show 3-day forecast. The app supports up to 5-day forecasts with the full API version.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-white px-4 space-y-3">
                  {displayData.daily.map((day:any, index: number) => (
                    <Suspense 
                      key={index} 
                      fallback={
                        <div className="flex items-center justify-between animate-pulse">
                          <div className="w-[100px]">
                            <div className="h-4 w-16 bg-white/10 rounded" />
                          </div>
                          <div className="w-[50px] flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/10" />
                          </div>
                          <div className="w-[150px] flex justify-end">
                            <div className="h-4 w-24 bg-white/10 rounded" />
                          </div>
                        </div>
                      }
                    >
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