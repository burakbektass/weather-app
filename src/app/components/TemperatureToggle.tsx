'use client'
import { FC } from 'react'

interface TemperatureToggleProps {
  unit: 'C' | 'F'
  onToggle: (unit: 'C' | 'F') => void
}

const TemperatureToggle: FC<TemperatureToggleProps> = ({ unit, onToggle }) => {
  return (
    <div className="absolute top-8 right-4 lg:right-24 z-40">
      <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-1 flex shadow-xl">
        <button
          onClick={() => onToggle('C')}
          className={`relative px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
            unit === 'C' 
              ? 'text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span className="relative z-10">°C</span>
          {unit === 'C' && (
            <div className="absolute inset-0 bg-white/10 rounded-lg transition-all duration-300" />
          )}
        </button>
        <button
          onClick={() => onToggle('F')}
          className={`relative px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
            unit === 'F' 
              ? 'text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span className="relative z-10">°F</span>
          {unit === 'F' && (
            <div className="absolute inset-0 bg-white/10 rounded-lg transition-all duration-300" />
          )}
        </button>
      </div>
    </div>
  )
}

export default TemperatureToggle 