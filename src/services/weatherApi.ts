import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const BASE_URL = 'http://api.weatherapi.com/v1'

export interface WeatherResponse {
  location: {
    name: string
    region: string
    country: string
    localtime: string
  }
  current: {
    temp_c: number
    condition: {
      text: string
      icon: string
    }
    wind_kph: number
    humidity: number
    feelslike_c: number
    precip_mm: number
  }
  forecast?: {
    forecastday: {
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          icon: string
        }
      }
      hour: {
        time: string
        temp_c: number
        condition: {
          text: string
          icon: string
        }
      }[]
    }[]
  }
}

export const weatherApi = {
  // Mevcut hava durumu
  getCurrentWeather: async (city: string): Promise<WeatherResponse> => {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: city,
        aqi: 'no'
      }
    })
    return response.data
  },

  // 5 günlük tahmin
  getForecast: async (city: string, days: number = 5): Promise<WeatherResponse> => {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: city,
        days: days,
        aqi: 'no'
      }
    })
    return response.data
  },

  // Şehir arama/otomatik tamamlama
  searchLocations: async (query: string) => {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: query
      }
    })
    return response.data
  }
} 