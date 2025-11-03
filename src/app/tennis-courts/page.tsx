'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Hotel } from '@/types/hotel'
import HotelCard from '@/components/HotelCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HotelsMap from '@/components/HotelsMap'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function TennisCourtHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    fetchTennisHotels()
  }, [])

  useEffect(() => {
    applySorting()
  }, [hotels, sortBy])

  const applySorting = () => {
    let sortedHotels = [...hotels]

    switch (sortBy) {
      case 'google_rating':
        sortedHotels.sort((a, b) => {
          const ratingA = a.google_rating || 0
          const ratingB = b.google_rating || 0
          return ratingB - ratingA // Highest rating first
        })
        break
      case 'price_low':
        sortedHotels.sort((a, b) => {
          // Convert price ranges to numeric values for sorting
          const getPriceOrder = (priceRange: string | undefined) => {
            if (!priceRange) return 999
            if (priceRange.includes('£') || priceRange.includes('$')) {
              const priceLevel = (priceRange.match(/[£$]/g) || []).length
              return priceLevel
            }
            return 999
          }
          return getPriceOrder(a.price_range) - getPriceOrder(b.price_range) // Lowest price first
        })
        break
      case 'price_high':
        sortedHotels.sort((a, b) => {
          // Convert price ranges to numeric values for sorting
          const getPriceOrder = (priceRange: string | undefined) => {
            if (!priceRange) return 0 // No price goes to bottom for high-to-low
            if (priceRange.includes('£') || priceRange.includes('$')) {
              const priceLevel = (priceRange.match(/[£$]/g) || []).length
              return priceLevel
            }
            return 0
          }
          return getPriceOrder(b.price_range) - getPriceOrder(a.price_range) // Highest price first
        })
        break
      case 'name':
      default:
        sortedHotels.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredHotels(sortedHotels)
  }

  const fetchTennisHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Filter hotels with tennis courts in descriptions for now
      const tennisHotels = (data || []).filter(hotel =>
        hotel.description &&
        (hotel.description.toLowerCase().includes('tennis') ||
         hotel.description.toLowerCase().includes('racquet') ||
         hotel.description.toLowerCase().includes('racket'))
      )

      setHotels(tennisHotels)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-xl">Loading tennis court hotels...</div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      {/* Schema Markup for Tennis Court Hotels */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "UK Hotels with Tennis Courts",
            "description": "Comprehensive directory of luxury hotels across the United Kingdom featuring professional tennis courts, championship facilities, and world-class accommodation.",
            "url": "https://findhotelswith.com/tennis-courts",
            "mainEntity": {
              "@type": "ItemList",
              "name": "UK Hotels with Tennis Courts",
              "numberOfItems": filteredHotels.length,
              "itemListElement": filteredHotels.slice(0, 20).map((hotel, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Hotel",
                  "name": hotel.name,
                  "description": hotel.description,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": hotel.city,
                    "addressCountry": "United Kingdom"
                  },
                  "amenityFeature": [
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Tennis Court",
                      "value": true
                    }
                  ],
                  "url": hotel.website || hotel.booking_url
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://findhotelswith.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Tennis Court Hotels",
                  "item": "https://findhotelswith.com/tennis-courts"
                }
              ]
            }
          })
        }}
      />

      <Header />
      <Breadcrumbs />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                UK Hotels with Tennis Courts
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                Discover the finest luxury hotels across the United Kingdom featuring championship tennis courts,
                professional facilities, and world-class accommodation. From Wimbledon-standard courts to
                all-weather surfaces, find your perfect tennis holiday destination.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg mb-8">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                  🎾 {filteredHotels.length} Hotels Available
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                  🏆 Championship Facilities
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                  🇬🇧 Across the UK
                </span>
              </div>

              {/* Anchor Button to Hotels List */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const element = document.getElementById('hotels-list')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors shadow-md border-2 border-green-200"
                >
                  Browse All Hotels ↓
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Country Links Section */}
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore by Country
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover tennis court hotels across England, Scotland, and Wales. Each country offers unique venues from historic estates to modern luxury resorts.
              </p>
            </div>

            <div className="space-y-8 max-w-6xl mx-auto">
              {/* England Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center bg-gray-50 p-6">
                  <div className="text-gray-700 text-4xl mr-6">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">England</h3>
                      <Link href="/tennis-courts/england" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        View All England Hotels →
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      67 luxury hotels featuring championship courts from Wimbledon-standard grass to modern facilities across historic estates.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">All Counties:</p>
                  <div className="flex flex-wrap gap-2">
                        <Link href="/tennis-courts/england/bedfordshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Bedfordshire
                        </Link>
                        <Link href="/tennis-courts/england/berkshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Berkshire
                        </Link>
                        <Link href="/tennis-courts/england/buckinghamshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Buckinghamshire
                        </Link>
                        <Link href="/tennis-courts/england/cambridgeshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Cambridgeshire
                        </Link>
                        <Link href="/tennis-courts/england/cornwall" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Cornwall
                        </Link>
                        <Link href="/tennis-courts/england/cumbria" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Cumbria
                        </Link>
                        <Link href="/tennis-courts/england/derbyshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Derbyshire
                        </Link>
                        <Link href="/tennis-courts/england/devon" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Devon
                        </Link>
                        <Link href="/tennis-courts/england/dorset" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Dorset
                        </Link>
                        <Link href="/tennis-courts/england/durham" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Durham
                        </Link>
                        <Link href="/tennis-courts/england/essex" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Essex
                        </Link>
                        <Link href="/tennis-courts/england/gloucestershire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Gloucestershire
                        </Link>
                        <Link href="/tennis-courts/england/greater-london" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Greater London
                        </Link>
                        <Link href="/tennis-courts/england/hampshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Hampshire
                        </Link>
                        <Link href="/tennis-courts/england/hertfordshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Hertfordshire
                        </Link>
                        <Link href="/tennis-courts/england/kent" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Kent
                        </Link>
                        <Link href="/tennis-courts/england/leicestershire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Leicestershire
                        </Link>
                        <Link href="/tennis-courts/england/lincolnshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Lincolnshire
                        </Link>
                        <Link href="/tennis-courts/england/northamptonshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Northamptonshire
                        </Link>
                        <Link href="/tennis-courts/england/northumberland" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Northumberland
                        </Link>
                        <Link href="/tennis-courts/england/nottinghamshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Nottinghamshire
                        </Link>
                        <Link href="/tennis-courts/england/oxfordshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Oxfordshire
                        </Link>
                        <Link href="/tennis-courts/england/shropshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Shropshire
                        </Link>
                        <Link href="/tennis-courts/england/somerset" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Somerset
                        </Link>
                        <Link href="/tennis-courts/england/south-yorkshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          South Yorkshire
                        </Link>
                        <Link href="/tennis-courts/england/staffordshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Staffordshire
                        </Link>
                        <Link href="/tennis-courts/england/suffolk" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Suffolk
                        </Link>
                        <Link href="/tennis-courts/england/surrey" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Surrey
                        </Link>
                        <Link href="/tennis-courts/england/warwickshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Warwickshire
                        </Link>
                        <Link href="/tennis-courts/england/west-sussex" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          West Sussex
                        </Link>
                        <Link href="/tennis-courts/england/wiltshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Wiltshire
                        </Link>
                        <Link href="/tennis-courts/england/worcestershire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Worcestershire
                        </Link>
                        <Link href="/tennis-courts/england/north-yorkshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          North Yorkshire
                        </Link>
                        <Link href="/tennis-courts/england/isle-of-wight" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Isle of Wight
                        </Link>
                      </div>
                </div>
              </div>

              {/* Scotland Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center bg-gray-50 p-6">
                  <div className="text-gray-700 text-4xl mr-6">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">Scotland</h3>
                      <Link href="/tennis-courts/scotland" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        View All Scotland Hotels →
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      5 exceptional hotels with tennis courts set against Highland landscapes, including the world-famous Gleneagles resort.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">All Counties:</p>
                  <div className="flex flex-wrap gap-2">
                        <Link href="/tennis-courts/scotland/aberdeenshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Aberdeenshire
                        </Link>
                        <Link href="/tennis-courts/scotland/fife" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Fife
                        </Link>
                        <Link href="/tennis-courts/scotland/perth-and-kinross" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Perth and Kinross
                        </Link>
                        <Link href="/tennis-courts/scotland/stirling" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Stirling
                        </Link>
                        <Link href="/tennis-courts/scotland/west-dunbartonshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          West Dunbartonshire
                        </Link>
                      </div>
                </div>
              </div>

              {/* Wales Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center bg-gray-50 p-6">
                  <div className="text-gray-700 text-4xl mr-6">🏴󠁧󠁢󠁷󠁬󠁳󠁿</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">Wales</h3>
                      <Link href="/tennis-courts/wales" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        View All Wales Hotels →
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      3 premier destinations including Celtic Manor Resort, featuring courts with stunning mountain and coastal views.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">All Counties:</p>
                  <div className="flex flex-wrap gap-2">
                        <Link href="/tennis-courts/wales/gwynedd" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Gwynedd
                        </Link>
                        <Link href="/tennis-courts/wales/newport" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Newport
                        </Link>
                        <Link href="/tennis-courts/wales/vale-of-glamorgan" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Vale of Glamorgan
                        </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hotels Listing Section */}
        <section id="hotels-list" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {filteredHotels.length} UK Hotels with Tennis Courts
              </h2>
              <p className="text-xl text-gray-600">
                Luxury accommodation with championship tennis facilities
              </p>
            </div>

            {/* Sorting Controls */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'google_rating' | 'price_low' | 'price_high')}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="google_rating">Rating (High to Low)</option>
                    <option value="price_low">Price (Low to High)</option>
                    <option value="price_high">Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredHotels.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tennis court hotels found
                </h3>
                <p className="text-gray-600">
                  Please check back later as we add more properties
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find A Hotel With Tennis Courts Near You
              </h2>
              <p className="text-xl text-gray-600">
                Interactive map showing all UK hotels with tennis courts. Click markers for hotel details.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <HotelsMap
                hotels={filteredHotels}
                className="h-[500px] md:h-[600px] lg:h-[700px] w-full"
              />
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                🗺️ Powered by OpenStreetMap • Click markers to view hotel details
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                The Ultimate Guide to UK Hotels with Tennis Courts
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8">
                  Whether you're a professional player, tennis enthusiast, or simply looking for active leisure
                  during your stay, the United Kingdom offers an exceptional collection of hotels with world-class
                  tennis facilities. From historic country estates to modern luxury resorts, these properties
                  combine outstanding accommodation with championship-quality courts.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Why Choose UK Tennis Hotels?
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Professional championship-standard courts
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        All-weather playing surfaces including clay, grass, and hard courts
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Professional coaching and equipment hire available
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Luxury spa and wellness facilities for post-game recovery
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Fine dining and premium accommodation
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Top Tennis Destinations in the UK
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>London & Surrey:</strong> Championship venues near Wimbledon
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Scotland:</strong> Highland resorts with stunning mountain backdrops
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Cotswolds:</strong> Historic estates in picture-perfect settings
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Wales:</strong> Luxury resorts with multiple indoor and outdoor courts
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Hampshire:</strong> Country clubs with professional-standard facilities
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Featured Tennis Court Hotels Across the UK
                </h3>
                <p className="text-gray-600 mb-8">
                  Our curated selection includes properties that go beyond basic court facilities, offering
                  championship-quality playing surfaces, professional coaching, equipment hire, and luxury
                  amenities. Many feature multiple courts with different surfaces, allowing guests to experience
                  clay, grass, and hard court tennis all in one location.
                </p>

                <div className="bg-green-50 p-6 rounded-lg mb-8">
                  <h4 className="text-xl font-semibold text-green-900 mb-4">
                    🏆 Championship Standard Facilities
                  </h4>
                  <p className="text-green-800">
                    Many of our featured hotels maintain courts to professional tournament standards,
                    including proper lighting for evening play, spectator seating, and surfaces maintained
                    by qualified groundsmen. Some properties even host professional tournaments and coaching clinics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What types of tennis courts do UK hotels typically offer?
                </h3>
                <p className="text-gray-600">
                  UK hotels with tennis facilities typically offer a variety of court surfaces including hard courts
                  (most common), grass courts (especially in traditional English settings), clay courts, and
                  all-weather artificial surfaces. Many premium properties feature multiple court types and
                  indoor/outdoor options.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Do I need to bring my own tennis equipment?
                </h3>
                <p className="text-gray-600">
                  Most hotels with tennis facilities offer racket and ball hire, though availability and quality
                  vary. Professional-standard venues often provide premium equipment. We recommend checking with
                  your chosen hotel about equipment availability and consider bringing your own racket if you're particular about specifications.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Are tennis coaching services available at these hotels?
                </h3>
                <p className="text-gray-600">
                  Many of our featured hotels employ resident tennis professionals who offer coaching for all
                  skill levels, from beginners to advanced players. Some also host tennis camps and clinics.
                  Professional coaching should be booked in advance, especially during peak seasons.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What's the best time of year for tennis holidays in the UK?
                </h3>
                <p className="text-gray-600">
                  The traditional UK tennis season runs from April through September, with peak conditions in
                  May through August. However, many hotels offer indoor courts year-round. Spring and early
                  autumn often provide the best combination of good weather and lower accommodation rates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Book Your Tennis Holiday?
            </h2>
            <p className="text-xl mb-8">
              Discover championship tennis facilities at luxury hotels across the United Kingdom.
              Perfect your game while enjoying world-class accommodation and amenities.
            </p>
            <a
              href="#tennis-hotels"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Browse Tennis Court Hotels
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}