import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: "Unauthorized. Only parents can book." }, { status: 401 })
    }

    const { centerId, childName, ageGroup, specialNeeds, date, time, planType } = await request.json()

    if (!centerId || !childName || !date || !time) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 })
    }

    // Combine date and time into a DateTime object
    const startDateTime = new Date(`${date}T${time}`)
    
    // Calculate end time based on plan (simplified logic)
    let durationHours = 3 // default hourly
    if (planType === 'Daily') durationHours = 10
    if (planType === 'Monthly') durationHours = 160 // mock full month

    const endDateTime = new Date(startDateTime.getTime() + durationHours * 60 * 60 * 1000)

    // First ensure the child exists for this parent
    let child = await prisma.child.findFirst({
      where: { name: childName, parentId: session.user.id }
    })

    if (!child) {
      child = await prisma.child.create({
        data: {
          name: childName,
          ageGroup: ageGroup || 'Toddler (1-3y)',
          specialNeeds,
          parentId: session.user.id
        }
      })
    }

    // Get center to calculate cost
    const center = await prisma.center.findUnique({ where: { id: centerId }})
    const totalCost = center ? center.priceHourly * durationHours : 45.0

    const booking = await prisma.booking.create({
      data: {
        parentId: session.user.id,
        centerId,
        startTime: startDateTime,
        endTime: endDateTime,
        totalCost,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = session.user.role

    if (role === 'PARENT') {
      const bookings = await prisma.booking.findMany({
        where: { parentId: session.user.id },
        include: { center: true },
        orderBy: { startTime: 'asc' }
      })
      return NextResponse.json(bookings)
    } else if (role === 'PROVIDER') {
       const userWithCenters = await prisma.user.findUnique({
         where: { id: session.user.id },
         include: { centers: true }
       })
       const centerIds = userWithCenters?.centers.map(c => c.id) || []
       
       const bookings = await prisma.booking.findMany({
         where: { centerId: { in: centerIds } },
         include: { parent: true, center: true },
         orderBy: { startTime: 'asc' }
       })
       return NextResponse.json(bookings)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
