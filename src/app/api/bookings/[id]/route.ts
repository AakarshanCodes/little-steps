import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== 'PROVIDER') {
      return NextResponse.json({ error: "Unauthorized. Only providers can update bookings." }, { status: 401 })
    }

    const resolvedParams = await params;
    const bookingId = resolvedParams.id;
    const { status } = await request.json()

    if (!['APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 })
    }

    // Verify the booking belongs to a center owned by this provider
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { center: true }
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.center.providerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to update this booking" }, { status: 403 })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
