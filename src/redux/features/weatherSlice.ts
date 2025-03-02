import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface WeatherState {
  recentSearches: string[]
}

const MAX_RECENT_SEARCHES = 5

const getInitialState = (): WeatherState => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('recentSearches')
    return {
      recentSearches: stored ? JSON.parse(stored) : []
    }
  }
  return { recentSearches: [] }
}

export const weatherSlice = createSlice({
  name: 'weather',
  initialState: getInitialState(),
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload
      state.recentSearches = state.recentSearches.filter(item => item !== search)
      state.recentSearches.unshift(search)
      if (state.recentSearches.length > MAX_RECENT_SEARCHES) {
        state.recentSearches = state.recentSearches.slice(0, MAX_RECENT_SEARCHES)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
      }
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(search => search !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
      }
    },
    initializeFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('recentSearches')
        if (stored) {
          state.recentSearches = JSON.parse(stored)
        }
      }
    }
  }
})

export const { addRecentSearch, removeFromHistory, initializeFromStorage } = weatherSlice.actions
export const selectWeather = (state: RootState) => state.weather
export default weatherSlice.reducer 