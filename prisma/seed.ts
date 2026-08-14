import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.booking.deleteMany()
  await prisma.caregiver.deleteMany()
  await prisma.center.deleteMany()
  await prisma.child.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@littlesteps.com',
      passwordHash,
      name: 'System Admin',
      role: 'ADMIN',
    },
  })

  // Create Provider
  const provider = await prisma.user.create({
    data: {
      email: 'provider@littlesteps.com',
      passwordHash,
      name: 'Sarah Provider',
      role: 'PROVIDER',
    },
  })

  // Create Parent
  const parent = await prisma.user.create({
    data: {
      email: 'parent@littlesteps.com',
      passwordHash,
      name: 'Emily Parent',
      role: 'PARENT',
      children: {
        create: [
          { name: 'Emma', ageGroup: 'Toddler (1-3y)' },
          { name: 'Leo', ageGroup: 'Infant (0-1y)' }
        ]
      }
    },
  })

  // Create Centers
  const center1 = await prisma.center.create({
    data: {
      providerId: provider.id,
      name: 'Sunshine Daycare',
      description: 'A nurturing and safe environment for your little ones. Open 24/7.',
      location: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
      capacity: 30,
      priceHourly: 15.0,
      verified: true,
      caregivers: {
        create: [
          { name: 'Sarah J.', bio: 'Lead Teacher with 10 years experience.', certifications: 'CPR, Early Ed' },
          { name: 'Michael T.', bio: 'Night Supervisor.', certifications: 'First Aid, Infant Care' }
        ]
      }
    }
  })

  const center2 = await prisma.center.create({
    data: {
      providerId: provider.id,
      name: 'Little Explorers Academy',
      description: 'Montessori inspired learning environment.',
      location: 'San Jose, CA',
      latitude: 37.3382,
      longitude: -121.8863,
      capacity: 25,
      priceHourly: 12.0,
      verified: true,
      caregivers: {
        create: [
          { name: 'Jessica R.', bio: 'Montessori certified.', certifications: 'CPR, Montessori' }
        ]
      }
    }
  })

  // Create Booking
  await prisma.booking.create({
    data: {
      parentId: parent.id,
      centerId: center1.id,
      startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(new Date().getTime() + 27 * 60 * 60 * 1000), // Tomorrow + 3 hrs
      status: 'APPROVED',
      totalCost: 45.0
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
