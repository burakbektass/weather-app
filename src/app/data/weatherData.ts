export const weatherData = {
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
  ]
} 