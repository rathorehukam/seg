import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
    
    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Razorpay webhook secret not configured')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    
    const payload = JSON.parse(body)
    const { event, payload: eventPayload } = payload
    
    console.log('Razorpay webhook event:', event)
    
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(eventPayload.payment.entity)
        break
        
      case 'payment.failed':
        await handlePaymentFailed(eventPayload.payment.entity)
        break
        
      case 'order.paid':
        await handleOrderPaid(eventPayload.order.entity)
        break
        
      default:
        console.log('Unhandled webhook event:', event)
    }
    
    return NextResponse.json({ status: 'success' })
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    // Find the payment record
    const paymentRecord = await prisma.payment.findFirst({
      where: {
        orderId: payment.order_id,
        paymentId: payment.id
      },
      include: { booking: true }
    })
    
    if (!paymentRecord) {
      console.error('Payment record not found:', payment.id)
      return
    }
    
    // Update payment status
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: 'PAID',
        eventJson: payment
      }
    })
    
    // Calculate total paid amount for this booking
    const totalPaid = await prisma.payment.aggregate({
      where: {
        bookingId: paymentRecord.bookingId,
        status: 'PAID'
      },
      _sum: { amount: true }
    })
    
    const booking = paymentRecord.booking
    const pricingBreakdown = booking.priceBreakdown as any
    const totalAmount = pricingBreakdown.total + booking.depositAmount
    
    // Update booking payment status
    let paymentStatus = 'PARTIAL'
    if ((totalPaid._sum.amount || 0) >= totalAmount) {
      paymentStatus = 'PAID'
    }
    
    await prisma.booking.update({
      where: { id: paymentRecord.bookingId },
      data: { paymentStatus: paymentStatus as any }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: booking.userId,
        action: 'PAYMENT_CAPTURED',
        entity: 'Payment',
        entityId: paymentRecord.id,
        metaJson: {
          paymentId: payment.id,
          amount: payment.amount,
          bookingNo: booking.bookingNo
        }
      }
    })
    
    console.log(`Payment captured for booking ${booking.bookingNo}: ₹${payment.amount / 100}`)
    
  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    // Find the payment record
    const paymentRecord = await prisma.payment.findFirst({
      where: {
        orderId: payment.order_id,
        paymentId: payment.id
      },
      include: { booking: true }
    })
    
    if (!paymentRecord) {
      console.error('Payment record not found:', payment.id)
      return
    }
    
    // Update payment status
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: 'FAILED',
        eventJson: payment
      }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: paymentRecord.booking.userId,
        action: 'PAYMENT_FAILED',
        entity: 'Payment',
        entityId: paymentRecord.id,
        metaJson: {
          paymentId: payment.id,
          amount: payment.amount,
          bookingNo: paymentRecord.booking.bookingNo,
          errorReason: payment.error_reason
        }
      }
    })
    
    console.log(`Payment failed for booking ${paymentRecord.booking.bookingNo}: ${payment.error_reason}`)
    
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleOrderPaid(order: any) {
  try {
    // Find all payments for this order
    const payments = await prisma.payment.findMany({
      where: { orderId: order.id },
      include: { booking: true }
    })
    
    if (payments.length === 0) {
      console.error('No payments found for order:', order.id)
      return
    }
    
    const booking = payments[0].booking
    
    // Update booking payment status to PAID
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: 'PAID' }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: booking.userId,
        action: 'ORDER_PAID',
        entity: 'Booking',
        entityId: booking.id,
        metaJson: {
          orderId: order.id,
          amount: order.amount,
          bookingNo: booking.bookingNo
        }
      }
    })
    
    console.log(`Order paid for booking ${booking.bookingNo}: ₹${order.amount / 100}`)
    
  } catch (error) {
    console.error('Error handling order paid:', error)
  }
}