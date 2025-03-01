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

  if (!isVisible || !message) return null

  return (
    <div className={`
      fixed top-8 md:top-6 right-4 md:right-6 z-50 max-w-[90%] md:max-w-none
      animate-[slideIn_0.5s_ease-out,fadeOut_0.5s_ease-in_2.5s]
    `}>
      <div className="bg-red-500 text-white px-6 py-3 rounded-xl 
                    shadow-xl flex items-center gap-3 min-w-[300px] max-w-[480px]">
        <span className="text-sm break-words text-center">{message}</span>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors ml-auto shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast 