'use client'

import React, { useState } from 'react'
import { Search, MapPin, Calendar, Users, Zap, Shield, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function HomePage() {
  const [searchForm, setSearchForm] = useState({
    city: '',
    startDate: '',
    endDate: '',
    vehicleType: ''
  })

  const vehicleTypes = [
    { id: 'SCOOTER', name: 'Scooters', icon: '🛵', description: 'Perfect for city rides' },
    { id: 'BIKE', name: 'Bikes', icon: '🏍️', description: 'Adventure ready' },
    { id: 'CAR', name: 'Cars', icon: '🚗', description: 'Comfort & convenience' },
    { id: 'SUV', name: 'SUVs', icon: '🚙', description: 'Space for everyone' }
  ]

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      title: 'Instant Booking',
      description: 'Book in under 60 seconds with our quick flow'
    },
    {
      icon: <Shield className="h-6 w-6 text-orange-600" />,
      title: 'Fully Insured',
      description: 'All vehicles come with comprehensive insurance'
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your needs'
    },
    {
      icon: <Star className="h-6 w-6 text-orange-600" />,
      title: 'Quality Fleet',
      description: 'Well-maintained vehicles from trusted hosts'
    }
  ]

  const handleSearch = () => {
    if (!searchForm.city) {
      alert('Please select a city')
      return
    }
    if (!searchForm.startDate || !searchForm.endDate) {
      alert('Please select pickup and return dates')
      return
    }
    
    // Redirect to search results
    const params = new URLSearchParams({
      city: searchForm.city,
      startDate: searchForm.startDate,
      endDate: searchForm.endDate,
      ...(searchForm.vehicleType && { type: searchForm.vehicleType })
    })
    
    window.location.href = `/search?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">
                Rumble Cars
              </h1>
              <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
                Self Drive & Bike Rentals
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Login
              </Button>
              <Button size="sm">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Ride, Your Way
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover freedom with our self-drive cars and bikes. 
              Affordable, convenient, and always available across India.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <Input
                  icon={<MapPin className="h-4 w-4" />}
                  placeholder="Select City"
                  value={searchForm.city}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, city: e.target.value }))}
                  list="cities"
                />
                <datalist id="cities">
                  <option value="Mumbai" />
                  <option value="Delhi" />
                  <option value="Bangalore" />
                  <option value="Chennai" />
                  <option value="Hyderabad" />
                  <option value="Pune" />
                  <option value="Kolkata" />
                  <option value="Ahmedabad" />
                </datalist>
              </div>
              
              <div>
                <Input
                  type="datetime-local"
                  icon={<Calendar className="h-4 w-4" />}
                  placeholder="Pickup Date & Time"
                  value={searchForm.startDate}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <div>
                <Input
                  type="datetime-local"
                  icon={<Calendar className="h-4 w-4" />}
                  placeholder="Return Date & Time"
                  value={searchForm.endDate}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, endDate: e.target.value }))}
                  min={searchForm.startDate || new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <div>
                <select
                  className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={searchForm.vehicleType}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, vehicleType: e.target.value }))}
                >
                  <option value="">All Vehicle Types</option>
                  {vehicleTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button 
              onClick={handleSearch}
              size="lg" 
              className="w-full"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Vehicles
            </Button>
          </div>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Ride
            </h3>
            <p className="text-lg text-gray-600">
              From zippy scooters to spacious SUVs, find the perfect vehicle for every journey
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleTypes.map((type) => (
              <div 
                key={type.id}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-orange-50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSearchForm(prev => ({ ...prev, vehicleType: type.id }))}
              >
                <div className="text-4xl mb-3">{type.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.name}
                </h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Rumble Cars?
            </h3>
            <p className="text-lg text-gray-600">
              Experience the best in self-drive rentals with our premium features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Hit the Road?
          </h3>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Rumble Cars for their travel needs.
            Book now and get instant confirmation!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-orange-600 hover:bg-orange-50">
              Download App
            </Button>
            <Button size="lg" variant="secondary">
              Call Us: 1800-RUMBLE
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold text-orange-400 mb-4">Rumble Cars</h4>
              <p className="text-gray-400">
                India's trusted self-drive rental platform. Your journey, our passion.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400">How it Works</a></li>
                <li><a href="#" className="hover:text-orange-400">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-400">Locations</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-400">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-orange-400">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-400">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-orange-400">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-orange-400">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2024 Rumble Cars. All rights reserved. Made in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
