import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP, generateJWT } from '@/lib/auth'
import { generateReferralCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { phone, name, email, referralCode } = await request.json()
    
    // Validate input
    if (!phone || !name) {
      return NextResponse.json(
        { error: 'Phone number and name are required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this phone number' },
        { status: 409 }
      )
    }
    
    // Validate referral code if provided
    let referrer = null
    if (referralCode) {
      referrer = await prisma.referral.findFirst({
        where: { 
          code: referralCode,
          status: 'CREATED'
        },
        include: { referrer: true }
      })
      
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        )
      }
    }
    
    // Generate OTP
    const otp = generateOTP()
    storeOTP(phone, otp)
    
    // TODO: Send OTP via SMS (integrate with Twilio)
    console.log(`OTP for ${phone}: ${otp}`)
    
    // Store user data temporarily (in production, use Redis or database)
    // For now, we'll create the user immediately and mark as inactive
    const user = await prisma.user.create({
      data: {
        phone,
        name,
        email,
        role: 'CUSTOMER',
        isActive: false // Will be activated after OTP verification
      }
    })
    
    // Create wallet for the user
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0
      }
    })
    
    // Create referral code for the new user
    await prisma.referral.create({
      data: {
        referrerId: user.id,
        code: generateReferralCode(name),
        status: 'CREATED'
      }
    })
    
    // If user used a referral code, update the referral
    if (referrer) {
      await prisma.referral.update({
        where: { id: referrer.id },
        data: {
          refereeId: user.id,
          status: 'COMPLETED',
          rewardPoints: 50000 // ₹500 worth of points
        }
      })
      
      // Add loyalty points to referrer
      await prisma.loyaltyLedger.create({
        data: {
          userId: referrer.referrerId,
          points: 50000,
          reason: 'Referral bonus',
          ref: `referral-${referrer.id}`
        }
      })
    }
    
    return NextResponse.json({
      message: 'OTP sent successfully',
      userId: user.id,
      otpSent: true
    })
    
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}