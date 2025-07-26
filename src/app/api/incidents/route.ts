import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resolved = searchParams.get('resolved')
    
    const incidents = await prisma.incident.findMany({
      where: resolved !== null ? {
        resolved: resolved === 'true'
      } : undefined,
      include: {
        camera: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    return NextResponse.json(incidents)
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}
