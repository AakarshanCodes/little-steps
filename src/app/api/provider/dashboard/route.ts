import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'PROVIDER') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const providerId = session.user.id

    // Fetch the provider's centers
    const centers = await prisma.center.findMany({
      where: { providerId }
    })
    
    const centerIds = centers.map(c => c.id)

    // Fetch all bookings for these centers
    const bookings = await prisma.booking.findMany({
      where: { centerId: { in: centerIds } },
      include: { parent: true, center: true },
      orderBy: { startTime: 'asc' }
    })

    // Calculate basic stats
    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED' || b.status === 'APPROVED')
      .reduce((sum, b) => sum + b.totalCost, 0)
    
    const activeBookings = bookings.filter(b => b.status === 'APPROVED' || b.status === 'PENDING').length

    return NextResponse.json({
      centers,
      bookings,
      stats: {
        totalRevenue,
        activeBookings,
        totalCenters: centers.length
      }
    })
  } catch (error) {
    console.error("Provider Dashboard Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
