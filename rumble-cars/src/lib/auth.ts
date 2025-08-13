import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret'

export interface JWTPayload {
  userId: string
  role: Role
  phone: string
}

export function generateJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Role-based permissions
export const PERMISSIONS = {
  CUSTOMER: [
    'browse', 'book', 'pay', 'upload_kyc', 'esign', 'view_trips', 
    'extend_booking', 'wallet_use', 'subscribe', 'chat_support', 'refer'
  ],
  STAFF: [
    'create_booking', 'verify_kyc', 'handover', 'return', 'manage_damages',
    'attach_fines', 'schedule_valet', 'open_rsa', 'close_rsa', 'device_commands'
  ],
  ADMIN: ['all'],
  HOST: [
    'host_onboard', 'host_manage_vehicles', 'view_device_health', 'view_payouts'
  ]
} as const

export function hasPermission(userRole: Role, permission: string): boolean {
  if (userRole === 'ADMIN') return true
  return PERMISSIONS[userRole]?.includes(permission as any) || false
}

export function canAccessResource(userRole: Role, resourceOwner?: string, userId?: string): boolean {
  if (userRole === 'ADMIN' || userRole === 'STAFF') return true
  return resourceOwner === userId
}

// OTP Storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expiresAt: Date }>()

export function storeOTP(phone: string, otp: string): void {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  otpStorage.set(phone, { otp, expiresAt })
}

export function verifyOTP(phone: string, otp: string): boolean {
  const stored = otpStorage.get(phone)
  if (!stored || stored.expiresAt < new Date()) {
    otpStorage.delete(phone)
    return false
  }
  
  if (stored.otp === otp) {
    otpStorage.delete(phone)
    return true
  }
  
  return false
}

export async function getCurrentUser(token: string) {
  const payload = verifyJWT(token)
  if (!payload) return null
  
  return await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      kyc: true,
      wallet: true,
      subscription: {
        include: { plan: true }
      }
    }
  })
}