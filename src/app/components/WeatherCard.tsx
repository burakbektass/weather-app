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
      <span className="text-xs text-gray-200">{time}</span>
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{temperature}°C</span>
    </div>
  )
}

export default WeatherCard 