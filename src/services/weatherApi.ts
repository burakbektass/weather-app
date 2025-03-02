import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const BASE_URL = 'https://api.weatherapi.com/v1'

export interface WeatherResponse {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    humidity: number;    // Nem
    wind_kph: number;    // Rüzgar hızı
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          icon: string;
        };
      }>;
    }>;
  };
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
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${city}&days=${days}&aqi=no`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? 'The city you searched for could not be found. Please try another location.'
          : 'An error occurred while fetching weather data. Please try again.'
      )
    }

    return response.json()
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