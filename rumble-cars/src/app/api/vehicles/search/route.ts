import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculatePricing } from '@/lib/pricing'
import { VehicleType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const city = searchParams.get('city')
    const type = searchParams.get('type') as VehicleType | null
    const seats = searchParams.get('seats')
    const sort = searchParams.get('sort') || 'price'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Validate required parameters
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      )
    }
    
    const startTs = new Date(from)
    const endTs = new Date(to)
    
    if (startTs >= endTs) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }
    
    if (startTs < new Date()) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      )
    }
    
    // Build search filters
    const where: any = {
      status: 'AVAILABLE',
      ...(type && { type }),
      ...(seats && { seats: { gte: parseInt(seats) } }),
      ...(city && { 
        pickupLoc: { 
          name: { contains: city, mode: 'insensitive' } 
        } 
      })
    }
    
    // Exclude vehicles with overlapping bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'HOLD', 'IN_USE'] },
        OR: [
          {
            startTs: { lte: endTs },
            endTs: { gte: startTs }
          }
        ]
      },
      select: { vehicleId: true }
    })
    
    const conflictingVehicleIds = conflictingBookings.map(b => b.vehicleId)
    if (conflictingVehicleIds.length > 0) {
      where.id = { notIn: conflictingVehicleIds }
    }
    
    // Exclude vehicles with calendar blocks
    const blockedVehicles = await prisma.vehicleCalendarBlock.findMany({
      where: {
        OR: [
          {
            startTs: { lte: endTs },
            endTs: { gte: startTs }
          }
        ]
      },
      select: { vehicleId: true }
    })
    
    const blockedVehicleIds = blockedVehicles.map(b => b.vehicleId)
    if (blockedVehicleIds.length > 0) {
      if (where.id) {
        where.id.notIn = [...where.id.notIn, ...blockedVehicleIds]
      } else {
        where.id = { notIn: blockedVehicleIds }
      }
    }
    
    // Get vehicles with pagination
    const skip = (page - 1) * limit
    
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          pickupLoc: true,
          dropLoc: true,
          reviews: {
            select: {
              rating: true
            }
          },
          host: {
            select: {
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: sort === 'price' ? { baseDailyRate: 'asc' } : 
                 sort === 'rating' ? { reviews: { _count: 'desc' } } :
                 { createdAt: 'desc' }
      }),
      prisma.vehicle.count({ where })
    ])
    
    // Calculate pricing for each vehicle
    const vehiclesWithPricing = await Promise.all(
      vehicles.map(async (vehicle) => {
        try {
          const pricing = await calculatePricing({
            vehicleId: vehicle.id,
            startTs,
            endTs,
            city: city || undefined
          })
          
          // Calculate average rating
          const avgRating = vehicle.reviews.length > 0 
            ? vehicle.reviews.reduce((sum, r) => sum + r.rating, 0) / vehicle.reviews.length
            : 0
          
          return {
            id: vehicle.id,
            plateNo: vehicle.plateNo,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            color: vehicle.color,
            seats: vehicle.seats,
            fuelPolicy: vehicle.fuelPolicy,
            kmLimitDay: vehicle.kmLimitDay,
            photos: vehicle.photos,
            description: vehicle.description,
            features: vehicle.features,
            pickupLocation: {
              name: vehicle.pickupLoc.name,
              address: vehicle.pickupLoc.address,
              lat: vehicle.pickupLoc.lat,
              lng: vehicle.pickupLoc.lng
            },
            dropLocation: {
              name: vehicle.dropLoc.name,
              address: vehicle.dropLoc.address,
              lat: vehicle.dropLoc.lat,
              lng: vehicle.dropLoc.lng
            },
            host: vehicle.host ? {
              name: vehicle.host.name
            } : null,
            ownerRole: vehicle.ownerRole,
            rating: {
              average: Math.round(avgRating * 10) / 10,
              count: vehicle.reviews.length
            },
            pricing: {
              total: pricing.total,
              deposit: pricing.deposit,
              baseRate: pricing.baseAmount,
              duration: pricing.durationHours,
              breakdown: pricing.breakdown
            }
          }
        } catch (error) {
          console.error(`Pricing calculation error for vehicle ${vehicle.id}:`, error)
          // Return vehicle without pricing if calculation fails
          return {
            id: vehicle.id,
            plateNo: vehicle.plateNo,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            color: vehicle.color,
            seats: vehicle.seats,
            fuelPolicy: vehicle.fuelPolicy,
            kmLimitDay: vehicle.kmLimitDay,
            photos: vehicle.photos,
            description: vehicle.description,
            features: vehicle.features,
            pickupLocation: {
              name: vehicle.pickupLoc.name,
              address: vehicle.pickupLoc.address,
              lat: vehicle.pickupLoc.lat,
              lng: vehicle.pickupLoc.lng
            },
            dropLocation: {
              name: vehicle.dropLoc.name,
              address: vehicle.dropLoc.address,
              lat: vehicle.dropLoc.lat,
              lng: vehicle.dropLoc.lng
            },
            host: vehicle.host ? {
              name: vehicle.host.name
            } : null,
            ownerRole: vehicle.ownerRole,
            rating: {
              average: 0,
              count: 0
            },
            pricing: {
              total: vehicle.baseDailyRate,
              deposit: vehicle.deposit,
              baseRate: vehicle.baseDailyRate,
              duration: 24,
              breakdown: {
                baseRate: vehicle.baseDailyRate,
                weekendCharge: 0,
                demandCharge: 0,
                seasonalCharge: 0,
                addons: []
              }
            }
          }
        }
      })
    )
    
    // Sort by pricing if requested
    if (sort === 'price') {
      vehiclesWithPricing.sort((a, b) => a.pricing.total - b.pricing.total)
    }
    
    return NextResponse.json({
      vehicles: vehiclesWithPricing,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        from,
        to,
        city,
        type,
        seats,
        sort
      }
    })
    
  } catch (error) {
    console.error('Vehicle search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}