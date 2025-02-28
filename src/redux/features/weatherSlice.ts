import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Types
interface WeatherState {
  current: {
    temperature: number
    location: string
    time: string
    high: number
    low: number
  }
  hourly: {
    time: string
    temperature: number
    icon: string
  }[]
  daily: {
    day: string
    icon: string
    minTemp: number
    maxTemp: number
  }[]
  recentSearches: string[]
}

// Initial state
const initialState: WeatherState = {
  current: {
    temperature: 17,
    location: "Manchester",
    time: "12:27",
    high: 27,
    low: 12
  },
  hourly: [
    { time: "Now", temperature: 17, icon: "🌧" },
    { time: "13:00", temperature: 18, icon: "⛈" },
    { time: "14:00", temperature: 19, icon: "⛈" },
    { time: "15:00", temperature: 20, icon: "⛈" },
    { time: "16:00", temperature: 19, icon: "🌥" },
    { time: "17:00", temperature: 18, icon: "⛅" }
  ],
  daily: [
    { day: "Today", icon: "🌧", minTemp: 12, maxTemp: 27 },
    { day: "Thu", icon: "🌧", minTemp: 14, maxTemp: 25 },
    { day: "Fri", icon: "🌥", minTemp: 15, maxTemp: 28 },
    { day: "Sat", icon: "⛅", minTemp: 13, maxTemp: 24 },
    { day: "Sun", icon: "🌥", minTemp: 16, maxTemp: 29 }
  ],
  recentSearches: []
}

// Slice
export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData: (state, action: PayloadAction<WeatherState>) => {
      state.current = action.payload.current
      state.hourly = action.payload.hourly
      state.daily = action.payload.daily
    },
    updateCurrentWeather: (state, action: PayloadAction<WeatherState['current']>) => {
      state.current = action.payload
    },
    updateHourlyForecast: (state, action: PayloadAction<WeatherState['hourly']>) => {
      state.hourly = action.payload
    },
    updateDailyForecast: (state, action: PayloadAction<WeatherState['daily']>) => {
      state.daily = action.payload
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload
      state.recentSearches = [
        search,
        ...state.recentSearches.filter(item => item !== search)
      ].slice(0, 5)
    }
  }
})

// Actions
export const { 
  setWeatherData, 
  updateCurrentWeather, 
  updateHourlyForecast, 
  updateDailyForecast,
  addRecentSearch 
} = weatherSlice.actions

// Selectors
export const selectWeather = (state: RootState) => state.weather

export default weatherSlice.reducer 