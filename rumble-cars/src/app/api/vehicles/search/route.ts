import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculatePricing, isWeekend, isHoliday, calculateDistance } from '@/utils/pricing'
import { VehicleType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const city = searchParams.get('city')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const vehicleType = searchParams.get('type') as VehicleType
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const seats = searchParams.get('seats')
    const sortBy = searchParams.get('sortBy') || 'price'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    // Validation
    if (!city || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'City, start date, and end date are required' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    if (start < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Start date cannot be in the past' },
        { status: 400 }
      )
    }

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    // Build filters
    const where: any = {
      status: 'AVAILABLE',
      OR: [
        {
          pickupLoc: {
            name: {
              contains: city,
              mode: 'insensitive'
            }
          }
        },
        {
          dropLoc: {
            name: {
              contains: city,
              mode: 'insensitive'
            }
          }
        }
      ],
      // Check availability - no overlapping bookings
      NOT: {
        bookings: {
          some: {
            status: {
              in: ['HOLD', 'CONFIRMED', 'IN_USE']
            },
            OR: [
              {
                AND: [
                  { startTs: { lte: start } },
                  { endTs: { gt: start } }
                ]
              },
              {
                AND: [
                  { startTs: { lt: end } },
                  { endTs: { gte: end } }
                ]
              },
              {
                AND: [
                  { startTs: { gte: start } },
                  { endTs: { lte: end } }
                ]
              }
            ]
          }
        }
      },
      // Check calendar blocks
      NOT: {
        calendarBlocks: {
          some: {
            OR: [
              {
                AND: [
                  { startTs: { lte: start } },
                  { endTs: { gt: start } }
                ]
              },
              {
                AND: [
                  { startTs: { lt: end } },
                  { endTs: { gte: end } }
                ]
              },
              {
                AND: [
                  { startTs: { gte: start } },
                  { endTs: { lte: end } }
                ]
              }
            ]
          }
        }
      }
    }

    // Add filters
    if (vehicleType) {
      where.type = vehicleType
    }

    if (seats) {
      where.seats = { gte: parseInt(seats) }
    }

    // Get vehicles with relations
    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        pickupLoc: true,
        dropLoc: true,
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true,
            bookings: {
              where: {
                status: {
                  in: ['COMPLETED']
                }
              }
            }
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Calculate pricing and add metadata for each vehicle
    const vehiclesWithPricing = await Promise.all(
      vehicles.map(async (vehicle) => {
        // Calculate average rating
        const averageRating = vehicle.reviews.length > 0
          ? vehicle.reviews.reduce((sum, review) => sum + review.rating, 0) / vehicle.reviews.length
          : 0

        // Calculate demand (mock calculation - in production use actual availability data)
        const demandAvailabilityPct = Math.random() * 100 // Mock value

        // Calculate pricing
        const pricing = calculatePricing({
          baseHourlyRate: vehicle.baseHourlyRate,
          baseDailyRate: vehicle.baseDailyRate,
          durationHours,
          vehicleType: vehicle.type,
          city,
          startDate: start,
          endDate: end,
          demandAvailabilityPct,
          isWeekend: isWeekend(start),
          isHoliday: isHoliday(start),
          kmLimitDay: vehicle.kmLimitDay,
          deposit: vehicle.deposit
        })

        // Calculate distance if user location provided
        let distance = 0
        if (lat && lng) {
          distance = calculateDistance(
            parseFloat(lat),
            parseFloat(lng),
            vehicle.pickupLoc.lat,
            vehicle.pickupLoc.lng
          )
        }

        return {
          ...vehicle,
          averageRating: Math.round(averageRating * 10) / 10,
          totalTrips: vehicle._count.bookings,
          pricing,
          distance: Math.round(distance * 10) / 10,
          availabilityScore: Math.round((100 - demandAvailabilityPct))
        }
      })
    )

    // Apply price filtering
    let filteredVehicles = vehiclesWithPricing
    if (minPrice) {
      filteredVehicles = filteredVehicles.filter(v => v.pricing.total >= parseInt(minPrice))
    }
    if (maxPrice) {
      filteredVehicles = filteredVehicles.filter(v => v.pricing.total <= parseInt(maxPrice))
    }

    // Sorting
    filteredVehicles.sort((a, b) => {
      let aValue: number, bValue: number

      switch (sortBy) {
        case 'price':
          aValue = a.pricing.total
          bValue = b.pricing.total
          break
        case 'rating':
          aValue = a.averageRating
          bValue = b.averageRating
          break
        case 'distance':
          aValue = a.distance
          bValue = b.distance
          break
        default:
          aValue = a.pricing.total
          bValue = b.pricing.total
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    // Get total count for pagination
    const totalCount = await prisma.vehicle.count({ where })

    // Response
    return NextResponse.json({
      success: true,
      data: {
        vehicles: filteredVehicles,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        },
        filters: {
          city,
          startDate,
          endDate,
          durationHours: Math.round(durationHours),
          vehicleType,
          availableCount: filteredVehicles.length
        }
      }
    })

  } catch (error) {
    console.error('Vehicle search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}