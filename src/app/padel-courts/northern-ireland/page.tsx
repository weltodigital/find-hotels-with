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

export default function NorthernIrelandPadelPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    async function fetchNorthernIrelandPadelHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .ilike('description', '%padel%')
          .ilike('country', 'northern ireland')
          .order('name')

        if (error) throw error
        setHotels(data || [])
      } catch (error) {
        console.error('Error fetching Northern Ireland padel hotels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNorthernIrelandPadelHotels()
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

  // Get Northern Ireland coordinates for map centering
  const northernIrelandCoords = LOCATION_COORDINATES.countries?.['northern-ireland'] || {
    center: [54.6, -6.2],
    zoom: 8
  }

  // Get unique counties from actual hotels
  const uniqueCounties = [...new Set(sortedHotels.map(hotel => hotel.county))].sort()

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Luxury Hotels with Padel Courts in Northern Ireland",
    "description": "Discover Northern Ireland's premier hotels featuring championship padel courts. From coastal resorts to countryside retreats with world-class padel facilities.",
    "url": "https://findhotelswith.com/padel-courts/northern-ireland",
    "about": {
      "@type": "Product",
      "name": "Padel Court Hotels in Northern Ireland",
      "description": "Luxury accommodations with professional padel facilities across Northern Ireland"
    },
    "hasPart": sortedHotels.map(hotel => ({
      "@type": "LodgingBusiness",
      "name": hotel.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotel.city,
        "addressRegion": hotel.county,
        "addressCountry": "Northern Ireland"
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
        <div className="text-xl">Loading Northern Ireland padel court hotels...</div>
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
                Hotels with Padel Courts in Northern Ireland Near You
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} exceptional hotels across Northern Ireland featuring championship padel courts.
                From the Causeway Coast to countryside retreats, experience padel in Northern Ireland's most stunning locations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-orange-100">Luxury Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">6</div>
                  <div className="text-orange-100">Counties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-orange-100">Championship Standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Padel Court Hotels in Northern Ireland
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
            Discover Padel Court Hotels Across Northern Ireland
          </h2>
          <div className="bg-white rounded-lg shadow-lg">
            <HotelsMap
              hotels={sortedHotels}
              className="h-[600px]"
              center={northernIrelandCoords?.center}
              zoom={northernIrelandCoords?.zoom}
            />
          </div>
        </div>

        {/* County Links Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explore Padel Court Hotels by Northern Ireland County
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse our padel court hotels across Northern Ireland's beautiful counties, from coastal resorts to countryside retreats.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {uniqueCounties.map((county) => {
                  const slug = county.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <Link
                      key={county}
                      href={`/padel-courts/northern-ireland/${slug}`}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Northern Ireland's Padel Heritage & Stunning Landscapes</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  Northern Ireland offers some of the UK's most dramatic padel destinations, combining championship facilities
                  with breathtaking landscapes. Our curated collection of {sortedHotels.length} luxury hotels with padel courts
                  showcases Northern Ireland's finest padel venues, from the famous Causeway Coast to peaceful countryside retreats.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Championship Padel in Northern Ireland's Spectacular Settings</h3>
                <p className="text-gray-700 mb-6">
                  Northern Ireland's padel hotels offer unique experiences with courts set against dramatic coastlines, ancient castles,
                  and the country's legendary landscapes. These venues combine warm Irish hospitality with
                  world-class padel facilities, creating unforgettable sporting holidays.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Northern Ireland's Padel Regions</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Belfast & Greater Belfast:</strong> Urban luxury hotels offering padel courts with easy access
                  to the capital's culture, dining, and historic attractions.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Causeway Coast & Glens:</strong> Coastal resorts featuring padel courts with views of the famous
                  Giant's Causeway and dramatic Antrim coastline.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Fermanagh Lakelands:</strong> Peaceful lakeside hotels offering padel courts set within
                  Northern Ireland's pristine countryside and waterways.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Mournes & Down:</strong> Mountain and coastal retreats featuring padel courts with views
                  of the Mourne Mountains and Strangford Lough.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">World-Class Padel Facilities in Northern Ireland</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Glass-enclosed courts with premium artificial turf surfaces</li>
                  <li>All-weather playing conditions year-round</li>
                  <li>Professional coaching from qualified instructors</li>
                  <li>Equipment hire including premium padel rackets and balls</li>
                  <li>Padel packages combining court time with luxury accommodation</li>
                  <li>Spa and wellness facilities for post-match recovery</li>
                  <li>Fine dining experiences showcasing Northern Irish cuisine</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Northern Ireland Padel Experience</h3>
                <p className="text-gray-700 mb-6">
                  Playing padel in Northern Ireland offers unmatched natural beauty and cultural richness. Many hotels feature
                  courts with views of the Giant's Causeway, Mourne Mountains, or peaceful loughs. The combination of
                  championship padel facilities with Northern Ireland's outdoor adventure opportunities creates perfect
                  multi-activity holidays.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Causeway Coast Padel Excellence</h3>
                <p className="text-gray-700 mb-6">
                  The Causeway Coast offers some of Northern Ireland's most spectacular padel venues, with courts
                  overlooking the famous Giant's Causeway and dramatic coastal scenery. These properties combine world-class
                  padel with access to one of the world's most beautiful coastlines.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Times for Padel in Northern Ireland</h3>
                <p className="text-gray-700 mb-6">
                  Padel can be enjoyed year-round in Northern Ireland thanks to enclosed court facilities. The most reliable weather occurs from May to September.
                  The country's mild maritime climate makes padel possible year-round, especially at venues with indoor
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Northern Ireland Padel Court Hotels FAQ</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What makes Northern Ireland padel hotels special?
                  </h3>
                  <p className="text-gray-700">
                    Northern Ireland's padel hotels offer stunning natural settings with courts overlooking dramatic coastlines,
                    mountains, and peaceful countryside. Many properties combine padel with access to world-famous attractions
                    like the Giant's Causeway and traditional Irish hospitality.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Can I visit the Giant's Causeway from padel hotels?
                  </h3>
                  <p className="text-gray-700">
                    Yes! Many of Northern Ireland's luxury padel hotels are located along the Causeway Coast, offering
                    easy access to the Giant's Causeway, Carrick-a-Rede Rope Bridge, and other spectacular attractions
                    along this UNESCO World Heritage coastline.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What's the weather like for padel in Northern Ireland?
                  </h3>
                  <p className="text-gray-700">
                    Northern Ireland has a mild maritime climate suitable for padel from April to October. Many hotels offer
                    glass-enclosed courts for year-round play. Summer provides the warmest and driest conditions, while
                    spring and autumn offer comfortable temperatures and beautiful scenery.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Can I combine padel with other activities in Northern Ireland?
                  </h3>
                  <p className="text-gray-700">
                    Absolutely! Northern Ireland's padel hotels often feature golf courses, spa facilities, and easy access to
                    outdoor activities like coastal walks, Game of Thrones filming locations, whiskey distilleries, and
                    cultural attractions. Many properties offer multi-activity packages.
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