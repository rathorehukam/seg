import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rumble Cars – Self Drive & Bike Rentals',
  description: 'Premium self-drive car and bike rentals across India. Book hourly or daily with keyless pickup, comprehensive insurance, and 24/7 support.',
  keywords: 'car rental, bike rental, self drive, India, keyless, hourly rental, daily rental',
  openGraph: {
    title: 'Rumble Cars – Self Drive & Bike Rentals',
    description: 'Premium self-drive car and bike rentals across India',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
