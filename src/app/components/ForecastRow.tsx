'use client'
import { FC } from 'react'

interface ForecastRowProps {
  day: string
  icon: string
  minTemp: string
  maxTemp: string
}

const ForecastRow: FC<ForecastRowProps> = ({ day, icon, minTemp, maxTemp }) => {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="w-16 text-gray-200 text-sm">{day}</span>
      <span className="text-xl">{icon}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-200 text-xs">{minTemp}°C</span>
        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-red-400 rounded"></div>
        <span className="text-xs">{maxTemp}°C</span>
      </div>
    </div>
  )
}

export default ForecastRow 