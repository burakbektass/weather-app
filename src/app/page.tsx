import WeatherContent from './components/WeatherContent'

export const dynamic = 'force-static'
export const revalidate = 3600 // 1 saat

export default function Home() {
  return <WeatherContent />
}
