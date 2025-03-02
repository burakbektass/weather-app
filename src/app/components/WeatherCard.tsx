'use client'
import { FC } from 'react'

interface WeatherCardProps {
  time: string
  temperature: string
  icon: string
  unit: 'C' | 'F'
}

const WeatherCard: FC<WeatherCardProps> = ({ time, temperature, icon, unit }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm">{time}</span>
      <img src={icon} alt="weather icon" className="w-8 h-8 my-2" />
      <span className="text-sm">{temperature}°{unit}</span>
    </div>
  )
}

export default WeatherCard 