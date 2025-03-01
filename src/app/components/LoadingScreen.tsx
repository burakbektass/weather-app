'use client'
import { FC } from 'react'

const LoadingScreen: FC = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0B4F6C] to-[#01273B] 
                    flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-10 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 
                      border-4 border-sky-200/20 border-t-sky-200 mb-8"></div>
        <p className="text-2xl font-light text-sky-100 tracking-wider animate-pulse">
          Loading weather data...
        </p>
      </div>
    </div>
  )
}

export default LoadingScreen 