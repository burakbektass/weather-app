# 🌦️ Modern Weather App ⛅

A sleek and responsive weather application built with Next.js 14, featuring real-time weather data, hourly forecasts, and a beautiful UI that adapts to current weather conditions. 🎨

![Weather App Screenshot](public/app-screenshot.jpg)

## ✨ Features

- 🌍 **Real-time Weather Data**: Get current weather conditions for any city worldwide
- 🎭 **Dynamic Backgrounds**: Background changes based on current weather (sunny, rainy, cloudy, snowy)
- ⏰ **Hourly Forecast**: View upcoming weather conditions for the next 6 hours
- 📅 **5-Day Forecast**: Plan ahead with a 5-day weather outlook
- 📝 **Search History**: Quick access to your recently searched locations
- 🌡️ **Temperature Units**: Toggle between Celsius and Fahrenheit
- 📱 **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices
- ⚡ **Loading States**: Smooth loading transitions with a custom loading screen
- 🚨 **Error Handling**: User-friendly error messages for failed requests

## 🛠️ Tech Stack

- ⚛️ **Framework**: Next.js 14 with App Router
- 🎨 **Styling**: Tailwind CSS with custom animations
- 📊 **State Management**: Redux Toolkit
- 🔄 **Data Fetching**: TanStack Query (React Query)
- 📘 **TypeScript**: For type safety
- 🌐 **Weather API**: WeatherAPI.com
- 💫 **Icons**: React Icons

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-app.git
```

2. Install dependencies:
```bash
cd weather-app
npm install
```

3. Create a `.env.local` file in the root directory and add your WeatherAPI key:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser 🌐

## 🎨 UI Features

- 🌟 **Glassmorphism Design**: Modern, translucent UI elements
- ✨ **Smooth Animations**: Subtle transitions and loading states
- 🎭 **Weather-based Themes**: Dynamic UI adaptation
- 📱 **Responsive Components**: Optimized for all screen sizes
- 🔍 **Intuitive Search**: With recent searches history
- 🚨 **Error Feedback**: Clear error messages with toast notifications

## 💾 State Management

- 🔄 **Redux Store**: Manages search history and temperature unit preference
- 💿 **Local Storage**: Persists user preferences and recent searches
- ⚡ **React Query**: Handles API data fetching and caching

## 🌐 API Integration

The app uses WeatherAPI.com to fetch:
- 🌡️ Current weather conditions
- ⏰ Hourly forecasts
- 📅 5-day weather predictions
- 📍 Location data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. ⚖️
