import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import { AuthUser } from '@/types'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export function generateToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Permission system based on roles
export const PERMISSIONS = {
  // Customer permissions
  browse: ['CUSTOMER', 'STAFF', 'ADMIN'],
  book: ['CUSTOMER', 'STAFF', 'ADMIN'],
  pay: ['CUSTOMER', 'STAFF', 'ADMIN'],
  upload_kyc: ['CUSTOMER', 'STAFF', 'ADMIN'],
  esign: ['CUSTOMER', 'STAFF', 'ADMIN'],
  view_trips: ['CUSTOMER', 'STAFF', 'ADMIN'],
  extend_booking: ['CUSTOMER', 'STAFF', 'ADMIN'],
  wallet_use: ['CUSTOMER', 'STAFF', 'ADMIN'],
  subscribe: ['CUSTOMER', 'STAFF', 'ADMIN'],
  chat_support: ['CUSTOMER', 'STAFF', 'ADMIN'],
  refer: ['CUSTOMER', 'STAFF', 'ADMIN'],
  
  // Staff permissions
  create_booking: ['STAFF', 'ADMIN'],
  verify_kyc: ['STAFF', 'ADMIN'],
  handover: ['STAFF', 'ADMIN'],
  return: ['STAFF', 'ADMIN'],
  manage_damages: ['STAFF', 'ADMIN'],
  attach_fines: ['STAFF', 'ADMIN'],
  schedule_valet: ['STAFF', 'ADMIN'],
  open_rsa: ['STAFF', 'ADMIN'],
  close_rsa: ['STAFF', 'ADMIN'],
  device_commands: ['STAFF', 'ADMIN'],
  
  // Admin permissions (all permissions)
  all: ['ADMIN'],
  
  // Host permissions
  host_onboard: ['HOST', 'ADMIN'],
  host_manage_vehicles: ['HOST', 'ADMIN'],
  view_device_health: ['HOST', 'ADMIN'],
  view_payouts: ['HOST', 'ADMIN']
} as const

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  // Admin has all permissions
  if (userRole === 'ADMIN') {
    return true
  }
  
  const allowedRoles = PERMISSIONS[permission]
  return allowedRoles.includes(userRole)
}

export function requirePermission(userRole: UserRole, permission: Permission): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Insufficient permissions. Required: ${permission}`)
  }
}

// Role hierarchy for access control
export const ROLE_HIERARCHY = {
  ADMIN: 4,
  STAFF: 3,
  HOST: 2,
  CUSTOMER: 1
} as const

export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole]
}

// Route protection utilities
export interface RouteAccess {
  roles: UserRole[]
  permissions?: Permission[]
  requireAll?: boolean // If true, user must have ALL permissions. If false, ANY permission is enough
}

export function canAccessRoute(userRole: UserRole, routeAccess: RouteAccess): boolean {
  // Check role access
  if (!routeAccess.roles.includes(userRole)) {
    return false
  }
  
  // Check permissions if specified
  if (routeAccess.permissions && routeAccess.permissions.length > 0) {
    if (routeAccess.requireAll) {
      return routeAccess.permissions.every(permission => hasPermission(userRole, permission))
    } else {
      return routeAccess.permissions.some(permission => hasPermission(userRole, permission))
    }
  }
  
  return true
}

// Common route access configurations
export const ROUTE_ACCESS = {
  // Public routes
  public: { roles: ['CUSTOMER', 'STAFF', 'ADMIN', 'HOST'] },
  
  // Customer routes
  customer: { roles: ['CUSTOMER', 'STAFF', 'ADMIN'] },
  
  // Staff routes
  staff: { 
    roles: ['STAFF', 'ADMIN'],
    permissions: ['verify_kyc', 'handover', 'return'] as Permission[]
  },
  
  // Admin routes
  admin: { roles: ['ADMIN'] },
  
  // Host routes
  host: { 
    roles: ['HOST', 'ADMIN'],
    permissions: ['host_manage_vehicles'] as Permission[]
  },
  
  // Device control
  device_control: {
    roles: ['STAFF', 'ADMIN'],
    permissions: ['device_commands'] as Permission[]
  },
  
  // KYC verification
  kyc_verification: {
    roles: ['STAFF', 'ADMIN'],
    permissions: ['verify_kyc'] as Permission[]
  }
} as const

// Phone number validation for Indian numbers
export function isValidIndianPhone(phone: string): boolean {
  const indianPhoneRegex = /^[6-9]\d{9}$/
  return indianPhoneRegex.test(phone)
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate secure random string
export function generateSecureId(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}