'use client'
import { FC, useState, useRef, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { addRecentSearch, fetchWeatherData } from '@/redux/features/weatherSlice'

interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const recentSearches = useAppSelector(state => state.weather.recentSearches)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      try {
        await dispatch(fetchWeatherData(searchQuery)).unwrap()
        dispatch(addRecentSearch(searchQuery))
        setSearchTerm('')
        setIsOpen(false)
        inputRef.current?.blur()
      } catch (error) {
        console.error('Weather data fetch failed:', error)
      }
    }
  }

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[400px]">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-full px-5 py-3 bg-black/10 backdrop-blur-md rounded-xl 
                     text-white placeholder-gray-300 outline-none border border-white/10
                     focus:border-white/30 transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(searchTerm)
            }
          }}
        />
        <button 
          onClick={() => handleSubmit(searchTerm)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 
                     hover:text-white transition-colors"
        >
          <FiSearch size={20} />
        </button>

        {/* Recent Searches Dropdown */}
        {isOpen && recentSearches.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-black/10 backdrop-blur-md 
                       rounded-xl border border-white/10 overflow-hidden"
          >
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  handleSubmit(search)
                }}
                className="w-full px-5 py-3 text-left text-white hover:bg-white/10 
                           transition-colors flex items-center gap-3"
              >
                <FiSearch size={16} className="text-white/70" />
                {search}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar 