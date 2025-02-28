'use client'
import { FC, useEffect } from 'react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

const Toast: FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className={`
      fixed top-6 right-6 z-50
      animate-[slideIn_0.5s_ease-out,fadeOut_0.5s_ease-in_2.5s]
    `}>
      <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-xl 
                    shadow-lg flex items-center gap-3 min-w-[300px]">
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

export default Toast 