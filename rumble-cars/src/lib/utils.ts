import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount / 100) // Convert paisa to rupees
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

export function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `RMB${timestamp}${random}`
}

export function generateReferralCode(name?: string): string {
  const prefix = name ? name.substring(0, 3).toUpperCase() : 'REF'
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${random}`
}

export function calculateDuration(startTs: Date, endTs: Date): {
  days: number
  hours: number
  totalHours: number
} {
  const diffMs = endTs.getTime() - startTs.getTime()
  const totalHours = Math.ceil(diffMs / (1000 * 60 * 60))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  
  return { days, hours, totalHours }
}

export function isDateInPast(date: Date): boolean {
  return date < new Date()
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function phoneNumberFormat(phone: string): string {
  // Format Indian phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('91')) {
    return `+91 ${cleaned.substring(2, 7)} ${cleaned.substring(7)}`
  }
  return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}