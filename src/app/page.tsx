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
      filtered = filtered.filter(hotel => hotel.rating && hotel.rating >= filters.rating_min)
    }

    if (filters.special_features?.length > 0) {
      filtered = filtered.filter(hotel =>
        hotel.special_features && filters.special_features.some((feature: string) =>
          hotel.special_features.includes(feature)
        )
      )
    }

    if (filters.amenities?.length > 0) {
      filtered = filtered.filter(hotel =>
        hotel.amenities && filters.amenities.some((amenity: string) =>
          hotel.amenities.includes(amenity)
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

        {/* All Hotels Section */}
        <section id="all-hotels" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                All Luxury Hotels
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Browse our complete collection of {hotels.length} premium hotels with extraordinary amenities.
                Use filters to find exactly what you're looking for.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <div className="sticky top-8">
                  <SearchFilters onFilterChange={handleFilterChange} />
                </div>
              </aside>

              <section className="lg:col-span-3" id="search-results">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {searchActive ? (
                      `${filteredHotels.length} ${filteredHotels.length === 1 ? 'Hotel' : 'Hotels'} Found`
                    ) : (
                      `${hotels.length} Hotels Available`
                    )}
                  </h3>

                  {searchActive && (
                    <button
                      onClick={() => {
                        setFilteredHotels(hotels)
                        setSearchActive(false)
                        setShowAllHotels(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {filteredHotels.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No hotels found
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <button
                      onClick={() => {
                        setFilteredHotels(hotels)
                        setSearchActive(false)
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Show All Hotels
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(showAllHotels ? filteredHotels : filteredHotels.slice(0, 9)).map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                )}

                {!showAllHotels && filteredHotels.length > 9 && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => setShowAllHotels(true)}
                      className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
                    >
                      Show All {filteredHotels.length} Hotels
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Hotel?
            </h2>
            <p className="text-xl mb-8">
              Discover luxury accommodations with the amenities that matter most to you.
              From padel courts to private pools, find exactly what you're looking for.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('all-hotels')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors duration-300"
            >
              Browse All Hotels
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
