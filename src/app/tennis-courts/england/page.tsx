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

// Counties in England
const ENGLAND_COUNTIES = [
  'Bedfordshire', 'Berkshire', 'Buckinghamshire', 'Cambridgeshire', 'Cornwall',
  'Cumbria', 'Derbyshire', 'Devon', 'Dorset', 'Durham', 'Essex', 'Gloucestershire',
  'Greater London', 'Hampshire', 'Hertfordshire', 'Kent', 'Leicestershire',
  'Lincolnshire', 'Northamptonshire', 'Northumberland', 'Nottinghamshire',
  'Oxfordshire', 'Shropshire', 'Somerset', 'South Yorkshire', 'Staffordshire',
  'Suffolk', 'Surrey', 'Warwickshire', 'West Sussex', 'Wiltshire', 'Worcestershire',
  'North Yorkshire', 'Isle of Wight'
]

export default function EnglandTennisCoursePage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    async function fetchEnglandHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .in('county', ENGLAND_COUNTIES)
          .order('name')

        if (error) throw error
        setHotels(data || [])
      } catch (error) {
        console.error('Error fetching England hotels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnglandHotels()
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
  const englandCoords = getLocationCoordinates('countries', 'england')

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Luxury Hotels with Tennis Courts in England",
    "description": "Discover England's finest hotels featuring championship tennis courts. From Wimbledon-standard facilities to exclusive country estates with private courts.",
    "url": "https://findhotelswith.com/tennis-courts/england",
    "about": {
      "@type": "Product",
      "name": "Tennis Court Hotels in England",
      "description": "Luxury accommodations with professional tennis facilities across England"
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
        <div className="text-xl">Loading England tennis court hotels...</div>
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
                Hotels with Tennis Courts in England Near You
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} luxury hotels across England featuring championship-quality tennis courts.
                From historic country estates to modern luxury resorts, find the perfect tennis getaway in England.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-green-100">Luxury Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">33</div>
                  <div className="text-green-100">English Counties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-green-100">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Tennis Court Hotels in England
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
            Find Tennis Court Hotels Across England
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
                Explore Tennis Court Hotels by English County
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse our tennis court hotels by specific counties across England. Each region offers unique venues and experiences.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <Link href="/tennis-courts/england/bedfordshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Bedfordshire
                </Link>
                <Link href="/tennis-courts/england/berkshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Berkshire
                </Link>
                <Link href="/tennis-courts/england/buckinghamshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Buckinghamshire
                </Link>
                <Link href="/tennis-courts/england/cambridgeshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Cambridgeshire
                </Link>
                <Link href="/tennis-courts/england/cornwall" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Cornwall
                </Link>
                <Link href="/tennis-courts/england/cumbria" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Cumbria
                </Link>
                <Link href="/tennis-courts/england/derbyshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Derbyshire
                </Link>
                <Link href="/tennis-courts/england/devon" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Devon
                </Link>
                <Link href="/tennis-courts/england/dorset" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Dorset
                </Link>
                <Link href="/tennis-courts/england/durham" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Durham
                </Link>
                <Link href="/tennis-courts/england/essex" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Essex
                </Link>
                <Link href="/tennis-courts/england/gloucestershire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Gloucestershire
                </Link>
                <Link href="/tennis-courts/england/greater-london" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Greater London
                </Link>
                <Link href="/tennis-courts/england/hampshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Hampshire
                </Link>
                <Link href="/tennis-courts/england/hertfordshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Hertfordshire
                </Link>
                <Link href="/tennis-courts/england/kent" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Kent
                </Link>
                <Link href="/tennis-courts/england/leicestershire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Leicestershire
                </Link>
                <Link href="/tennis-courts/england/lincolnshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Lincolnshire
                </Link>
                <Link href="/tennis-courts/england/northamptonshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Northamptonshire
                </Link>
                <Link href="/tennis-courts/england/northumberland" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Northumberland
                </Link>
                <Link href="/tennis-courts/england/nottinghamshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Nottinghamshire
                </Link>
                <Link href="/tennis-courts/england/oxfordshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Oxfordshire
                </Link>
                <Link href="/tennis-courts/england/shropshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Shropshire
                </Link>
                <Link href="/tennis-courts/england/somerset" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Somerset
                </Link>
                <Link href="/tennis-courts/england/south-yorkshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  South Yorkshire
                </Link>
                <Link href="/tennis-courts/england/staffordshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Staffordshire
                </Link>
                <Link href="/tennis-courts/england/suffolk" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Suffolk
                </Link>
                <Link href="/tennis-courts/england/surrey" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Surrey
                </Link>
                <Link href="/tennis-courts/england/warwickshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Warwickshire
                </Link>
                <Link href="/tennis-courts/england/west-sussex" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  West Sussex
                </Link>
                <Link href="/tennis-courts/england/wiltshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Wiltshire
                </Link>
                <Link href="/tennis-courts/england/worcestershire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Worcestershire
                </Link>
                <Link href="/tennis-courts/england/north-yorkshire" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  North Yorkshire
                </Link>
                <Link href="/tennis-courts/england/isle-of-wight" className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center">
                  Isle of Wight
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">England's Tennis Court Hotel Experience</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  England boasts some of the world's most prestigious tennis venues, from the legendary grass courts of Wimbledon
                  to exclusive private estates. Our curated collection of {sortedHotels.length} luxury hotels with tennis courts
                  across England offers guests the ultimate tennis holiday experience.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Championship Tennis Facilities</h3>
                <p className="text-gray-700 mb-6">
                  Each hotel in our England collection features professional-standard tennis courts, many designed to Wimbledon
                  specifications. From grass courts at historic country estates to modern hard courts with floodlighting,
                  these venues cater to players of all abilities seeking the quintessential English tennis experience.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Regional Tennis Excellence</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Home Counties:</strong> Luxury hotels in Berkshire, Surrey, and Buckinghamshire offer easy access
                  to Wimbledon while providing exclusive court facilities and high-end amenities.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>West Country:</strong> Devon and Cornwall's coastal tennis resorts combine championship courts
                  with stunning sea views and spa facilities.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Cotswolds:</strong> Historic properties in Gloucestershire and Oxfordshire feature tennis courts
                  set within manicured estates and offer traditional English hospitality.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Yorkshire & the North:</strong> From North Yorkshire's countryside to Cumbria's Lake District,
                  northern England's tennis hotels offer dramatic landscapes and world-class facilities.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What Makes England's Tennis Hotels Special</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Grass courts inspired by Wimbledon's legendary surfaces</li>
                  <li>Historic estates with tennis courts dating back decades</li>
                  <li>Professional coaching from LTA-qualified instructors</li>
                  <li>Equipment hire including premium racquets and balls</li>
                  <li>Tennis packages combining court time with luxury accommodation</li>
                  <li>Spa and wellness facilities for post-match recovery</li>
                  <li>Fine dining experiences showcasing English cuisine</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Times to Visit</h3>
                <p className="text-gray-700 mb-6">
                  The English tennis season runs from April through September, with peak season during Wimbledon fortnight
                  in late June/early July. Spring and early autumn offer ideal playing conditions with fewer crowds,
                  while summer provides the authentic grass court experience that England is famous for.
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
                    What types of tennis courts do England's luxury hotels offer?
                  </h3>
                  <p className="text-gray-700">
                    England's premier hotels feature grass courts (inspired by Wimbledon), hard courts,
                    clay courts, and all-weather surfaces. Many properties offer multiple court types,
                    floodlit courts for evening play, and indoor facilities for year-round tennis.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Can I book tennis lessons at these hotels?
                  </h3>
                  <p className="text-gray-700">
                    Most luxury tennis hotels in England offer professional coaching from LTA-qualified
                    instructors. Lessons range from beginner sessions to advanced coaching, with many
                    hotels providing tennis camps and specialized programs during peak season.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    What's the best time to visit England for tennis?
                  </h3>
                  <p className="text-gray-700">
                    The ideal tennis season in England runs from April to September. June and July offer
                    the best weather and the famous Wimbledon atmosphere, while May and September provide
                    excellent playing conditions with fewer crowds and competitive rates.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Do these hotels provide tennis equipment?
                  </h3>
                  <p className="text-gray-700">
                    Yes, most luxury tennis hotels in England provide racquet hire, tennis balls,
                    and court booking services. Premium properties often stock high-end equipment
                    from brands like Wilson, Babolat, and Head.
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