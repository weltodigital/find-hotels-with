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

      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Hotels With
            <span className="block text-yellow-300">Extraordinary Facilities</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover luxury hotels featuring unique facilities like padel courts, in-room hot tubs,
            private pools, tennis courts, world-class spas, and exclusive amenities that make your stay unforgettable.
          </p>

        </div>
      </div>

    </section>
  )
}