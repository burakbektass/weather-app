'use client'
import { FC } from 'react'

interface WeatherCardProps {
  time: string
  temperature: string
  icon: string
  unit: 'C' | 'F'
}

export default function WeatherCard({ time, temperature, icon, unit }: WeatherCardProps) {
  return (
    <div className="mx-2 flex flex-col items-center">
      <span className="text-sm text-white/80">{time}</span>
      <img src={icon} alt="weather icon" className="w-10 h-10 my-2" />
      <span className="text-base font-medium text-white">
        {temperature}°{unit}
      </span>
    </div>
  )
}