import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface WeatherState {
  recentSearches: string[]
}

const initialState: WeatherState = {
  recentSearches: [],
}

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addRecentSearch: (state, action) => {
      if (typeof window !== 'undefined') {
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
        state.recentSearches = [
          action.payload,
          ...savedSearches.filter((item: string) => item !== action.payload)
        ].slice(0, 5)
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
      }
    },
    removeFromHistory: (state, action) => {
      state.recentSearches = state.recentSearches.filter(item => item !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
      }
    },
    initializeFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        state.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      }
    }
  }
})

export const { addRecentSearch, removeFromHistory, initializeFromStorage } = weatherSlice.actions
export const selectWeather = (state: RootState) => state.weather
export default weatherSlice.reducer 