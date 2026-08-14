import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // System wide stats
    const totalUsers = await prisma.user.count()
    const totalCentersCount = await prisma.center.count()
    const activeBookingsCount = await prisma.booking.count({
      where: { status: { in: ['APPROVED', 'PENDING'] } }
    })

    // Centers requiring verification
    const unverifiedCenters = await prisma.center.findMany({
      where: { verified: false },
      include: { provider: true }
    })

    // All Users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCenters: totalCentersCount,
        activeBookings: activeBookingsCount
      },
      unverifiedCenters,
      recentUsers
    })
  } catch (error) {
    console.error("Admin Dashboard Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
