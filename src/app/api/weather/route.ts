import { NextResponse } from 'next/server'
import { weatherApi } from '@/services/weatherApi'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json({ error: 'City is required' }, { status: 400 })
  }

  try {
    const data = await weatherApi.getForecast(city)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    )
  }
} 