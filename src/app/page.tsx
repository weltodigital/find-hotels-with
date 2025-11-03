'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Hotel } from '@/types/hotel'
import HotelCard from '@/components/HotelCard'
import SearchFilters from '@/components/SearchFilters'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import FeaturedHotels from '@/components/FeaturedHotels'
import SchemaMarkup from '@/components/SchemaMarkup'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllHotels, setShowAllHotels] = useState(false)
  const [searchActive, setSearchActive] = useState(false)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setHotels(data || [])
      setFilteredHotels(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredHotels(hotels)
      setSearchActive(false)
      return
    }

    const filtered = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.address && hotel.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (hotel.location && hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (hotel.description && hotel.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (hotel.special_features && hotel.special_features.some(feature =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (hotel.amenities && hotel.amenities.some(amenity =>
        amenity.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )

    setFilteredHotels(filtered)
    setSearchActive(true)
    setShowAllHotels(true)

    // Scroll to results
    const element = document.getElementById('search-results')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleFilterChange = (filters: any) => {
    let filtered = [...hotels]

    if (filters.location) {
      filtered = filtered.filter(hotel =>
        (hotel.location && hotel.location.toLowerCase().includes(filters.location.toLowerCase())) ||
        hotel.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        hotel.country.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.rating_min > 0) {
      filtered = filtered.filter(hotel =>
        (hotel.star_rating && hotel.star_rating >= filters.rating_min) ||
        (hotel.rating && hotel.rating >= filters.rating_min)
      )
    }

    if (filters.special_features?.length > 0) {
      filtered = filtered.filter(hotel =>
        hotel.special_features && filters.special_features.some((feature: string) =>
          hotel.special_features!.includes(feature)
        )
      )
    }

    if (filters.amenities?.length > 0) {
      filtered = filtered.filter(hotel =>
        hotel.amenities && filters.amenities.some((amenity: string) =>
          hotel.amenities!.includes(amenity)
        )
      )
    }

    setFilteredHotels(filtered)
    setSearchActive(true)
    setShowAllHotels(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading hotels...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <>
      <SchemaMarkup type="website" />
      <SchemaMarkup type="hotels" hotels={hotels} />

      <Header />

      <div className="min-h-screen bg-gray-50 pt-16">
        <section id="hero">
          <HeroSection onSearch={handleSearch} />
        </section>

        <section id="features">
          <FeaturesSection hotelCount={hotels.length} />
        </section>

        <section id="featured-hotels">
          <FeaturedHotels hotels={hotels} />
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Hotel?
            </h2>
            <p className="text-xl mb-8">
              Discover luxury accommodations with the amenities that matter most to you.
              From tennis courts to private pools, find exactly what you're looking for.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
