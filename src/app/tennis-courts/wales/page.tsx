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

// Counties in Wales
const WALES_COUNTIES = [
  'Gwynedd', 'Newport', 'Vale of Glamorgan'
]

export default function WalesTennisCoursePage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    async function fetchWalesHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .in('county', WALES_COUNTIES)
          .order('name')

        if (error) throw error
        setHotels(data || [])
      } catch (error) {
        console.error('Error fetching Wales hotels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWalesHotels()
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

  // Get Wales coordinates for map centering
  const walesCoords = getLocationCoordinates('countries', 'wales')

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Luxury Hotels with Tennis Courts in Wales",
    "description": "Discover Wales's premier hotels featuring championship tennis courts. From coastal resorts to mountain retreats with world-class tennis facilities.",
    "url": "https://findhotelswith.com/tennis-courts/wales",
    "about": {
      "@type": "Product",
      "name": "Tennis Court Hotels in Wales",
      "description": "Luxury accommodations with professional tennis facilities across Wales"
    },
    "hasPart": sortedHotels.map(hotel => ({
      "@type": "LodgingBusiness",
      "name": hotel.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotel.city,
        "addressRegion": hotel.county,
        "addressCountry": "Wales"
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
        <div className="text-xl">Loading Wales tennis court hotels...</div>
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
                Hotels with Tennis Courts in Wales Near You
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} exceptional hotels across Wales featuring championship tennis courts.
                From coastal luxury resorts to mountain retreats, experience tennis in Wales's most stunning locations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-green-100">Luxury Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">22</div>
                  <div className="text-green-100">Welsh Counties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-green-100">Championship Standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Tennis Court Hotels in Wales
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
            Explore Tennis Court Hotels Across Wales
          </h2>
          <div className="bg-white rounded-lg shadow-lg">
            <HotelsMap
              hotels={sortedHotels}
              className="h-[600px]"
              center={walesCoords?.center}
              zoom={walesCoords?.zoom}
            />
          </div>
        </div>

        {/* County Links Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explore Tennis Court Hotels by Welsh County
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse our tennis court hotels across Wales's beautiful counties, from mountain retreats to coastal resorts.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/tennis-courts/wales/gwynedd" className="inline-block px-6 py-4 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Gwynedd
                </Link>
                <Link href="/tennis-courts/wales/newport" className="inline-block px-6 py-4 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Newport
                </Link>
                <Link href="/tennis-courts/wales/vale-of-glamorgan" className="inline-block px-6 py-4 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Vale of Glamorgan
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Wales's Tennis Heritage & Natural Beauty</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  Wales offers some of the UK's most spectacular tennis destinations, combining championship facilities
                  with breathtaking landscapes. Our curated collection of {sortedHotels.length} luxury hotels with tennis courts
                  showcases Wales's finest tennis venues, from coastal resorts to mountain retreats.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Championship Tennis in Wales's Stunning Settings</h3>
                <p className="text-gray-700 mb-6">
                  Welsh tennis hotels offer unique experiences with courts set against dramatic coastlines, ancient castles,
                  and the country's famous mountain ranges. These venues combine traditional Welsh hospitality with
                  world-class tennis facilities, creating unforgettable sporting holidays.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Wales's Tennis Regions</h3>
                <p className="text-gray-700 mb-6">
                  <strong>South Wales & Cardiff:</strong> The Vale of Glamorgan and Newport areas offer luxury golf and tennis
                  resorts with easy access to Cardiff and championship-standard facilities.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>North Wales & Snowdonia:</strong> Mountain hotels and coastal resorts in Gwynedd provide tennis courts
                  with spectacular mountain and sea views, perfect for active holidays.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Mid Wales:</strong> Rural luxury hotels offering tennis courts set within Wales's peaceful
                  countryside and traditional market towns.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>West Wales & Pembrokeshire:</strong> Coastal tennis resorts featuring courts with dramatic
                  cliff-top views and access to Wales's most beautiful beaches.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">World-Class Tennis Facilities in Wales</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>All-weather courts suitable for Wales's variable climate</li>
                  <li>Indoor tennis facilities for year-round play</li>
                  <li>Professional coaching from internationally qualified instructors</li>
                  <li>Tennis holidays combining court time with outdoor activities</li>
                  <li>Multi-sport facilities including golf, spa, and adventure activities</li>
                  <li>Family-friendly tennis programs and junior coaching</li>
                  <li>Tournament facilities and group tennis events</li>
                  <li>Equipment hire and professional services</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Welsh Tennis Experience</h3>
                <p className="text-gray-700 mb-6">
                  Playing tennis in Wales offers unmatched natural beauty and cultural richness. Many hotels feature
                  courts with views of Snowdonia, the Brecon Beacons, or the Welsh coastline. The combination of
                  championship tennis facilities with Wales's outdoor adventure opportunities creates perfect
                  multi-activity holidays.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Celtic Manor Resort - Wales's Tennis Crown Jewel</h3>
                <p className="text-gray-700 mb-6">
                  The Celtic Manor Resort stands as Wales's premier tennis destination, featuring championship courts
                  that have hosted international events. As the home of the Ryder Cup, Celtic Manor combines world-class
                  tennis with golf, spa facilities, and luxury accommodation in the heart of South Wales.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Times for Tennis in Wales</h3>
                <p className="text-gray-700 mb-6">
                  Wales's tennis season runs from April through October, with the most reliable weather from May to September.
                  The country's mild maritime climate makes tennis possible year-round, especially at venues with indoor
                  courts. Summer offers the warmest conditions, while spring and autumn provide comfortable temperatures
                  and stunning seasonal landscapes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Wales Tennis Court Hotels FAQ</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What makes Welsh tennis hotels special?
                  </h3>
                  <p className="text-gray-700">
                    Welsh tennis hotels offer stunning natural settings with courts overlooking mountains, coastlines,
                    and valleys. Many properties combine tennis with golf, spa facilities, and outdoor activities
                    like hiking in Snowdonia or exploring the Welsh coastline.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Is Celtic Manor the only championship tennis venue in Wales?
                  </h3>
                  <p className="text-gray-700">
                    While Celtic Manor is Wales's most famous tennis destination, other luxury hotels throughout Wales
                    offer championship-standard courts. Each venue provides unique experiences, from coastal locations
                    to mountain retreats, all with professional tennis facilities.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What's the weather like for tennis in Wales?
                  </h3>
                  <p className="text-gray-700">
                    Wales has a mild maritime climate suitable for tennis from April to October. Many hotels offer
                    indoor courts for year-round play. Summer provides the warmest and driest conditions, while
                    spring and autumn offer comfortable temperatures and beautiful scenery.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Can I combine tennis with other activities in Wales?
                  </h3>
                  <p className="text-gray-700">
                    Absolutely! Welsh tennis hotels often feature golf courses, spa facilities, and easy access to
                    outdoor activities like hiking, mountain biking, and coastal walks. Many properties offer
                    multi-activity packages combining tennis with Wales's adventure tourism opportunities.
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