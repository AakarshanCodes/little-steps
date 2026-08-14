import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const centerId = params.id
    const center = await prisma.center.findUnique({
      where: { id: centerId },
      include: {
        caregivers: true,
        provider: {
          select: { name: true, email: true }
        }
      }
    })

    if (!center) {
      return NextResponse.json({ error: "Center not found" }, { status: 404 })
    }

    return NextResponse.json(center)
  } catch (error) {
    console.error("Center Fetch Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
