import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, generateToken, isValidIndianPhone, isValidEmail } from '@/utils/auth'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, role = 'CUSTOMER' } = body

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters long' },
        { status: 400 }
      )
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!phone || !isValidIndianPhone(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      if (existingUser.phone === phone) {
        return NextResponse.json(
          { success: false, error: 'User with this phone number already exists' },
          { status: 409 }
        )
      }
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user with pending verification
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        phone,
        role: role as UserRole,
        isActive: false // Will be activated after OTP verification
      }
    })

    // Store OTP in a temporary storage (you can use Redis or database)
    // For now, we'll use a simple in-memory store (replace with Redis in production)
    global.otpStore = global.otpStore || new Map()
    global.otpStore.set(phone, {
      otp,
      expiry: otpExpiry,
      userId: user.id,
      attempts: 0
    })

    // Send OTP via SMS (implement with your SMS provider)
    try {
      await sendOTP(phone, otp, name)
    } catch (smsError) {
      console.error('Failed to send OTP:', smsError)
      // Continue with signup but log the error
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your mobile number. Please verify to complete signup.',
      data: {
        userId: user.id,
        phone: phone,
        needsVerification: true
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock SMS function - replace with actual SMS service integration
async function sendOTP(phone: string, otp: string, name: string) {
  // Integrate with SMS service like Twilio, MSG91, or TextLocal
  console.log(`SMS to ${phone}: Hi ${name}, your Rumble Cars verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`)
  
  // Example integration:
  /*
  const response = await fetch('https://api.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authkey': process.env.SMS_API_KEY
    },
    body: JSON.stringify({
      template_id: 'your-template-id',
      mobile: phone,
      authkey: process.env.SMS_API_KEY,
      otp: otp,
      userip: '127.0.0.1',
      extra_param: {
        name: name
      }
    })
  })
  */
  
  return true
}