import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    
    // Validate input
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        kyc: true,
        wallet: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 404 }
      )
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive. Please complete verification.' },
        { status: 403 }
      )
    }
    
    // Generate OTP
    const otp = generateOTP()
    storeOTP(phone, otp)
    
    // TODO: Send OTP via SMS (integrate with Twilio)
    console.log(`Login OTP for ${phone}: ${otp}`)
    
    return NextResponse.json({
      message: 'OTP sent successfully',
      userId: user.id,
      otpSent: true,
      userInfo: {
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kyc?.status || 'PENDING',
        walletBalance: user.wallet?.balance || 0
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}