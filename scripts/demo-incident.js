#!/usr/bin/env node

// Demo script to create a new incident for testing real-time updates
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createDemoIncident() {
  try {
    // Get a random camera
    const cameras = await prisma.camera.findMany()
    if (cameras.length === 0) {
      console.error('❌ No cameras found. Run npm run db:seed first.')
      return
    }

    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)]
    const types = ['INTRUSION', 'THEFT', 'VIOLENCE', 'SUSPICIOUS_ACTIVITY']
    const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    
    const incident = await prisma.incident.create({
      data: {
        cameraId: randomCamera.id,
        type: types[Math.floor(Math.random() * types.length)],
        description: `Demo incident created at ${new Date().toLocaleString()}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        resolved: false,
        thumbnailUrl: '/api/placeholder/demo-incident-thumb',
        timestamp: new Date(),
      },
      include: {
        camera: true
      }
    })

    console.log('🚨 Created demo incident:')
    console.log(`   ID: ${incident.id}`)
    console.log(`   Type: ${incident.type}`)
    console.log(`   Camera: ${incident.camera.name}`)
    console.log(`   Severity: ${incident.severity}`)
    console.log(`   Description: ${incident.description}`)
    console.log('')
    console.log('Check your dashboard for real-time updates! 🎯')

  } catch (error) {
    console.error('❌ Failed to create demo incident:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoIncident()
