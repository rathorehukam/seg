'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Car, 
  Clock, 
  Shield, 
  Smartphone, 
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  Play,
  Award,
  Users,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const [searchData, setSearchData] = useState({
    city: '',
    startDate: '',
    endDate: '',
    vehicleType: ''
  })

  const handleSearch = () => {
    const params = new URLSearchParams({
      city: searchData.city,
      from: searchData.startDate,
      to: searchData.endDate,
      ...(searchData.vehicleType && { type: searchData.vehicleType })
    })
    window.location.href = `/vehicles/search?${params.toString()}`
  }

  const vehicleTypes = [
    { id: 'CAR', name: 'Cars', icon: '🚗' },
    { id: 'SUV', name: 'SUVs', icon: '🚙' },
    { id: 'BIKE', name: 'Bikes', icon: '🏍️' },
    { id: 'SCOOTER', name: 'Scooters', icon: '🛵' }
  ]

  const features = [
    {
      icon: <Smartphone className="h-8 w-8 text-orange-600" />,
      title: 'Keyless Pickup',
      description: 'Unlock your vehicle with our app when you arrive at pickup location'
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: 'Flexible Booking',
      description: 'Book by hour or day. Extend trips on-the-go with instant approval'
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      title: 'Comprehensive Insurance',
      description: 'Full coverage included with every booking for peace of mind'
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: '24/7 Support',
      description: 'Round-the-clock assistance and roadside support across India'
    }
  ]

  const stats = [
    { value: '50,000+', label: 'Happy Customers' },
    { value: '1,000+', label: 'Vehicles' },
    { value: '25+', label: 'Cities' },
    { value: '4.8★', label: 'Average Rating' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your Journey,
                <span className="text-orange-600"> Your Way</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience the freedom of self-drive car and bike rentals across India. 
                Book hourly or daily with keyless pickup and comprehensive insurance.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8">
                  Start Your Journey
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Find Your Perfect Ride
              </h3>
              
              <div className="space-y-4">
                {/* City Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Pick-up City
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter city (e.g., Mumbai, Delhi)"
                    value={searchData.city}
                    onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                  />
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Start Date
                    </label>
                    <Input
                      type="datetime-local"
                      value={searchData.startDate}
                      onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="datetime-local"
                      value={searchData.endDate}
                      onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                      min={searchData.startDate || new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>

                {/* Vehicle Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Car className="h-4 w-4 inline mr-1" />
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSearchData({ 
                          ...searchData, 
                          vehicleType: searchData.vehicleType === type.id ? '' : type.id 
                        })}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          searchData.vehicleType === type.id
                            ? 'border-orange-600 bg-orange-50 text-orange-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-sm font-medium">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <Button 
                  onClick={handleSearch}
                  className="w-full py-3 text-lg"
                  disabled={!searchData.city || !searchData.startDate || !searchData.endDate}
                >
                  Search Vehicles
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                Instant booking • No hidden charges • 24/7 support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rumble Cars?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've reimagined car rentals for the modern traveler. Experience convenience, 
              safety, and flexibility like never before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Adventure
            </h2>
            <p className="text-xl text-gray-600">
              From city commutes to weekend getaways, we have the perfect vehicle for every journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleTypes.map((type) => (
              <Link
                key={type.id}
                href={`/vehicles/search?type=${type.id}`}
                className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {type.name}
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Starting from ₹499/day
                  </p>
                  <div className="flex items-center justify-center mt-4 text-orange-600 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Explore {type.name}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Hit the Road?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of satisfied customers who choose Rumble Cars for their travel needs. 
              Book your first ride today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="outline" className="bg-white text-orange-600 hover:bg-gray-50 px-8">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/vehicles/search">
                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white hover:text-orange-600 px-8">
                  Browse Vehicles
                </Button>
              </Link>
            </div>

            <p className="text-orange-100 text-sm mt-6">
              No subscription fees • Pay per use • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-8 w-8 text-orange-600" />
                <span className="text-xl font-bold">Rumble Cars</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for self-drive car and bike rentals across India.
              </p>
              <div className="flex space-x-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-400 ml-2">4.8/5 rating</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/vehicles/search?type=CAR" className="hover:text-white">Car Rentals</Link></li>
                <li><Link href="/vehicles/search?type=BIKE" className="hover:text-white">Bike Rentals</Link></li>
                <li><Link href="/subscriptions" className="hover:text-white">Subscriptions</Link></li>
                <li><Link href="/corporate" className="hover:text-white">Corporate Plans</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Guidelines</Link></li>
                <li><Link href="/insurance" className="hover:text-white">Insurance Info</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Rumble Cars. All rights reserved. | Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
