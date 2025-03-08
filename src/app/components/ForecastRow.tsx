'use client'
import { FC } from 'react'

interface ForecastRowProps {
  day: string
  icon: string
  minTemp: string
  maxTemp: string
  unit: 'C' | 'F'
}

export default function ForecastRow({ day, icon, minTemp, maxTemp, unit }: ForecastRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="w-[100px] text-sm">{day}</span>
      <div className="w-[50px] flex justify-center">
        <img 
          src={icon} 
          alt="weather icon" 
          className="w-8 h-8 min-w-[32px]"
        />
      </div>
      <div className="w-[150px] text-right">
        <span className="text-sm">
          {maxTemp}°{unit} / {minTemp}°{unit}
        </span>
      </div>
    </div>
  )
} 