'use client'
import { FC } from 'react'

interface WeatherCardProps {
  time: string
  temperature: string
  icon: string
}

const WeatherCard: FC<WeatherCardProps> = ({ time, temperature, icon }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm text-gray-200">{time}</span>
      <img src={icon} alt="weather" className="w-8 h-8" />
      <span className="text-base font-medium">{Math.round(Number(temperature))}°C</span>
    </div>
  )
}

export default WeatherCard 