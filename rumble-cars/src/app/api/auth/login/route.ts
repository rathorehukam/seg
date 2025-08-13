import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, generateToken, isValidIndianPhone } from '@/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !isValidIndianPhone(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      )
    }

    // If OTP is provided, verify it
    if (otp) {
      return verifyLoginOTP(phone, otp)
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found. Please sign up first.' },
        { status: 404 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is inactive. Please contact support.' },
        { status: 403 }
      )
    }

    // Generate and send OTP
    const otpCode = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP
    global.otpStore = global.otpStore || new Map()
    global.otpStore.set(phone, {
      otp: otpCode,
      expiry: otpExpiry,
      userId: user.id,
      attempts: 0,
      isLogin: true
    })

    // Send OTP via SMS
    try {
      await sendLoginOTP(phone, otpCode, user.name)
    } catch (smsError) {
      console.error('Failed to send login OTP:', smsError)
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your mobile number',
      data: {
        phone,
        needsOTP: true
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function verifyLoginOTP(phone: string, otp: string) {
  try {
    // Get OTP from store
    global.otpStore = global.otpStore || new Map()
    const otpData = global.otpStore.get(phone)

    if (!otpData || !otpData.isLogin) {
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: otpData.userId }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'User account is inactive' },
        { status: 403 }
      )
    }

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
      message: 'Login successful!',
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

async function sendLoginOTP(phone: string, otp: string, name: string) {
  console.log(`Login SMS to ${phone}: Hi ${name}, your Rumble Cars login code is: ${otp}. Valid for 10 minutes.`)
  return true
}