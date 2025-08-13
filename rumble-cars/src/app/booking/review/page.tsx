'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock,
  Users, 
  Fuel, 
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  type: string
  color: string
  seats: number
  photos: string[]
  plateNo: string
  fuelPolicy: string
  kmLimitDay: number
  pickupLoc: {
    name: string
    address: string
  }
  dropLoc: {
    name: string
    address: string
  }
  pricing: {
    baseRate: number
    total: number
    deposit: number
    durationHours: number
    taxes: number
    subtotal: number
    discount: number
  }
}

interface Addon {
  code: string
  name: string
  description: string
  price: number
  maxQty: number
}

export default function BookingReviewPage() {
  const searchParams = useSearchParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({})
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [agreementAccepted, setAgreementAccepted] = useState(false)

  const vehicleId = searchParams.get('vehicleId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const pickupCity = searchParams.get('pickupCity')

  const availableAddons: Addon[] = [
    {
      code: 'HELMET',
      name: 'Extra Helmet',
      description: 'ISI certified helmet for safe riding',
      price: 50,
      maxQty: 2
    },
    {
      code: 'GPS',
      name: 'GPS Navigator',
      description: 'Turn-by-turn navigation system',
      price: 200,
      maxQty: 1
    },
    {
      code: 'CHILD_SEAT',
      name: 'Child Safety Seat',
      description: 'Certified child seat for kids 2-8 years',
      price: 300,
      maxQty: 2
    },
    {
      code: 'FUEL_TANK',
      name: 'Full Tank Service',
      description: 'We fill up the tank for you',
      price: 500,
      maxQty: 1
    },
    {
      code: 'INSURANCE_UPGRADE',
      name: 'Zero Deductible Insurance',
      description: 'No deductible on damages up to ₹50,000',
      price: 599,
      maxQty: 1
    }
  ]

  useEffect(() => {
    if (vehicleId && startDate && endDate) {
      fetchVehicleDetails()
    }
  }, [vehicleId, startDate, endDate])

  const fetchVehicleDetails = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        vehicleId: vehicleId!,
        startDate: startDate!,
        endDate: endDate!
      })

      const response = await fetch(`/api/vehicles/${vehicleId}?${params}`)
      const data = await response.json()

      if (data.success) {
        setVehicle(data.data)
      } else {
        console.error('Failed to fetch vehicle details:', data.error)
      }
    } catch (error) {
      console.error('Vehicle fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAddonQuantity = (addonCode: string, quantity: number) => {
    if (quantity <= 0) {
      const newAddons = { ...selectedAddons }
      delete newAddons[addonCode]
      setSelectedAddons(newAddons)
    } else {
      setSelectedAddons(prev => ({
        ...prev,
        [addonCode]: quantity
      }))
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponCode,
          bookingAmount: calculateTotal()
        })
      })

      const data = await response.json()
      if (data.success) {
        setCouponDiscount(data.data.discount)
        alert('Coupon applied successfully!')
      } else {
        alert(data.error || 'Invalid coupon code')
      }
    } catch (error) {
      alert('Failed to apply coupon')
    }
  }

  const calculateAddonsTotal = () => {
    return Object.entries(selectedAddons).reduce((total, [code, qty]) => {
      const addon = availableAddons.find(a => a.code === code)
      return total + (addon ? addon.price * qty : 0)
    }, 0)
  }

  const calculateTotal = () => {
    if (!vehicle) return 0
    return vehicle.pricing.total + calculateAddonsTotal() - couponDiscount
  }

  const proceedToPayment = () => {
    if (!agreementAccepted) {
      alert('Please accept the rental agreement to proceed')
      return
    }

    const bookingData = {
      vehicleId,
      startDate,
      endDate,
      pickupCity,
      addons: Object.entries(selectedAddons).map(([code, qty]) => ({
        code,
        qty,
        addon: availableAddons.find(a => a.code === code)
      })),
      couponCode: couponCode || undefined,
      couponDiscount,
      total: calculateTotal()
    }

    // Store booking data in sessionStorage for payment flow
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData))
    
    // Redirect to payment
    window.location.href = '/booking/payment'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicle not found</h3>
          <p className="text-gray-600 mb-4">The selected vehicle is no longer available.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 ml-4">
              Review Your Booking
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Details</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                  {vehicle.photos.length > 0 ? (
                    <img
                      src={vehicle.photos[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      🚗
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {vehicle.year} • {vehicle.color} • {vehicle.plateNo}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {vehicle.seats} seats
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Fuel className="h-4 w-4 mr-2" />
                      {vehicle.fuelPolicy.replace('_', ' ')}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Settings className="h-4 w-4 mr-2" />
                      {vehicle.kmLimitDay} km/day
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Shield className="h-4 w-4 mr-2" />
                      Fully insured
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup</p>
                      <p className="text-sm text-gray-600">{formatDateTime(startDate!)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{vehicle.pickupLoc.name}</p>
                    <p className="text-sm text-gray-600">{vehicle.pickupLoc.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Return</p>
                      <p className="text-sm text-gray-600">{formatDateTime(endDate!)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{vehicle.dropLoc.name}</p>
                    <p className="text-sm text-gray-600">{vehicle.dropLoc.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center py-3">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">
                      {vehicle.pricing.durationHours < 24 
                        ? `${vehicle.pricing.durationHours} hours`
                        : `${Math.floor(vehicle.pricing.durationHours / 24)} days ${vehicle.pricing.durationHours % 24}h`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Addons */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Extras (Optional)</h2>
              
              <div className="space-y-4">
                {availableAddons.map((addon) => {
                  const quantity = selectedAddons[addon.code] || 0
                  
                  return (
                    <div key={addon.code} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{addon.name}</h4>
                        <p className="text-sm text-gray-600">{addon.description}</p>
                        <p className="text-sm font-medium text-orange-600 mt-1">
                          {formatPrice(addon.price)} per item
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAddonQuantity(addon.code, quantity - 1)}
                          disabled={quantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAddonQuantity(addon.code, quantity + 1)}
                          disabled={quantity >= addon.maxQty}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Promo Code</h2>
              
              <div className="flex gap-3">
                <Input
                  placeholder="Enter promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button variant="outline" onClick={applyCoupon}>
                  Apply
                </Button>
              </div>
              
              {couponDiscount > 0 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Promo code applied! You save {formatPrice(couponDiscount)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Agreement */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rental Agreement</h2>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>By proceeding, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Return the vehicle in the same condition</li>
                  <li>Pay for any damages or traffic fines</li>
                  <li>Follow all traffic rules and regulations</li>
                  <li>Not use the vehicle for commercial purposes</li>
                  <li>Complete KYC verification before pickup</li>
                </ul>
              </div>
              
              <label className="flex items-start mt-4">
                <input
                  type="checkbox"
                  className="mt-1 mr-3"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  I accept the{' '}
                  <a href="/terms" className="text-orange-600 hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-orange-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base rental</span>
                  <span className="font-medium">{formatPrice(vehicle.pricing.subtotal)}</span>
                </div>
                
                {vehicle.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(vehicle.pricing.discount)}</span>
                  </div>
                )}
                
                {calculateAddonsTotal() > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extras</span>
                    <span className="font-medium">{formatPrice(calculateAddonsTotal())}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">{formatPrice(vehicle.pricing.taxes)}</span>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mt-2">
                  + {formatPrice(vehicle.pricing.deposit)} refundable deposit
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={proceedToPayment}
                disabled={!agreementAccepted}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Payment
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}