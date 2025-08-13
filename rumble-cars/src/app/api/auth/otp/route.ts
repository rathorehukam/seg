import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyOTP, generateJWT } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()
    
    // Validate input
    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }
    
    // Verify OTP
    if (!verifyOTP(phone, otp)) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        kyc: true,
        wallet: true,
        subscription: {
          include: { plan: true }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Activate user if not already active (for new signups)
    if (!user.isActive) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isActive: true }
      })
    }
    
    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      role: user.role,
      phone: user.phone
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        metaJson: {
          method: 'OTP',
          phone: user.phone
        }
      }
    })
    
    const response = NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        kycStatus: user.kyc?.status || 'PENDING',
        walletBalance: user.wallet?.balance || 0,
        subscription: user.subscription ? {
          id: user.subscription.id,
          planName: user.subscription.plan.name,
          status: user.subscription.status,
          endDate: user.subscription.endDate
        } : null
      }
    })
    
    // Set HTTP-only cookie for web sessions
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    })
    
    return response
    
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}