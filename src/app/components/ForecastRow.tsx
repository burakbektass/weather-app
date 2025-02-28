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
    <div className="flex items-center justify-between py-2">
      <span className="w-16 text-gray-200 text-base">{day}</span>
      <img src={icon} alt="weather" className="w-8 h-8" />
      <div className="flex items-center gap-3">
        <span className="text-gray-200 text-sm">{Math.round(Number(minTemp))}°C</span>
        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-red-400 rounded"></div>
        <span className="text-sm">{Math.round(Number(maxTemp))}°C</span>
      </div>
    </div>
  )
}

export default ForecastRow 