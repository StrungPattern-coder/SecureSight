import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Testing auth for:', email)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user || !user.password) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found or no password',
        email 
      })
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    
    return NextResponse.json({ 
      success: isValid, 
      user: {
        email: user.email,
        role: user.role,
        hasPassword: !!user.password
      },
      passwordTest: isValid ? 'MATCH' : 'NO MATCH'
    })
    
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
