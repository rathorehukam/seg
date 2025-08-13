'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Fuel, 
  Settings,
  ArrowLeft,
  ChevronDown,
  Heart,
  Share
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Vehicle {
  id: string
  plateNo: string
  make: string
  model: string
  year: number
  type: string
  color: string
  seats: number
  photos: string[]
  pickupLoc: {
    name: string
    address: string
  }
  dropLoc: {
    name: string
    address: string
  }
  averageRating: number
  totalTrips: number
  pricing: {
    baseRate: number
    total: number
    deposit: number
    durationHours: number
    extraCharges?: {
      demandMultiplier?: number
      weekendMultiplier?: number
    }
  }
  distance: number
  fuelPolicy: string
  kmLimitDay: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    type: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    seats: '',
    sortBy: 'price',
    sortOrder: 'asc'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [filters])

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        city: filters.city,
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.type && { type: filters.type }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.seats && { seats: filters.seats }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      const response = await fetch(`/api/vehicles/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setVehicles(data.data.vehicles)
      } else {
        console.error('Search failed:', data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours} hours`
    }
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} days`
  }

  const handleBookNow = (vehicleId: string) => {
    const bookingParams = new URLSearchParams({
      vehicleId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      pickupCity: filters.city
    })
    
    window.location.href = `/booking/review?${bookingParams.toString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for available vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 ml-4">
                {filters.city} • {vehicles.length} vehicles available
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Summary */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {filters.city}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(filters.startDate).toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              {' → '}
              {new Date(filters.endDate).toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {vehicles.length > 0 && (
              <div className="text-orange-600 font-medium">
                {formatDuration(vehicles[0]?.pricing.durationHours || 0)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">All Types</option>
                  <option value="SCOOTER">Scooter</option>
                  <option value="BIKE">Bike</option>
                  <option value="CAR">Car</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="₹ Min"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="₹ Max"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={filters.seats}
                  onChange={(e) => setFilters(prev => ({ ...prev, seats: e.target.value }))}
                >
                  <option value="">Any</option>
                  <option value="2">2+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                  <option value="7">7+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    type: '',
                    minPrice: '',
                    maxPrice: '',
                    seats: '',
                    sortBy: 'price'
                  }))}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No vehicles available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search criteria or selecting different dates to find available vehicles.
            </p>
            <Button 
              className="mt-6"
              onClick={() => window.history.back()}
            >
              Modify Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                {/* Vehicle Image */}
                <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                  {vehicle.photos.length > 0 ? (
                    <img
                      src={vehicle.photos[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🚗</div>
                        <p className="text-sm">No image available</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                      {vehicle.type}
                    </span>
                  </div>
                  
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white">
                      <Share className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  
                  {vehicle.pricing.extraCharges?.demandMultiplier && vehicle.pricing.extraCharges.demandMultiplier > 1 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        High Demand
                      </span>
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {vehicle.year} • {vehicle.color}
                      </p>
                    </div>
                    {vehicle.averageRating > 0 && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {vehicle.averageRating}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({vehicle.totalTrips})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Features */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {vehicle.seats} seats
                    </div>
                    <div className="flex items-center">
                      <Fuel className="h-4 w-4 mr-1" />
                      {vehicle.fuelPolicy.replace('_', ' ')}
                    </div>
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-1" />
                      {vehicle.kmLimitDay}km/day
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {vehicle.pickupLoc.name}
                      {vehicle.distance > 0 && (
                        <span className="text-orange-600 ml-1">
                          • {vehicle.distance}km away
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(vehicle.pricing.total)}
                        </p>
                        <p className="text-sm text-gray-600">
                          for {formatDuration(vehicle.pricing.durationHours)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          + {formatPrice(vehicle.pricing.deposit)} deposit
                        </p>
                        {vehicle.pricing.extraCharges?.weekendMultiplier && (
                          <p className="text-xs text-orange-600">
                            Weekend pricing
                          </p>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleBookNow(vehicle.id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}