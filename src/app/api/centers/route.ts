import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const minLat = searchParams.get('minLat')
    const maxLat = searchParams.get('maxLat')
    const minLng = searchParams.get('minLng')
    const maxLng = searchParams.get('maxLng')

    let whereClause = {}

    if (minLat && maxLat && minLng && maxLng) {
      whereClause = {
        latitude: {
          gte: parseFloat(minLat),
          lte: parseFloat(maxLat),
        },
        longitude: {
          gte: parseFloat(minLng),
          lte: parseFloat(maxLng),
        }
      }
    }

    const centers = await prisma.center.findMany({
      where: whereClause,
      include: {
        caregivers: true
      }
    })
    return NextResponse.json(centers)
  } catch (error) {
    console.error("Error fetching centers:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
