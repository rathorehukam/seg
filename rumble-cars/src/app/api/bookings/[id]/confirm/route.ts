import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const bookingId = params.id
    
    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          include: { kyc: true }
        },
        vehicle: true,
        payments: true
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns the booking
    if (booking.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to confirm this booking' },
        { status: 403 }
      )
    }
    
    // Check booking status
    if (booking.status !== 'HOLD') {
      return NextResponse.json(
        { error: 'Booking cannot be confirmed in current status' },
        { status: 400 }
      )
    }
    
    // Check payment status
    if (booking.paymentStatus !== 'PAID') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }
    
    // Check KYC status
    if (!booking.user.kyc || booking.user.kyc.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'KYC verification required before confirmation' },
        { status: 400 }
      )
    }
    
    // Check if booking hasn't expired
    const now = new Date()
    const holdExpiry = new Date(booking.createdAt.getTime() + 15 * 60 * 1000) // 15 minutes
    
    if (now > holdExpiry && booking.paymentStatus !== 'PAID') {
      // Auto-cancel expired booking
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
      })
      
      return NextResponse.json(
        { error: 'Booking has expired' },
        { status: 400 }
      )
    }
    
    // Confirm the booking
    const confirmedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED'
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
    
    // Update vehicle status to booked
    await prisma.vehicle.update({
      where: { id: booking.vehicleId },
      data: { status: 'BOOKED' }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'BOOKING_CONFIRMED',
        entity: 'Booking',
        entityId: bookingId,
        metaJson: {
          bookingNo: booking.bookingNo,
          vehicleId: booking.vehicleId
        }
      }
    })
    
    // TODO: Send confirmation SMS/Email/WhatsApp
    // TODO: Generate legal agreement PDF
    
    return NextResponse.json({
      message: 'Booking confirmed successfully',
      booking: {
        id: confirmedBooking.id,
        bookingNo: confirmedBooking.bookingNo,
        status: confirmedBooking.status,
        paymentStatus: confirmedBooking.paymentStatus,
        startTs: confirmedBooking.startTs,
        endTs: confirmedBooking.endTs,
        vehicle: {
          id: confirmedBooking.vehicle.id,
          plateNo: confirmedBooking.vehicle.plateNo,
          make: confirmedBooking.vehicle.make,
          model: confirmedBooking.vehicle.model,
          type: confirmedBooking.vehicle.type,
          photos: confirmedBooking.vehicle.photos
        },
        pickupLocation: confirmedBooking.pickupLoc,
        dropLocation: confirmedBooking.dropLoc,
        pricing: confirmedBooking.priceBreakdown,
        addons: confirmedBooking.addons,
        user: confirmedBooking.user,
        confirmedAt: new Date()
      }
    })
    
  } catch (error) {
    console.error('Booking confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}