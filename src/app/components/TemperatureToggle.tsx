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
          className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-colors ${
            unit === 'C' 
              ? 'bg-white/10 text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          °C
        </button>
        <button
          onClick={() => onToggle('F')}
          className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-colors ${
            unit === 'F' 
              ? 'bg-white/10 text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          °F
        </button>
      </div>
    </div>
  )
}

export default TemperatureToggle 