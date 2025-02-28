import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { weatherApi, WeatherResponse } from '@/services/weatherApi'
import type { RootState } from '../store'

// Async thunks
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city: string) => {
    const response = await weatherApi.getForecast(city)
    return response
  }
)

export const searchLocations = createAsyncThunk(
  'weather/searchLocations',
  async (query: string) => {
    const response = await weatherApi.searchLocations(query)
    return response
  }
)

// Types
interface WeatherState {
  current: {
    temperature: number
    location: string
    time: string
    high: number
    low: number
    condition: {
      text: string
      icon: string
    }
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
  loading: boolean
  error: string | null
}

// Initial state
const initialState: WeatherState = {
  current: {
    temperature: 0,
    location: "",
    time: "",
    high: 0,
    low: 0,
    condition: {
      text: "",
      icon: ""
    }
  },
  hourly: [],
  daily: [],
  recentSearches: [],
  loading: false,
  error: null
}

// Slice
export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addRecentSearch: (state, action) => {
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter(item => item !== action.payload)
      ].slice(0, 5)
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload
        
        // Current weather
        state.current = {
          temperature: data.current.temp_c,
          location: data.location.name,
          time: data.location.localtime,
          high: data.forecast?.forecastday[0]?.day.maxtemp_c ?? 0,
          low: data.forecast?.forecastday[0]?.day.mintemp_c ?? 0,
          condition: data.current.condition
        }

        // Hourly forecast
        state.hourly = data.forecast?.forecastday[0]?.hour
          .filter((hour) => {
            const hourTime = new Date(hour.time)
            const now = new Date()
            return hourTime > now
          })
          .slice(0, 6) // Gelecek 6 saat
          .map(hour => ({
            time: new Date(hour.time).getHours() + ':00',
            temperature: hour.temp_c,
            icon: hour.condition.icon
          })) ?? []

        // Daily forecast 
        state.daily = data.forecast?.forecastday.map((day, index) => ({
          day: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          icon: day.day.condition.icon,
          minTemp: Math.round(day.day.mintemp_c),
          maxTemp: Math.round(day.day.maxtemp_c)
        })) ?? []
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false
        const errorMessage = action.error.message?.includes('404') || action.error.message?.includes('400')
          ? 'The city you searched for could not be found. Please try another location.'
          : 'An error occurred while fetching weather data. Please try again.'
        state.error = errorMessage
      })
  }
})

// Actions
export const { 
  addRecentSearch,
  clearError
} = weatherSlice.actions

// Selectors
export const selectWeather = (state: RootState) => state.weather

export default weatherSlice.reducer 