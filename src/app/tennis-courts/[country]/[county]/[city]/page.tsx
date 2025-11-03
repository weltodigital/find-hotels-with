'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

// City data for SEO content
const CITY_DATA: Record<string, {
  county: string
  country: string
  description: string
  highlights: string[]
  attractions: string[]
}> = {
  'basingstoke': {
    county: 'Hampshire',
    country: 'England',
    description: 'Basingstoke offers premier tennis facilities at luxury hotels, combining championship courts with convenient access to both London and the Hampshire countryside.',
    highlights: [
      'Modern tennis facilities at luxury business hotels',
      'Excellent transport links to London and the South',
      'Beautiful Hampshire countryside surroundings',
      'Year-round indoor and outdoor tennis courts'
    ],
    attractions: [
      'Basingstoke Leisure Park',
      'The Haymarket Theatre',
      'Basing House historic ruins',
      'North Hampshire countryside'
    ]
  },
  // Default template for other cities
  'default': {
    county: '',
    country: '',
    description: 'Discover exceptional tennis facilities at luxury hotels featuring championship courts, professional coaching, and world-class accommodation in this beautiful location.',
    highlights: [
      'Championship-standard tennis courts',
      'Professional coaching and instruction',
      'Luxury accommodation and dining',
      'Beautiful local scenery and attractions'
    ],
    attractions: [
      'Local parks and recreation areas',
      'Historic sites and landmarks',
      'Shopping and dining venues',
      'Cultural attractions and events'
    ]
  }
}

// Nearby cities within the same county
const NEARBY_CITIES: Record<string, string[]> = {
  // Hampshire cities
  'basingstoke': ['winchester', 'reading', 'aldershot', 'andover'],
  'winchester': ['basingstoke', 'southampton', 'eastleigh', 'alresford'],
  'southampton': ['winchester', 'eastleigh', 'fareham', 'totton'],
  'portsmouth': ['fareham', 'gosport', 'havant', 'waterlooville'],

  // Surrey cities
  'guildford': ['woking', 'farnham', 'godalming', 'leatherhead'],
  'woking': ['guildford', 'camberley', 'chertsey', 'addlestone'],
  'epsom': ['leatherhead', 'banstead', 'ewell', 'ashtead'],

  // Other major cities can be added as needed
}

export default function CityTennisPage() {
  const params = useParams()
  const country = typeof params.country === 'string' ? params.country : ''
  const county = typeof params.county === 'string' ? params.county : ''
  const city = typeof params.city === 'string' ? params.city : ''

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [allCountyHotels, setAllCountyHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  // Format display names
  const formattedCity = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const formattedCounty = county.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1)

  // Get city data for SEO content
  const cityKey = city.toLowerCase().replace(/\s+/g, '-')
  const cityData = CITY_DATA[cityKey] || {
    ...CITY_DATA.default,
    county: formattedCounty,
    country: formattedCountry
  }

  useEffect(() => {
    async function fetchHotels() {
      try {
        // Fetch hotels in this specific city
        const { data: cityData, error: cityError } = await supabase
          .from('hotels')
          .select('*')
          .eq('city', formattedCity)
          .eq('county', formattedCounty)
          .or('description.ilike.%tennis%,description.ilike.%racquet%,description.ilike.%racket%')
          .order('name')

        if (cityError) throw cityError
        setHotels(cityData || [])

        // Fetch all hotels in this county for city links
        const { data: countyData, error: countyError } = await supabase
          .from('hotels')
          .select('*')
          .eq('county', formattedCounty)
          .or('description.ilike.%tennis%,description.ilike.%racquet%,description.ilike.%racket%')
          .order('name')

        if (countyError) throw countyError
        setAllCountyHotels(countyData || [])
      } catch (error) {
        console.error(`Error fetching hotels:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [formattedCity, formattedCounty])

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

  // Get city coordinates for map centering
  const cityCoords = getLocationCoordinates('cities', cityKey)

  // Get all other cities in this county from hotel data
  const otherCitiesInCounty = [...new Set(allCountyHotels.map(hotel => hotel.city))]
    .filter(cityName => cityName && cityName !== formattedCity) // Remove current city and null values
    .sort()
  const otherCityLinks = otherCitiesInCounty.map(cityName => ({
    name: cityName,
    slug: cityName.toLowerCase().replace(/\s+/g, '-'),
    href: `/tennis-courts/${country}/${county}/${cityName.toLowerCase().replace(/\s+/g, '-')}`
  }))

  // Get nearby cities for recommendations (from predefined list)
  const nearbyCities = NEARBY_CITIES[cityKey] || []
  const nearbyCityLinks = nearbyCities.map(nearbyCity => ({
    slug: nearbyCity,
    name: nearbyCity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: `/tennis-courts/${country}/${county}/${nearbyCity}`
  }))

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${formattedCity} Hotels with Tennis Courts`,
    "description": `Discover luxury hotels with tennis courts in ${formattedCity}, ${formattedCounty}. Championship facilities and world-class accommodation.`,
    "url": `https://findhotelswith.com/tennis-courts/${country}/${county}/${city}`,
    "about": {
      "@type": "Product",
      "name": `Tennis Court Hotels in ${formattedCity}`,
      "description": `Luxury accommodations with professional tennis facilities in ${formattedCity}`
    },
    "hasPart": sortedHotels.map(hotel => ({
      "@type": "LodgingBusiness",
      "name": hotel.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotel.city,
        "addressRegion": hotel.county,
        "addressCountry": formattedCountry
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
        <div className="text-xl">Loading {formattedCity} tennis court hotels...</div>
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
                Hotels with Tennis Courts in {formattedCity} Near You
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} exceptional hotels in {formattedCity}, {formattedCounty} featuring championship tennis courts and luxury accommodation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-green-100">Tennis Court Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">🎾</div>
                  <div className="text-green-100">Championship Courts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-green-100">Luxury Standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Tennis Court Hotels in {formattedCity}
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
          {sortedHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No tennis court hotels found in {formattedCity} at this time.</p>
              <p className="text-gray-500 mt-2">Please check our other locations or contact us for assistance.</p>
            </div>
          )}
        </div>

        {/* Map Section */}
        {sortedHotels.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tennis Court Hotels in {formattedCity}
            </h2>
            <div className="bg-white rounded-lg shadow-lg">
              <HotelsMap
                hotels={sortedHotels}
                className="h-[500px]"
                center={cityCoords?.center}
                zoom={cityCoords?.zoom}
              />
            </div>
          </div>
        )}

        {/* Other Cities in County Section */}
        {otherCityLinks.length > 0 && (
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Other Cities with Tennis Court Hotels in {formattedCounty}
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Explore tennis facilities in other cities and towns across {formattedCounty}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {otherCityLinks.map((city) => (
                    <Link
                      key={city.slug}
                      href={city.href}
                      className="inline-block px-4 py-3 bg-white hover:bg-green-50 text-sm text-gray-700 hover:text-green-700 rounded border border-gray-200 hover:border-green-300 transition-colors text-center"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Cities Section */}
        {nearbyCityLinks.length > 0 && (
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Explore Tennis Court Hotels in Nearby Cities
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Discover more exceptional tennis facilities in cities near {formattedCity}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nearbyCityLinks.map((city) => (
                    <Link
                      key={city.slug}
                      href={city.href}
                      className="inline-block px-4 py-3 bg-gray-100 hover:bg-green-100 text-sm text-gray-700 hover:text-green-700 rounded transition-colors text-center"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* County and Country Links Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explore More Tennis Court Hotels
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse tennis facilities across {formattedCounty} and {formattedCountry}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <Link
                    href={`/tennis-courts/${country}/${county}`}
                    className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    All {formattedCounty} Tennis Hotels
                  </Link>
                  <p className="text-gray-600 mt-2">Explore all tennis facilities in {formattedCounty}</p>
                </div>
                <div className="text-center">
                  <Link
                    href={`/tennis-courts/${country}`}
                    className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    All {formattedCountry} Tennis Hotels
                  </Link>
                  <p className="text-gray-600 mt-2">Discover tennis venues across {formattedCountry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{formattedCity} Tennis Excellence</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  {cityData.description}
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose {formattedCity} for Tennis?</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  {cityData.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Tennis Facilities in {formattedCity}</h3>
                <p className="text-gray-700 mb-6">
                  Hotels in {formattedCity} featuring tennis courts offer world-class facilities including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Championship-standard hard courts and grass courts</li>
                  <li>All-weather surfaces for year-round play</li>
                  <li>Professional coaching and tennis instruction</li>
                  <li>Equipment hire and pro shop facilities</li>
                  <li>Tournament hosting capabilities</li>
                  <li>Floodlit courts for evening play</li>
                  <li>Luxury changing rooms and amenities</li>
                  <li>On-site restaurants and spa facilities</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Local Attractions in {formattedCity}</h3>
                <p className="text-gray-700 mb-6">
                  When visiting {formattedCity} for tennis, you can also enjoy:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  {cityData.attractions.map((attraction, index) => (
                    <li key={index}>{attraction}</li>
                  ))}
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Planning Your Tennis Visit to {formattedCity}</h3>
                <p className="text-gray-700">
                  {formattedCity} offers excellent tennis conditions with convenient access to major transport links.
                  The city's tennis facilities are available year-round, with peak season from April through October.
                  Many venues feature both indoor and outdoor courts, ensuring excellent playing conditions regardless
                  of weather. Whether you're visiting for a tennis break, tournament, or combining sport with leisure,
                  {formattedCity} provides the perfect base for your tennis holiday.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}