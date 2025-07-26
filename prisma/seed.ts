import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create users first
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const operatorUser = await prisma.user.upsert({
    where: { email: 'operator@example.com' },
    update: {},
    create: {
      email: 'operator@example.com',
      name: 'Security Operator',
      password: await bcrypt.hash('operator123', 12),
      role: 'OPERATOR',
    },
  })

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      name: 'Viewer User',
      password: await bcrypt.hash('viewer123', 12),
      role: 'VIEWER',
    },
  })

  console.log(`✅ Created 3 users (admin, operator, viewer)`)

  // Create cameras with better details
  const camera1 = await prisma.camera.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Shop Floor A',
      location: 'Manufacturing Area - East Wing',
      status: 'ACTIVE',
      thumbnailUrl: '/images/camera-placeholder.svg',
      streamUrl: '/videos/camera-1-feed.mp4',
    },
  })

  const camera2 = await prisma.camera.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Vault Security',
      location: 'High Security Vault - Level B2',
      status: 'ACTIVE',
      thumbnailUrl: '/images/camera-placeholder.svg',
      streamUrl: '/videos/camera-2-feed.mp4',
    },
  })

  const camera3 = await prisma.camera.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Main Entrance',
      location: 'Building Main Entrance - Ground Floor',
      status: 'ACTIVE',
      thumbnailUrl: '/images/camera-placeholder.svg',
      streamUrl: '/videos/camera-3-feed.mp4',
    },
  })

  const camera4 = await prisma.camera.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Parking Garage',
      location: 'Underground Parking - Level B1',
      status: 'ACTIVE',
      thumbnailUrl: '/images/camera-placeholder.svg',
      streamUrl: '/videos/camera-4-feed.mp4',
    },
  })

  const cameras = [camera1, camera2, camera3, camera4]
  console.log(`✅ Created ${cameras.length} cameras`)

  // Create 15 diverse incidents across 24 hours
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const incidents = [
    {
      id: 1,
      cameraId: camera3.id,
      type: 'UNAUTHORISED_ACCESS',
      description: 'Individual attempting to access restricted area without proper credentials',
      severity: 'HIGH',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 2 * 60 * 60 * 1000), // 2 AM
    },
    {
      id: 2,
      cameraId: camera2.id,
      type: 'GUN_THREAT',
      description: 'Suspicious object detected that may be a weapon',
      severity: 'CRITICAL',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 3 * 60 * 60 * 1000), // 3 AM
    },
    {
      id: 3,
      cameraId: camera1.id,
      type: 'FACE_RECOGNISED',
      description: 'Known security threat individual detected on premises',
      severity: 'CRITICAL',
      resolved: true,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 5 * 60 * 60 * 1000), // 5 AM
    },
    {
      id: 4,
      cameraId: camera4.id,
      type: 'SUSPICIOUS_ACTIVITY',
      description: 'Vehicle circling parking area multiple times - potential surveillance',
      severity: 'MEDIUM',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 7 * 60 * 60 * 1000), // 7 AM
    },
    {
      id: 5,
      cameraId: camera1.id,
      type: 'THEFT',
      description: 'Individual removing equipment without authorization',
      severity: 'HIGH',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 9 * 60 * 60 * 1000), // 9 AM
    },
    {
      id: 6,
      cameraId: camera3.id,
      type: 'VIOLENCE',
      description: 'Physical altercation detected in main entrance area',
      severity: 'CRITICAL',
      resolved: true,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 10 * 60 * 60 * 1000), // 10 AM
    },
    {
      id: 7,
      cameraId: camera2.id,
      type: 'INTRUSION',
      description: 'Unauthorized entry attempt into vault area',
      severity: 'CRITICAL',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 11 * 60 * 60 * 1000), // 11 AM
    },
    {
      id: 8,
      cameraId: camera4.id,
      type: 'VANDALISM',
      description: 'Property damage detected in parking garage',
      severity: 'MEDIUM',
      resolved: true,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 13 * 60 * 60 * 1000), // 1 PM
    },
    {
      id: 9,
      cameraId: camera1.id,
      type: 'FIRE_HAZARD',
      description: 'Smoke or unusual heat signature detected in manufacturing area',
      severity: 'HIGH',
      resolved: true,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 14 * 60 * 60 * 1000), // 2 PM
    },
    {
      id: 10,
      cameraId: camera3.id,
      type: 'ABANDONED_OBJECT',
      description: 'Unattended suspicious package left near main entrance',
      severity: 'HIGH',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 15 * 60 * 60 * 1000), // 3 PM
    },
    {
      id: 11,
      cameraId: camera2.id,
      type: 'ACCESS_VIOLATION',
      description: 'Multiple failed biometric access attempts to vault',
      severity: 'MEDIUM',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 16 * 60 * 60 * 1000), // 4 PM
    },
    {
      id: 12,
      cameraId: camera4.id,
      type: 'LOITERING',
      description: 'Individual remaining in parking area for extended period',
      severity: 'LOW',
      resolved: true,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 18 * 60 * 60 * 1000), // 6 PM
    },
    {
      id: 13,
      cameraId: camera1.id,
      type: 'EQUIPMENT_MALFUNCTION',
      description: 'Manufacturing equipment showing abnormal behavior',
      severity: 'MEDIUM',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 19 * 60 * 60 * 1000), // 7 PM
    },
    {
      id: 14,
      cameraId: camera3.id,
      type: 'CROWD_FORMATION',
      description: 'Unusual gathering of people detected at entrance',
      severity: 'LOW',
      resolved: true,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 21 * 60 * 60 * 1000), // 9 PM
    },
    {
      id: 15,
      cameraId: camera2.id,
      type: 'PERIMETER_BREACH',
      description: 'Unauthorized crossing of security perimeter detected',
      severity: 'HIGH',
      resolved: false,
      thumbnailUrl: '/images/incident-placeholder.svg',
      timestamp: new Date(startOfDay.getTime() + 23 * 60 * 60 * 1000), // 11 PM
    },
  ]

  // Create all incidents
  for (const incidentData of incidents) {
    await prisma.incident.upsert({
      where: { id: incidentData.id },
      update: {},
      create: incidentData as any,
    })
  }

  console.log(`✅ Created ${incidents.length} incidents across different threat types`)
  console.log('   Incident types: Unauthorised Access, Gun Threat, Face Recognition, Theft, Violence, etc.')
  console.log('   Timeline: Incidents spread across 24-hour period')
  console.log('   Cameras: 4 cameras covering different security zones')

  console.log('🎉 Seed completed successfully!')
  console.log('👤 Demo credentials:')
  console.log('   Admin: admin@example.com / admin123')
  console.log('   Operator: operator@example.com / operator123') 
  console.log('   Viewer: viewer@example.com / viewer123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
