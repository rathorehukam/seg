import { VehicleType } from '@prisma/client'
import { PriceBreakdown } from '@/types'

interface PricingInputs {
  baseHourlyRate: number
  baseDailyRate: number
  durationHours: number
  vehicleType: VehicleType
  city: string
  startDate: Date
  endDate: Date
  demandAvailabilityPct: number
  isWeekend: boolean
  isHoliday: boolean
  kmLimitDay: number
  subscriptionBenefits?: {
    discountPct?: number
    freeKmPerDay?: number
  }
  addons?: Array<{
    name: string
    qty: number
    unitPrice: number
  }>
  couponDiscount?: number
  deposit: number
}

interface PricingMultipliers {
  demand: number
  weekend: number
  holiday: number
  timeOfDay: number
}

export function calculatePricing(inputs: PricingInputs): PriceBreakdown {
  const {
    baseHourlyRate,
    baseDailyRate,
    durationHours,
    isWeekend,
    isHoliday,
    demandAvailabilityPct,
    subscriptionBenefits,
    addons = [],
    couponDiscount = 0,
    deposit
  } = inputs

  // Determine if daily or hourly rate is better
  const durationDays = Math.ceil(durationHours / 24)
  const hourlyTotal = baseHourlyRate * durationHours
  const dailyTotal = baseDailyRate * durationDays
  
  // Use the better rate for customer
  const baseRate = Math.min(hourlyTotal, dailyTotal)
  
  // Calculate multipliers
  const multipliers = calculateMultipliers({
    demandAvailabilityPct,
    isWeekend,
    isHoliday,
    startDate: inputs.startDate
  })
  
  // Apply dynamic pricing
  let subtotal = baseRate
  
  // Demand-based pricing
  subtotal *= multipliers.demand
  
  // Weekend multiplier
  if (isWeekend) {
    subtotal *= multipliers.weekend
  }
  
  // Holiday multiplier
  if (isHoliday) {
    subtotal *= multipliers.holiday
  }
  
  // Time of day multiplier
  subtotal *= multipliers.timeOfDay
  
  // Calculate addons
  const addonsTotal = addons.reduce((total, addon) => {
    return total + (addon.qty * addon.unitPrice)
  }, 0)
  
  // Apply subscription benefits
  let subscriptionDiscount = 0
  if (subscriptionBenefits?.discountPct) {
    subscriptionDiscount = subtotal * (subscriptionBenefits.discountPct / 100)
  }
  
  // Calculate taxes (18% GST)
  const taxableAmount = subtotal + addonsTotal - subscriptionDiscount
  const taxes = Math.round(taxableAmount * 0.18)
  
  // Apply coupon discount
  const couponDiscountAmount = couponDiscount || 0
  
  // Total calculation
  const total = Math.round(taxableAmount + taxes - couponDiscountAmount)
  
  return {
    baseRate: Math.round(baseRate),
    durationHours,
    subtotal: Math.round(subtotal),
    taxes,
    addons: addonsTotal,
    discount: Math.round(subscriptionDiscount + couponDiscountAmount),
    deposit,
    total,
    extraCharges: {
      weekendMultiplier: isWeekend ? multipliers.weekend : undefined,
      holidayMultiplier: isHoliday ? multipliers.holiday : undefined,
      demandMultiplier: multipliers.demand
    }
  }
}

function calculateMultipliers(params: {
  demandAvailabilityPct: number
  isWeekend: boolean
  isHoliday: boolean
  startDate: Date
}): PricingMultipliers {
  const { demandAvailabilityPct, startDate } = params
  
  // Demand multiplier based on availability
  // Less availability = higher price
  let demandMultiplier = 1.0
  if (demandAvailabilityPct < 20) {
    demandMultiplier = 2.0 // Very high demand
  } else if (demandAvailabilityPct < 40) {
    demandMultiplier = 1.5 // High demand
  } else if (demandAvailabilityPct < 60) {
    demandMultiplier = 1.2 // Medium demand
  }
  
  // Weekend multiplier
  const weekendMultiplier = 1.3
  
  // Holiday multiplier
  const holidayMultiplier = 1.5
  
  // Time of day multiplier
  const hour = startDate.getHours()
  let timeOfDayMultiplier = 1.0
  
  // Peak hours (8-10 AM, 6-8 PM)
  if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20)) {
    timeOfDayMultiplier = 1.2
  }
  // Late night (10 PM - 6 AM)
  else if (hour >= 22 || hour <= 6) {
    timeOfDayMultiplier = 0.9
  }
  
  return {
    demand: demandMultiplier,
    weekend: weekendMultiplier,
    holiday: holidayMultiplier,
    timeOfDay: timeOfDayMultiplier
  }
}

// Calculate extra charges for returns
export function calculateExtraCharges(params: {
  actualKm: number
  kmLimit: number
  extraKmRate: number
  actualFuelLevel: string
  expectedFuelLevel: string
  fuelRate: number
  fuelServiceFee: number
  isLateReturn: boolean
  lateReturnHours: number
  lateReturnHourlyRate: number
  hasNewDamage: boolean
  damageEstimate: number
  requiresCleaning: boolean
  cleaningFee: number
}): {
  extraKm: number
  extraKmCharge: number
  fuelCharge: number
  lateReturnCharge: number
  damageCharge: number
  cleaningCharge: number
  total: number
} {
  const {
    actualKm,
    kmLimit,
    extraKmRate,
    actualFuelLevel,
    expectedFuelLevel,
    fuelRate,
    fuelServiceFee,
    isLateReturn,
    lateReturnHours,
    lateReturnHourlyRate,
    hasNewDamage,
    damageEstimate,
    requiresCleaning,
    cleaningFee
  } = params

  // Extra KM charges
  const extraKm = Math.max(0, actualKm - kmLimit)
  const extraKmCharge = extraKm * extraKmRate

  // Fuel charges
  const fuelDeficit = calculateFuelDeficit(expectedFuelLevel, actualFuelLevel)
  const fuelCharge = fuelDeficit > 0 ? (fuelDeficit * fuelRate) + fuelServiceFee : 0

  // Late return charges
  const lateReturnCharge = isLateReturn ? 
    Math.min(lateReturnHours * lateReturnHourlyRate, extraKmRate * 24) : 0 // Cap at daily rate

  // Damage charges
  const damageCharge = hasNewDamage ? damageEstimate : 0

  // Cleaning charges
  const cleaningCharge = requiresCleaning ? cleaningFee : 0

  const total = extraKmCharge + fuelCharge + lateReturnCharge + damageCharge + cleaningCharge

  return {
    extraKm,
    extraKmCharge,
    fuelCharge,
    lateReturnCharge,
    damageCharge,
    cleaningCharge,
    total
  }
}

function calculateFuelDeficit(expected: string, actual: string): number {
  const fuelLevels = {
    'E': 0,
    'QUARTER': 0.25,
    'HALF': 0.5,
    'THREE_QUARTER': 0.75,
    'F': 1.0
  }

  const expectedLevel = fuelLevels[expected as keyof typeof fuelLevels] || 0
  const actualLevel = fuelLevels[actual as keyof typeof fuelLevels] || 0

  // Return deficit in percentage (can be converted to liters based on tank capacity)
  return Math.max(0, expectedLevel - actualLevel)
}

// Cancellation policy calculation
export function calculateCancellationCharges(
  bookingAmount: number,
  cancellationTime: Date,
  bookingStartTime: Date
): {
  hoursToStart: number
  cancellationPct: number
  chargeAmount: number
  refundAmount: number
} {
  const hoursToStart = (bookingStartTime.getTime() - cancellationTime.getTime()) / (1000 * 60 * 60)

  let cancellationPct = 0
  
  if (hoursToStart < 0) {
    // After start time
    cancellationPct = 100
  } else if (hoursToStart < 6) {
    // Less than 6 hours
    cancellationPct = 50
  } else if (hoursToStart < 24) {
    // 6-24 hours
    cancellationPct = 25
  } else {
    // More than 24 hours
    cancellationPct = 0
  }

  const chargeAmount = Math.round(bookingAmount * (cancellationPct / 100))
  const refundAmount = bookingAmount - chargeAmount

  return {
    hoursToStart,
    cancellationPct,
    chargeAmount,
    refundAmount
  }
}

// Utility function to check if date is weekend
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

// Utility function to check if date is holiday (you can customize this)
export function isHoliday(date: Date): boolean {
  // Add your holiday logic here
  // For now, just checking some common Indian holidays
  const holidays = [
    '2024-01-26', // Republic Day
    '2024-08-15', // Independence Day
    '2024-10-02', // Gandhi Jayanti
    // Add more holidays as needed
  ]

  const dateStr = date.toISOString().split('T')[0]
  return holidays.includes(dateStr)
}

// Generate booking number
export function generateBookingNumber(): string {
  const prefix = 'RC'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  return `${prefix}${timestamp}${random}`
}

// Calculate utilization rate
export function calculateUtilizationRate(
  totalHours: number,
  bookedHours: number
): number {
  if (totalHours === 0) return 0
  return Math.round((bookedHours / totalHours) * 100)
}

// Distance calculation (for nearby vehicles)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}