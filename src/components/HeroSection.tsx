'use client'

import { useState } from 'react'
import { SPECIAL_FEATURES } from '@/types/hotel'

interface HeroSectionProps {
  onSearch: (searchTerm: string) => void
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Hotels With
            <span className="block text-yellow-300">Extraordinary Amenities</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover luxury hotels featuring unique amenities like padel courts, in-room hot tubs,
            private pools, tennis courts, world-class spas, and exclusive facilities that make your stay unforgettable.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, hotel name, or amenity..."
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors duration-300 text-lg"
              >
                Search Hotels
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {SPECIAL_FEATURES.slice(0, 10).map((feature) => (
              <button
                key={feature}
                onClick={() => onSearch(feature.replace('_', ' '))}
                className="px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white border-opacity-30"
              >
                {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-gray-50">
          <path d="M1200 120L0 16.48V0h1200v120z" />
        </svg>
      </div>
    </section>
  )
}