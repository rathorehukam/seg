import { prisma } from './db'
import { VehicleType, PricingRuleScope, PricingRuleType } from '@prisma/client'
import { calculateDuration } from './utils'

export interface PricingCalculationInput {
  vehicleId: string
  startTs: Date
  endTs: Date
  city?: string
  userId?: string
  couponCode?: string
  addons?: Array<{ code: string; qty: number }>
}

export interface PricingBreakdown {
  baseAmount: number
  durationHours: number
  vehicleType: VehicleType
  weekendMultiplier: number
  demandMultiplier: number
  seasonalDelta: number
  subtotal: number
  addonTotal: number
  couponDiscount: number
  subscriptionDiscount: number
  deposit: number
  total: number
  breakdown: {
    baseRate: number
    weekendCharge: number
    demandCharge: number
    seasonalCharge: number
    addons: Array<{ name: string; qty: number; amount: number }>
  }
}

export async function calculatePricing(input: PricingCalculationInput): Promise<PricingBreakdown> {
  const { vehicleId, startTs, endTs, city, userId, couponCode, addons = [] } = input
  
  // Get vehicle details
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: { pickupLoc: true }
  })
  
  if (!vehicle) {
    throw new Error('Vehicle not found')
  }
  
  // Calculate duration
  const { totalHours } = calculateDuration(startTs, endTs)
  const days = Math.ceil(totalHours / 24)
  
  // Base pricing
  let baseAmount: number
  if (totalHours <= 24) {
    // For bookings up to 24 hours, use hourly rate
    baseAmount = vehicle.baseHourlyRate * totalHours
  } else {
    // For longer bookings, use daily rate
    baseAmount = vehicle.baseDailyRate * days
  }
  
  // Get applicable pricing rules
  const pricingRules = await getPricingRules(vehicle.type, vehicleId, city || 'default', startTs, endTs)
  
  // Apply multipliers and deltas
  let weekendMultiplier = 1
  let demandMultiplier = 1
  let seasonalDelta = 0
  
  for (const rule of pricingRules) {
    switch (rule.ruleType) {
      case 'WEEKEND':
        if (isWeekend(startTs) || isWeekend(endTs)) {
          weekendMultiplier = rule.multiplier || 1
        }
        break
      case 'DEMAND':
        demandMultiplier = await calculateDemandMultiplier(vehicleId, startTs, endTs)
        break
      case 'SEASON':
        seasonalDelta = rule.delta || 0
        break
      case 'HOLIDAY':
        if (await isHoliday(startTs)) {
          weekendMultiplier = Math.max(weekendMultiplier, rule.multiplier || 1)
        }
        break
    }
  }
  
  // Calculate subtotal
  const subtotal = Math.round(baseAmount * weekendMultiplier * demandMultiplier + seasonalDelta)
  
  // Calculate addon costs
  const addonTotal = await calculateAddonCosts(addons)
  
  // Apply coupon discount
  const couponDiscount = couponCode ? await calculateCouponDiscount(couponCode, subtotal + addonTotal) : 0
  
  // Apply subscription discount
  const subscriptionDiscount = userId ? await calculateSubscriptionDiscount(userId, vehicle.type, subtotal) : 0
  
  // Calculate total
  const total = subtotal + addonTotal - couponDiscount - subscriptionDiscount
  
  const breakdown: PricingBreakdown = {
    baseAmount,
    durationHours: totalHours,
    vehicleType: vehicle.type,
    weekendMultiplier,
    demandMultiplier,
    seasonalDelta,
    subtotal,
    addonTotal,
    couponDiscount,
    subscriptionDiscount,
    deposit: vehicle.deposit,
    total,
    breakdown: {
      baseRate: baseAmount,
      weekendCharge: Math.round(baseAmount * (weekendMultiplier - 1)),
      demandCharge: Math.round(baseAmount * weekendMultiplier * (demandMultiplier - 1)),
      seasonalCharge: seasonalDelta,
      addons: await getAddonBreakdown(addons)
    }
  }
  
  return breakdown
}

async function getPricingRules(
  vehicleType: VehicleType, 
  vehicleId: string, 
  city: string, 
  startTs: Date, 
  endTs: Date
) {
  return await prisma.pricingRule.findMany({
    where: {
      OR: [
        { scope: 'GLOBAL' },
        { scope: 'VEHICLE_TYPE', scopeRef: vehicleType },
        { scope: 'VEHICLE', scopeRef: vehicleId },
        { scope: 'CITY', scopeRef: city }
      ]
    },
    orderBy: [
      { scope: 'desc' }, // More specific rules first
      { createdAt: 'desc' }
    ]
  })
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

async function isHoliday(date: Date): boolean {
  // In a real implementation, you'd check against a holiday calendar
  // For now, just check some major Indian holidays
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // Some static holidays (add more as needed)
  const holidays = [
    { month: 1, day: 26 }, // Republic Day
    { month: 8, day: 15 }, // Independence Day
    { month: 10, day: 2 },  // Gandhi Jayanti
  ]
  
  return holidays.some(h => h.month === month && h.day === day)
}

async function calculateDemandMultiplier(vehicleId: string, startTs: Date, endTs: Date): Promise<number> {
  // Calculate demand based on booking density in the area and time
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { pickupLocId: true, type: true }
  })
  
  if (!vehicle) return 1
  
  // Count overlapping bookings in the same area and vehicle type
  const overlappingBookings = await prisma.booking.count({
    where: {
      pickupLocId: vehicle.pickupLocId,
      vehicle: { type: vehicle.type },
      status: { in: ['CONFIRMED', 'IN_USE'] },
      OR: [
        {
          startTs: { lte: endTs },
          endTs: { gte: startTs }
        }
      ]
    }
  })
  
  // Total available vehicles of same type in area
  const availableVehicles = await prisma.vehicle.count({
    where: {
      pickupLocId: vehicle.pickupLocId,
      type: vehicle.type,
      status: 'AVAILABLE'
    }
  })
  
  // Calculate demand ratio
  const demandRatio = availableVehicles > 0 ? overlappingBookings / availableVehicles : 1
  
  // Apply multiplier based on demand
  if (demandRatio > 0.8) return 1.5      // High demand
  if (demandRatio > 0.6) return 1.3      // Medium demand
  if (demandRatio > 0.4) return 1.1      // Low demand
  return 1                               // Normal demand
}

async function calculateAddonCosts(addons: Array<{ code: string; qty: number }>): Promise<number> {
  // In a real implementation, you'd have an addons table
  const addonPrices: Record<string, number> = {
    'HELMET': 5000, // ₹50 per day
    'GPS': 10000,   // ₹100 per day
    'INSURANCE': 15000, // ₹150 per day
    'FUEL_FILL': 50000, // ₹500 one-time
  }
  
  return addons.reduce((total, addon) => {
    const price = addonPrices[addon.code] || 0
    return total + (price * addon.qty)
  }, 0)
}

async function getAddonBreakdown(addons: Array<{ code: string; qty: number }>) {
  const addonNames: Record<string, string> = {
    'HELMET': 'Helmet',
    'GPS': 'GPS Navigation',
    'INSURANCE': 'Additional Insurance',
    'FUEL_FILL': 'Fuel Fill Service',
  }
  
  const addonPrices: Record<string, number> = {
    'HELMET': 5000,
    'GPS': 10000,
    'INSURANCE': 15000,
    'FUEL_FILL': 50000,
  }
  
  return addons.map(addon => ({
    name: addonNames[addon.code] || addon.code,
    qty: addon.qty,
    amount: (addonPrices[addon.code] || 0) * addon.qty
  }))
}

async function calculateCouponDiscount(couponCode: string, amount: number): Promise<number> {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: couponCode,
      isActive: true,
      validFrom: { lte: new Date() },
      validTo: { gte: new Date() },
      maxUses: { gt: 0 }
    }
  })
  
  if (!coupon) return 0
  
  if (coupon.type === 'PCT') {
    return Math.round(amount * coupon.value / 100)
  } else {
    return Math.min(coupon.value, amount)
  }
}

async function calculateSubscriptionDiscount(userId: string, vehicleType: VehicleType, amount: number): Promise<number> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      startDate: { lte: new Date() },
      endDate: { gte: new Date() }
    },
    include: { plan: true }
  })
  
  if (!subscription || subscription.plan.vehicleType !== vehicleType) return 0
  
  // Apply subscription discount (e.g., 20% off for active subscribers)
  return Math.round(amount * 0.2)
}

export async function calculateReturnCharges(bookingId: string, returnData: {
  extraKm: number
  fuelDeficit: number
  damageLevel: 'MINOR' | 'MAJOR' | 'SEVERE'
  lateHours: number
  cleaningRequired: boolean
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { vehicle: true }
  })
  
  if (!booking) throw new Error('Booking not found')
  
  const charges = {
    extraKm: returnData.extraKm * 500, // ₹5 per extra km
    fuel: returnData.fuelDeficit * 10000, // ₹100 per liter
    damage: getDamageCharge(returnData.damageLevel),
    late: Math.min(returnData.lateHours * 10000, booking.vehicle.baseDailyRate), // ₹100/hour, max 1 day rate
    cleaning: returnData.cleaningRequired ? 50000 : 0, // ₹500 cleaning fee
  }
  
  return {
    ...charges,
    total: Object.values(charges).reduce((sum, charge) => sum + charge, 0)
  }
}

function getDamageCharge(level: 'MINOR' | 'MAJOR' | 'SEVERE'): number {
  switch (level) {
    case 'MINOR': return 500000  // ₹5,000
    case 'MAJOR': return 1500000 // ₹15,000
    case 'SEVERE': return 5000000 // ₹50,000
    default: return 0
  }
}