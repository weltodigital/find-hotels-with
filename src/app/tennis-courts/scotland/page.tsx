'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Hotel } from '@/types/hotel'
import { getLocationCoordinates } from '@/lib/locationCoordinates'
import HotelCard from '@/components/HotelCard'
import HotelsMap from '@/components/HotelsMap'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Counties in Scotland
const SCOTLAND_COUNTIES = [
  'Aberdeenshire', 'Fife', 'Perth and Kinross', 'Stirling', 'West Dunbartonshire'
]

export default function ScotlandTennisCoursePage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    async function fetchScotlandHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .in('county', SCOTLAND_COUNTIES)
          .order('name')

        if (error) throw error
        setHotels(data || [])
      } catch (error) {
        console.error('Error fetching Scotland hotels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchScotlandHotels()
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
  const scotlandCoords = getLocationCoordinates('countries', 'scotland')

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Luxury Hotels with Tennis Courts in Scotland",
    "description": "Discover Scotland's premier hotels featuring championship tennis courts. From Highland estates to Lowland luxury resorts with world-class tennis facilities.",
    "url": "https://findhotelswith.com/tennis-courts/scotland",
    "about": {
      "@type": "Product",
      "name": "Tennis Court Hotels in Scotland",
      "description": "Luxury accommodations with professional tennis facilities across Scotland"
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
          "name": "Tennis Court",
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
        <div className="text-xl">Loading Scotland tennis court hotels...</div>
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
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                Hotels with Tennis Courts in Scotland Near You
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} exceptional hotels across Scotland featuring world-class tennis courts.
                From Highland castles to luxurious golf resorts, experience tennis against Scotland's breathtaking landscapes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-green-100">Luxury Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">32</div>
                  <div className="text-green-100">Scottish Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-green-100">World-Class Standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Tennis Court Hotels in Scotland
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            Discover Tennis Court Hotels Across Scotland
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
                Explore Tennis Court Hotels by Scottish County
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse our tennis court hotels across Scotland's most beautiful counties, from Highland resorts to coastal venues.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Link href="/tennis-courts/scotland/aberdeenshire" className="inline-block px-4 py-3 bg-gray-100 hover:bg-blue-100 text-sm text-gray-700 hover:text-blue-700 rounded transition-colors text-center">
                  Aberdeenshire
                </Link>
                <Link href="/tennis-courts/scotland/fife" className="inline-block px-4 py-3 bg-gray-100 hover:bg-blue-100 text-sm text-gray-700 hover:text-blue-700 rounded transition-colors text-center">
                  Fife
                </Link>
                <Link href="/tennis-courts/scotland/perth-and-kinross" className="inline-block px-4 py-3 bg-gray-100 hover:bg-blue-100 text-sm text-gray-700 hover:text-blue-700 rounded transition-colors text-center">
                  Perth and Kinross
                </Link>
                <Link href="/tennis-courts/scotland/stirling" className="inline-block px-4 py-3 bg-gray-100 hover:bg-blue-100 text-sm text-gray-700 hover:text-blue-700 rounded transition-colors text-center">
                  Stirling
                </Link>
                <Link href="/tennis-courts/scotland/west-dunbartonshire" className="inline-block px-4 py-3 bg-gray-100 hover:bg-blue-100 text-sm text-gray-700 hover:text-blue-700 rounded transition-colors text-center">
                  West Dunbartonshire
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Scotland's Tennis Heritage & Modern Excellence</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  Scotland's tennis heritage combines Highland grandeur with championship excellence. Our curated collection
                  of {sortedHotels.length} luxury hotels with tennis courts showcases Scotland's finest tennis destinations,
                  from historic castle estates to world-renowned golf and tennis resorts.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Championship Tennis in Scotland's Finest Settings</h3>
                <p className="text-gray-700 mb-6">
                  Scottish tennis hotels offer unparalleled experiences, with courts set against dramatic Highland backdrops,
                  loch-side locations, and historic castle grounds. These venues combine traditional Scottish hospitality
                  with modern tennis facilities, creating unforgettable sporting holidays.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Scotland's Tennis Regions</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Central Scotland & Perthshire:</strong> Home to Gleneagles, Scotland's most famous tennis destination,
                  featuring multiple championship courts within a world-class resort setting.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>The Highlands & Islands:</strong> Exclusive Highland lodges and castle hotels offering tennis courts
                  with spectacular mountain and loch views, perfect for luxury tennis retreats.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Lowlands & Borders:</strong> Historic properties and modern resorts featuring tennis courts
                  set within Scotland's gentler southern landscapes and countryside estates.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>West Coast & Islands:</strong> Unique island tennis experiences with courts offering dramatic
                  coastal views and exclusive access to Scotland's most remote luxury properties.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">World-Class Tennis Facilities</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Championship standard hard courts and all-weather surfaces</li>
                  <li>Indoor tennis facilities for year-round play</li>
                  <li>Professional coaching from internationally qualified instructors</li>
                  <li>Tennis academies and specialized training programs</li>
                  <li>Court booking systems with guaranteed guest access</li>
                  <li>Premium equipment hire and pro shop facilities</li>
                  <li>Tennis packages combining court time with luxury accommodation</li>
                  <li>Group tennis events and tournament facilities</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Scottish Tennis Experience</h3>
                <p className="text-gray-700 mb-6">
                  Playing tennis in Scotland offers unique experiences unavailable elsewhere. Imagine serving against
                  a backdrop of ancient castles, Highland peaks, or pristine lochs. Many Scottish tennis hotels also
                  feature championship golf courses, creating the perfect combination for racquet and club sports enthusiasts.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Times for Tennis in Scotland</h3>
                <p className="text-gray-700 mb-6">
                  Scotland's tennis season runs from April through October, with the best conditions typically in
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Scotland Tennis Court Hotels FAQ</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What makes Scottish tennis hotels unique?
                  </h3>
                  <p className="text-gray-700">
                    Scottish tennis hotels offer unmatched natural beauty with courts set against Highland landscapes,
                    ancient castles, and pristine lochs. Many properties combine tennis with golf, spa facilities,
                    and traditional Scottish hospitality in historic settings.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Can I play tennis year-round in Scotland?
                  </h3>
                  <p className="text-gray-700">
                    Many Scottish tennis hotels feature indoor courts and all-weather surfaces allowing year-round play.
                    The outdoor season typically runs April-October, with summer offering the best conditions and
                    Scotland's famous long daylight hours.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Which Scottish region is best for tennis holidays?
                  </h3>
                  <p className="text-gray-700">
                    Central Scotland, particularly Perthshire, offers the highest concentration of championship tennis
                    facilities. However, Highland properties provide more dramatic scenery, while Lowland regions
                    offer milder weather and easier accessibility.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Do Scottish tennis hotels cater to all skill levels?
                  </h3>
                  <p className="text-gray-700">
                    Absolutely. Scottish tennis hotels welcome players of all abilities, from beginners to professionals.
                    Many offer coaching programs, junior tennis camps, and facilities suitable for recreational
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