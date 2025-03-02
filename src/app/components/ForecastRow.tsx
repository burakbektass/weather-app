'use client'
import { FC } from 'react'

interface ForecastRowProps {
  day: string
  icon: string
  minTemp: string
  maxTemp: string
  unit: 'C' | 'F'
}

const ForecastRow: FC<ForecastRowProps> = ({ day, icon, minTemp, maxTemp, unit }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="w-24">{day}</span>
      <img src={icon} alt="weather icon" className="w-8 h-8" />
      <div className="flex gap-4">
        <span>{maxTemp}°{unit}</span>
        <span className="opacity-50">{minTemp}°{unit}</span>
      </div>
    </div>
  )
}

export default ForecastRow 