import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    // Get OTP from store (replace with Redis in production)
    global.otpStore = global.otpStore || new Map()
    const otpData = global.otpStore.get(phone)

    if (!otpData) {
      return NextResponse.json(
        { success: false, error: 'OTP expired or invalid. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      global.otpStore.delete(phone)
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      )
    }

    // Check expiry
    if (new Date() > otpData.expiry) {
      global.otpStore.delete(phone)
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts += 1
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // OTP is valid, activate user and create wallet
    const user = await prisma.$transaction(async (tx) => {
      // Activate user
      const updatedUser = await tx.user.update({
        where: { id: otpData.userId },
        data: { isActive: true }
      })

      // Create wallet for customer
      if (updatedUser.role === 'CUSTOMER') {
        await tx.wallet.create({
          data: {
            userId: updatedUser.id,
            balance: 0
          }
        })
      }

      return updatedUser
    })

    // Clear OTP from store
    global.otpStore.delete(phone)

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      profilePicture: user.profilePicture
    })

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          profilePicture: user.profilePicture
        },
        token
      }
    })

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}