import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculatePricing } from '@/lib/pricing'
import { generateBookingNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const {
      vehicleId,
      startTs,
      endTs,
      pickupLocId,
      dropLocId,
      addons = [],
      couponCode,
      notes
    } = await request.json()
    
    // Validate required fields
    if (!vehicleId || !startTs || !endTs) {
      return NextResponse.json(
        { error: 'Vehicle ID, start time, and end time are required' },
        { status: 400 }
      )
    }
    
    const startDate = new Date(startTs)
    const endDate = new Date(endTs)
    
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }
    
    if (startDate < new Date()) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      )
    }
    
    // Check vehicle availability
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        pickupLoc: true,
        dropLoc: true
      }
    })
    
    if (!vehicle || vehicle.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Vehicle not available' },
        { status: 400 }
      )
    }
    
    // Check for overlapping bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { in: ['CONFIRMED', 'HOLD', 'IN_USE'] },
        OR: [
          {
            startTs: { lte: endDate },
            endTs: { gte: startDate }
          }
        ]
      }
    })
    
    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Vehicle is already booked for this time period' },
        { status: 409 }
      )
    }
    
    // Check for calendar blocks
    const calendarBlock = await prisma.vehicleCalendarBlock.findFirst({
      where: {
        vehicleId,
        OR: [
          {
            startTs: { lte: endDate },
            endTs: { gte: startDate }
          }
        ]
      }
    })
    
    if (calendarBlock) {
      return NextResponse.json(
        { error: 'Vehicle is blocked for maintenance during this period' },
        { status: 409 }
      )
    }
    
    // Calculate pricing
    const pricingBreakdown = await calculatePricing({
      vehicleId,
      startTs: startDate,
      endTs: endDate,
      userId,
      couponCode,
      addons
    })
    
    // Use vehicle's pickup/drop locations if not specified
    const finalPickupLocId = pickupLocId || vehicle.pickupLocId
    const finalDropLocId = dropLocId || vehicle.dropLocId
    
    // Create booking with HOLD status
    const booking = await prisma.booking.create({
      data: {
        bookingNo: generateBookingNumber(),
        userId,
        vehicleId,
        startTs: startDate,
        endTs: endDate,
        pickupLocId: finalPickupLocId,
        dropLocId: finalDropLocId,
        status: 'HOLD',
        priceBreakdown: pricingBreakdown,
        depositAmount: pricingBreakdown.deposit,
        paymentStatus: 'UNPAID',
        notes,
        // Add addons
        addons: {
          create: addons.map((addon: any) => ({
            addonCode: addon.code,
            name: addon.name || addon.code,
            qty: addon.qty,
            unitPrice: addon.unitPrice || 0
          }))
        }
      },
      include: {
        vehicle: {
          include: {
            pickupLoc: true,
            dropLoc: true
          }
        },
        pickupLoc: true,
        dropLoc: true,
        addons: true,
        user: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })
    
    // Schedule auto-cancellation after 15 minutes
    // In production, use a job queue like Bull or AWS SQS
    setTimeout(async () => {
      try {
        const currentBooking = await prisma.booking.findUnique({
          where: { id: booking.id }
        })
        
        if (currentBooking && currentBooking.status === 'HOLD' && currentBooking.paymentStatus === 'UNPAID') {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'CANCELLED' }
          })
          
          console.log(`Auto-cancelled booking ${booking.bookingNo} after 15 minutes`)
        }
      } catch (error) {
        console.error('Auto-cancellation error:', error)
      }
    }, 15 * 60 * 1000) // 15 minutes
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'BOOKING_HOLD',
        entity: 'Booking',
        entityId: booking.id,
        metaJson: {
          bookingNo: booking.bookingNo,
          vehicleId,
          amount: pricingBreakdown.total
        }
      }
    })
    
    return NextResponse.json({
      message: 'Booking held successfully',
      booking: {
        id: booking.id,
        bookingNo: booking.bookingNo,
        status: booking.status,
        startTs: booking.startTs,
        endTs: booking.endTs,
        vehicle: {
          id: booking.vehicle.id,
          plateNo: booking.vehicle.plateNo,
          make: booking.vehicle.make,
          model: booking.vehicle.model,
          type: booking.vehicle.type,
          photos: booking.vehicle.photos
        },
        pickupLocation: booking.pickupLoc,
        dropLocation: booking.dropLoc,
        pricing: pricingBreakdown,
        addons: booking.addons,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
      }
    })
    
  } catch (error) {
    console.error('Booking hold error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}