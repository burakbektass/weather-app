'use client'
import { FC } from 'react'

interface WindSpeedToggleProps {
  unit: 'KPH' | 'MPH'
  onToggle: (unit: 'KPH' | 'MPH') => void
}

const WindSpeedToggle: FC<WindSpeedToggleProps> = ({ unit, onToggle }) => {
  return (
    <div className="inline-flex bg-white/5 rounded-lg p-0.5 ml-2">
      <button
        onClick={() => onToggle('KPH')}
        className={`relative px-2 py-0.5 rounded text-xs transition-all duration-300 ${
          unit === 'KPH' 
            ? 'text-white' 
            : 'text-white/70 hover:text-white'
        }`}
      >
        <span className="relative z-10">km/h</span>
        {unit === 'KPH' && (
          <div className="absolute inset-0 bg-white/10 rounded transition-all duration-300" />
        )}
      </button>
      <button
        onClick={() => onToggle('MPH')}
        className={`relative px-2 py-0.5 rounded text-xs transition-all duration-300 ${
          unit === 'MPH' 
            ? 'text-white' 
            : 'text-white/70 hover:text-white'
        }`}
      >
        <span className="relative z-10">mph</span>
        {unit === 'MPH' && (
          <div className="absolute inset-0 bg-white/10 rounded transition-all duration-300" />
        )}
      </button>
    </div>
  )
}

export default WindSpeedToggle 