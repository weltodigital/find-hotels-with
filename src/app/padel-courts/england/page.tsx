'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Hotel } from '@/types/hotel'
import { LOCATION_COORDINATES } from '@/lib/locationCoordinates'
import HotelCard from '@/components/HotelCard'
import HotelsMap from '@/components/HotelsMap'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function EnglandPadelPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    async function fetchEnglandPadelHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .ilike('description', '%padel%')
          .ilike('country', 'england')
          .order('name')

        if (error) throw error
        setHotels(data || [])
      } catch (error) {
        console.error('Error fetching England padel hotels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnglandPadelHotels()
  }, [])

  const applySorting = () => {
    let sortedHotels = [...hotels]

    switch (sortBy) {
      case 'name':
        sortedHotels.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'google_rating':
        sortedHotels.sort((a, b) => (b.google_rating || 0) - (a.google_rating || 0))
        break
      case 'price_low':
        sortedHotels.sort((a, b) => {
          const getPriceOrder = (priceRange: string | undefined) => {
            if (!priceRange) return 0
            if (priceRange.includes('£') || priceRange.includes('$')) {
              const priceLevel = (priceRange.match(/[£$]/g) || []).length
              return priceLevel
            }
            return 0
          }
          return getPriceOrder(a.price_range) - getPriceOrder(b.price_range)
        })
        break
      case 'price_high':
        sortedHotels.sort((a, b) => {
          const getPriceOrder = (priceRange: string | undefined) => {
            if (!priceRange) return 0
            if (priceRange.includes('£') || priceRange.includes('$')) {
              const priceLevel = (priceRange.match(/[£$]/g) || []).length
              return priceLevel
            }
            return 0
          }
          return getPriceOrder(b.price_range) - getPriceOrder(a.price_range)
        })
        break
    }

    return sortedHotels
  }

  const sortedHotels = applySorting()

  // Get England coordinates for map centering
  const rawEnglandCoords = LOCATION_COORDINATES.countries.england
  const englandCoords = {
    center: [rawEnglandCoords.center[0], rawEnglandCoords.center[1]] as [number, number],
    zoom: rawEnglandCoords.zoom
  }

  // Get unique counties from actual hotels
  const uniqueCounties = [...new Set(sortedHotels.map(hotel => hotel.county).filter(Boolean))].sort() as string[]

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Luxury Hotels with Padel Courts in England",
    "description": "Discover England's finest hotels featuring championship padel courts. From glass-enclosed facilities to exclusive country estates with premium courts.",
    "url": "https://findhotelswith.com/padel-courts/england",
    "about": {
      "@type": "Product",
      "name": "Padel Court Hotels in England",
      "description": "Luxury accommodations with professional padel facilities across England"
    },
    "hasPart": sortedHotels.map(hotel => ({
      "@type": "LodgingBusiness",
      "name": hotel.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotel.city,
        "addressRegion": hotel.county,
        "addressCountry": "England"
      },
      "aggregateRating": hotel.google_rating ? {
        "@type": "AggregateRating",
        "ratingValue": hotel.google_rating,
        "reviewCount": hotel.google_reviews_count || 0
      } : undefined,
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Padel Court",
          "value": true
        }
      ]
    })),
    "provider": {
      "@type": "Organization",
      "name": "Find Hotels With",
      "url": "https://findhotelswith.com"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading England padel court hotels...</div>
      </div>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <Header />
      <Breadcrumbs />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                Hotels with Padel Courts in England Near You
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} luxury hotels across England featuring championship-quality padel courts.
                From historic country estates to modern luxury resorts, find the perfect padel getaway in England.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-orange-100">Luxury Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{uniqueCounties.length}</div>
                  <div className="text-orange-100">English Counties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.4★</div>
                  <div className="text-orange-100">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Padel Court Hotels in England
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="price_high">Price (High to Low)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="google_rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Find Padel Court Hotels Across England
          </h2>
          <div className="bg-white rounded-lg shadow-lg">
            <HotelsMap
              hotels={sortedHotels}
              className="h-[600px]"
              center={englandCoords?.center}
              zoom={englandCoords?.zoom}
            />
          </div>
        </div>

        {/* County Links Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explore Padel Court Hotels by English County
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse our padel court hotels by specific counties across England. Each region offers unique venues and experiences.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {uniqueCounties.map((county) => {
                  const slug = county.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <Link
                      key={county}
                      href={`/padel-courts/england/${slug}`}
                      className="inline-block px-3 py-2 bg-gray-100 hover:bg-orange-100 text-sm text-gray-700 hover:text-orange-700 rounded transition-colors text-center"
                    >
                      {county}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">England's Padel Court Hotel Experience</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  England boasts some of the world's most prestigious padel venues, from championship glass-enclosed courts
                  to exclusive private estates. Our curated collection of {sortedHotels.length} luxury hotels with padel courts
                  across England offers guests the ultimate padel holiday experience.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Championship Padel Facilities</h3>
                <p className="text-gray-700 mb-6">
                  Each hotel in our England collection features professional-standard padel courts with glass enclosures,
                  premium artificial turf surfaces, and professional lighting. These venues cater to players of all abilities
                  seeking the quintessential English padel experience in luxury settings.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Regional Padel Excellence</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Surrey:</strong> Home to championship facilities like Foxhills Country Club and Beaverbrook,
                  offering world-class padel courts with luxury amenities and stunning countryside settings.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Hampshire & Somerset:</strong> Forest retreats and countryside estates combine padel excellence
                  with spa facilities and fine dining experiences.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Oxfordshire:</strong> Historic properties feature modern padel courts set within manicured estates
                  offering traditional English hospitality with contemporary sporting facilities.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Cornwall & Devon:</strong> Coastal padel resorts combine championship courts with stunning sea views
                  and unique settings that make every game memorable.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What Makes England's Padel Hotels Special</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Glass-enclosed courts with premium artificial turf surfaces</li>
                  <li>All-weather playing conditions year-round</li>
                  <li>Professional coaching from qualified instructors</li>
                  <li>Equipment hire including premium padel rackets and balls</li>
                  <li>Padel packages combining court time with luxury accommodation</li>
                  <li>Spa and wellness facilities for post-match recovery</li>
                  <li>Fine dining experiences showcasing English cuisine</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Times to Visit</h3>
                <p className="text-gray-700 mb-6">
                  Padel can be enjoyed year-round in England thanks to enclosed court facilities. Spring through autumn
                  offers the best overall experience with outdoor activities, while winter provides excellent indoor
                  playing conditions with cozy post-game amenities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What types of padel courts do England's luxury hotels offer?
                  </h3>
                  <p className="text-gray-700">
                    England's premier hotels feature glass-enclosed padel courts with premium artificial turf surfaces,
                    professional lighting for evening play, and climate-controlled environments. Many properties offer
                    multiple courts and indoor facilities for year-round padel.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Can I book padel lessons at these hotels?
                  </h3>
                  <p className="text-gray-700">
                    Most luxury padel hotels in England offer professional coaching from qualified instructors.
                    Lessons range from beginner sessions to advanced coaching, with many hotels providing
                    specialized programs and group clinics for all skill levels.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What's the best time to visit England for padel?
                  </h3>
                  <p className="text-gray-700">
                    Padel can be enjoyed year-round in England due to enclosed court facilities. Spring through
                    autumn offers the best combination of padel and outdoor activities, while winter provides
                    excellent indoor playing conditions with cozy amenities.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Do these hotels provide padel equipment?
                  </h3>
                  <p className="text-gray-700">
                    Yes, most luxury padel hotels in England provide racket hire, padel balls, and court booking
                    services. Premium properties often stock high-end equipment from leading padel brands and
                    offer equipment advice for players.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}