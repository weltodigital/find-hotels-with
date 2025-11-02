'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Hotel } from '@/types/hotel'
import HotelCard from '@/components/HotelCard'
import SearchFilters from '@/components/SearchFilters'

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const handleFilterChange = (filters: any) => {
    let filtered = [...hotels]

    if (filters.location) {
      filtered = filtered.filter(hotel =>
        hotel.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        hotel.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        hotel.country.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.rating_min > 0) {
      filtered = filtered.filter(hotel => hotel.rating >= filters.rating_min)
    }

    if (filters.special_features?.length > 0) {
      filtered = filtered.filter(hotel =>
        filters.special_features.some((feature: string) =>
          hotel.special_features.includes(feature)
        )
      )
    }

    if (filters.amenities?.length > 0) {
      filtered = filtered.filter(hotel =>
        filters.amenities.some((amenity: string) =>
          hotel.amenities.includes(amenity)
        )
      )
    }

    setFilteredHotels(filtered)
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Hotels With Special Amenities
          </h1>
          <p className="text-gray-600 mt-2">
            Discover unique hotels with extraordinary features like padel courts,
            in-room hot tubs, and more
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <SearchFilters onFilterChange={handleFilterChange} />
          </aside>

          <section className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredHotels.length} Hotels Found
              </h2>
            </div>

            {filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hotels found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
