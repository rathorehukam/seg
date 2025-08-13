'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, Menu, X, User, LogOut, Wallet, History } from 'lucide-react'

interface HeaderProps {
  user?: {
    name: string
    role: string
    walletBalance?: number
  } | null
}

export function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount / 100)
  }

  const handleLogout = () => {
    // Clear auth token and redirect
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-orange-600" />
            <span className="text-xl font-bold text-gray-900">Rumble Cars</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/vehicles/search" className="text-gray-700 hover:text-orange-600 transition-colors">
              Browse Vehicles
            </Link>
            <Link href="/subscriptions" className="text-gray-700 hover:text-orange-600 transition-colors">
              Subscriptions
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-orange-600 transition-colors">
              Support
            </Link>
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <div className="bg-orange-100 rounded-full p-2">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.walletBalance !== undefined && (
                        <p className="text-sm text-orange-600">
                          Wallet: {formatCurrency(user.walletBalance)}
                        </p>
                      )}
                    </div>
                    
                    <Link href="/bookings" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <History className="h-4 w-4" />
                      <span>My Trips</span>
                    </Link>
                    
                    <Link href="/wallet" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <Wallet className="h-4 w-4" />
                      <span>Wallet</span>
                    </Link>
                    
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    
                    {user.role === 'STAFF' && (
                      <Link href="/staff" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <span>Staff Dashboard</span>
                      </Link>
                    )}
                    
                    {user.role === 'HOST' && (
                      <Link href="/host" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <span>Host Dashboard</span>
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/vehicles/search" className="text-gray-700 hover:text-orange-600 transition-colors">
                Browse Vehicles
              </Link>
              <Link href="/subscriptions" className="text-gray-700 hover:text-orange-600 transition-colors">
                Subscriptions
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-orange-600 transition-colors">
                Support
              </Link>

              {user ? (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-orange-100 rounded-full p-2">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                  
                  {user.walletBalance !== undefined && (
                    <p className="text-sm text-orange-600 ml-10">
                      Wallet: {formatCurrency(user.walletBalance)}
                    </p>
                  )}
                  
                  <Link href="/bookings" className="block text-gray-700 hover:text-orange-600 ml-10">
                    My Trips
                  </Link>
                  
                  <Link href="/wallet" className="block text-gray-700 hover:text-orange-600 ml-10">
                    Wallet
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="block text-red-600 hover:text-red-700 ml-10 text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}