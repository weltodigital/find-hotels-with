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

export default function ScotlandPadelPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    async function fetchScotlandPadelHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .ilike('description', '%padel%')
          .ilike('country', 'scotland')
          .order('name')

        if (error) throw error
        setHotels(data || [])
      } catch (error) {
        console.error('Error fetching Scotland padel hotels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchScotlandPadelHotels()
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

  // Get Scotland coordinates for map centering
  const rawScotlandCoords = LOCATION_COORDINATES.countries.scotland
  const scotlandCoords = {
    center: [rawScotlandCoords.center[0], rawScotlandCoords.center[1]] as [number, number],
    zoom: rawScotlandCoords.zoom
  }

  // Get unique counties from actual hotels
  const uniqueCounties = [...new Set(sortedHotels.map(hotel => hotel.county).filter(Boolean))].sort() as string[]

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Luxury Hotels with Padel Courts in Scotland",
    "description": "Discover Scotland's premier hotels featuring championship padel courts. From Highland estates to Lowland luxury resorts with world-class padel facilities.",
    "url": "https://findhotelswith.com/padel-courts/scotland",
    "about": {
      "@type": "Product",
      "name": "Padel Court Hotels in Scotland",
      "description": "Luxury accommodations with professional padel facilities across Scotland"
    },
    "hasPart": sortedHotels.map(hotel => ({
      "@type": "LodgingBusiness",
      "name": hotel.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotel.city,
        "addressRegion": hotel.county,
        "addressCountry": "Scotland"
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
        <div className="text-xl">Loading Scotland padel court hotels...</div>
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
                Hotels with Padel Courts in Scotland Near You
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} exceptional hotels across Scotland featuring world-class padel courts.
                From Highland castles to luxurious golf resorts, experience padel against Scotland's breathtaking landscapes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-orange-100">Luxury Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">32</div>
                  <div className="text-orange-100">Scottish Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-orange-100">World-Class Standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Padel Court Hotels in Scotland
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
            Discover Padel Court Hotels Across Scotland
          </h2>
          <div className="bg-white rounded-lg shadow-lg">
            <HotelsMap
              hotels={sortedHotels}
              className="h-[600px]"
              center={scotlandCoords?.center}
              zoom={scotlandCoords?.zoom}
            />
          </div>
        </div>

        {/* County Links Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explore Padel Court Hotels by Scottish County
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse our padel court hotels across Scotland's most beautiful counties, from Highland resorts to coastal venues.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {uniqueCounties.map((county) => {
                  const slug = county.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <Link
                      key={county}
                      href={`/padel-courts/scotland/${slug}`}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Scotland's Padel Heritage & Modern Excellence</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  Scotland's padel heritage combines Highland grandeur with championship excellence. Our curated collection
                  of {sortedHotels.length} luxury hotels with padel courts showcases Scotland's finest padel destinations,
                  from historic castle estates to world-renowned golf and padel resorts.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Championship Padel in Scotland's Finest Settings</h3>
                <p className="text-gray-700 mb-6">
                  Scottish padel hotels offer unparalleled experiences, with courts set against dramatic Highland backdrops,
                  loch-side locations, and historic castle grounds. These venues combine traditional Scottish hospitality
                  with modern padel facilities, creating unforgettable sporting holidays.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Scotland's Padel Regions</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Central Scotland & Perthshire:</strong> Home to Gleneagles, Scotland's most famous padel destination,
                  featuring multiple championship courts within a world-class resort setting.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>The Highlands & Islands:</strong> Exclusive Highland lodges and castle hotels offering padel courts
                  with spectacular mountain and loch views, perfect for luxury padel retreats.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Lowlands & Borders:</strong> Historic properties and modern resorts featuring padel courts
                  set within Scotland's gentler southern landscapes and countryside estates.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>West Coast & Islands:</strong> Unique island padel experiences with courts offering dramatic
                  coastal views and exclusive access to Scotland's most remote luxury properties.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">World-Class Padel Facilities</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Glass-enclosed courts with premium artificial turf surfaces</li>
                  <li>All-weather playing conditions year-round</li>
                  <li>Professional coaching from qualified instructors</li>
                  <li>Equipment hire including premium padel rackets and balls</li>
                  <li>Padel packages combining court time with luxury accommodation</li>
                  <li>Spa and wellness facilities for post-match recovery</li>
                  <li>Fine dining experiences showcasing Scottish cuisine</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Scottish Padel Experience</h3>
                <p className="text-gray-700 mb-6">
                  Playing padel in Scotland offers unique experiences unavailable elsewhere. Imagine serving against
                  a backdrop of ancient castles, Highland peaks, or pristine lochs. Many Scottish padel hotels also
                  feature championship golf courses, creating the perfect combination for racquet and club sports enthusiasts.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Times for Padel in Scotland</h3>
                <p className="text-gray-700 mb-6">
                  Padel can be enjoyed year-round in Scotland thanks to enclosed court facilities. The best conditions typically occur in
                  May through September. Summer months offer the longest days (up to 18 hours of daylight in June),
                  while spring and autumn provide ideal playing temperatures and stunning seasonal scenery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Scotland Padel Court Hotels FAQ</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What makes Scottish padel hotels unique?
                  </h3>
                  <p className="text-gray-700">
                    Scottish padel hotels offer unmatched natural beauty with courts set against Highland landscapes,
                    ancient castles, and pristine lochs. Many properties combine padel with golf, spa facilities,
                    and traditional Scottish hospitality in historic settings.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Can I play padel year-round in Scotland?
                  </h3>
                  <p className="text-gray-700">
                    Yes, Scottish padel hotels feature glass-enclosed courts allowing year-round play regardless of weather.
                    The outdoor season typically runs April-October, with summer offering the best conditions and
                    Scotland's famous long daylight hours.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Which Scottish region is best for padel holidays?
                  </h3>
                  <p className="text-gray-700">
                    Central Scotland, particularly Perthshire, offers the highest concentration of championship padel
                    facilities. However, Highland properties provide more dramatic scenery, while Lowland regions
                    offer milder weather and easier accessibility.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Do Scottish padel hotels cater to all skill levels?
                  </h3>
                  <p className="text-gray-700">
                    Absolutely. Scottish padel hotels welcome players of all abilities, from beginners to professionals.
                    Many offer coaching programs, junior padel camps, and facilities suitable for recreational
                    players alongside championship-standard courts.
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