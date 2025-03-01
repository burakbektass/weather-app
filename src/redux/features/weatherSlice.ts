import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface WeatherState {
  recentSearches: string[]
}

const MAX_RECENT_SEARCHES = 5

const initialState: WeatherState = {
  recentSearches: []
}

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload
      // Önce mevcut aramayı listeden kaldır (varsa)
      state.recentSearches = state.recentSearches.filter(item => item !== search)
      // Başa ekle ve son 5 kaydı tut
      state.recentSearches.unshift(search)
      if (state.recentSearches.length > MAX_RECENT_SEARCHES) {
        state.recentSearches = state.recentSearches.slice(0, MAX_RECENT_SEARCHES)
      }
      // LocalStorage'ı güncelle
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(search => search !== action.payload)
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
    },
    initializeFromStorage: (state) => {
      const stored = localStorage.getItem('recentSearches')
      if (stored) {
        state.recentSearches = JSON.parse(stored).slice(0, MAX_RECENT_SEARCHES)
      }
    }
  }
})

export const { addRecentSearch, removeFromHistory, initializeFromStorage } = weatherSlice.actions
export const selectWeather = (state: RootState) => state.weather
export default weatherSlice.reducer 