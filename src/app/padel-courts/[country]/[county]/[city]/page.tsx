'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Hotel } from '@/types/hotel'
import { LOCATION_COORDINATES } from '@/lib/locationCoordinates'
import HotelCard from '@/components/HotelCard'
import HotelsMap from '@/components/HotelsMap'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

// City data for SEO content
const CITY_DATA: Record<string, {
  county: string
  country: string
  description: string
  highlights: string[]
  attractions: string[]
}> = {
  'frome': {
    county: 'Somerset',
    country: 'England',
    description: 'Frome offers premier padel facilities at luxury hotels, combining championship courts with the charm of this historic Somerset market town and beautiful countryside surroundings.',
    highlights: [
      'Luxury countryside padel resorts',
      'Historic market town setting with modern facilities',
      'Beautiful Somerset countryside surroundings',
      'Glass-enclosed courts with scenic views'
    ],
    attractions: [
      'Frome Market and Independent Quarter',
      'Babington House luxury resort',
      'Historic Frome town center',
      'Somerset countryside walks'
    ]
  },
  'auchterarder': {
    county: 'Perth and Kinross',
    country: 'Scotland',
    description: 'Auchterarder is home to the world-famous Gleneagles resort, featuring championship padel courts set against stunning Highland landscapes and offering the ultimate luxury padel experience.',
    highlights: [
      'World-renowned Gleneagles resort padel courts',
      'Championship facilities in Highland settings',
      'Traditional Scottish hospitality',
      'Mountain and countryside views'
    ],
    attractions: [
      'Gleneagles resort and golf courses',
      'Highland Perthshire countryside',
      'Historic Auchterarder village',
      'Cairngorms National Park'
    ]
  },
  'camberley': {
    county: 'Surrey',
    country: 'England',
    description: 'Camberley offers exceptional padel facilities at luxury hotels, combining championship courts with convenient access to both London and the beautiful Surrey countryside.',
    highlights: [
      'Modern padel facilities at luxury hotels',
      'Excellent transport links to London',
      'Beautiful Surrey countryside location',
      'Year-round glass-enclosed courts'
    ],
    attractions: [
      'Camberley Theatre and Arts',
      'Surrey Heath countryside',
      'Shopping centers and dining',
      'Royal Military Academy Sandhurst'
    ]
  },
  'dorking': {
    county: 'Surrey',
    country: 'England',
    description: 'Dorking features world-class padel facilities at luxury resorts like Beaverbrook, set within the stunning Surrey Hills countryside and offering championship courts with breathtaking views.',
    highlights: [
      'Beaverbrook luxury resort padel courts',
      'Surrey Hills countryside setting',
      'Championship-standard facilities',
      'Historic market town charm'
    ],
    attractions: [
      'Beaverbrook luxury resort',
      'Surrey Hills Area of Outstanding Natural Beauty',
      'Historic Dorking market town',
      'Box Hill and countryside walks'
    ]
  },
  // Default template for other cities
  'default': {
    county: '',
    country: '',
    description: 'Discover exceptional padel facilities at luxury hotels featuring championship courts, professional coaching, and world-class accommodation in this beautiful location.',
    highlights: [
      'Glass-enclosed championship padel courts',
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
  // Somerset cities
  'frome': ['bath', 'wells', 'shepton-mallet', 'glastonbury'],
  'bath': ['frome', 'wells', 'bradford-on-avon', 'radstock'],

  // Surrey cities
  'camberley': ['woking', 'guildford', 'farnborough', 'aldershot'],
  'dorking': ['guildford', 'leatherhead', 'reigate', 'epsom'],
  'guildford': ['woking', 'dorking', 'camberley', 'farnham'],
  'woking': ['guildford', 'camberley', 'chertsey', 'addlestone'],

  // Hampshire cities
  'basingstoke': ['winchester', 'reading', 'aldershot', 'andover'],
  'winchester': ['basingstoke', 'southampton', 'eastleigh', 'alresford'],

  // Perth and Kinross cities
  'auchterarder': ['perth', 'crieff', 'stirling', 'kinross'],
  'perth': ['auchterarder', 'dundee', 'kinross', 'crieff'],

  // Other major cities can be added as needed
}

export default function CityPadelPage() {
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
          .ilike('description', '%padel%')
          .order('name')

        if (cityError) throw cityError
        setHotels(cityData || [])

        // Fetch all hotels in this county for city links
        const { data: countyData, error: countyError } = await supabase
          .from('hotels')
          .select('*')
          .eq('county', formattedCounty)
          .ilike('description', '%padel%')
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
  const cityCoords = LOCATION_COORDINATES.cities?.[cityKey] || {
    center: [51.5, -1.0],
    zoom: 12
  }

  // Get all other cities in this county from hotel data
  const otherCitiesInCounty = [...new Set(allCountyHotels.map(hotel => hotel.city))]
    .filter(cityName => cityName && cityName !== formattedCity) // Remove current city and null values
    .sort()
  const otherCityLinks = otherCitiesInCounty.map(cityName => ({
    name: cityName,
    slug: cityName.toLowerCase().replace(/\s+/g, '-'),
    href: `/padel-courts/${country}/${county}/${cityName.toLowerCase().replace(/\s+/g, '-')}`
  }))

  // Get nearby cities for recommendations (from predefined list)
  const nearbyCities = NEARBY_CITIES[cityKey] || []
  const nearbyCityLinks = nearbyCities.map(nearbyCity => ({
    slug: nearbyCity,
    name: nearbyCity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: `/padel-courts/${country}/${county}/${nearbyCity}`
  }))

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${formattedCity} Hotels with Padel Courts`,
    "description": `Discover luxury hotels with padel courts in ${formattedCity}, ${formattedCounty}. Championship facilities and world-class accommodation.`,
    "url": `https://findhotelswith.com/padel-courts/${country}/${county}/${city}`,
    "about": {
      "@type": "Product",
      "name": `Padel Court Hotels in ${formattedCity}`,
      "description": `Luxury accommodations with professional padel facilities in ${formattedCity}`
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
        <div className="text-xl">Loading {formattedCity} padel court hotels...</div>
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
                Hotels with Padel Courts in {formattedCity} Near You
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} exceptional hotels in {formattedCity}, {formattedCounty} featuring championship padel courts and luxury accommodation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{sortedHotels.length}</div>
                  <div className="text-orange-100">Padel Court Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">🏸</div>
                  <div className="text-orange-100">Championship Courts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-orange-100">Luxury Standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHotels.length} Padel Court Hotels in {formattedCity}
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
          {sortedHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No padel court hotels found in {formattedCity} at this time.</p>
              <p className="text-gray-500 mt-2">Please check our other locations or contact us for assistance.</p>
            </div>
          )}
        </div>

        {/* Map Section */}
        {sortedHotels.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Padel Court Hotels in {formattedCity}
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
                  Other Cities with Padel Court Hotels in {formattedCounty}
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Explore padel facilities in other cities and towns across {formattedCounty}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {otherCityLinks.map((city) => (
                    <Link
                      key={city.slug}
                      href={city.href}
                      className="inline-block px-4 py-3 bg-white hover:bg-orange-50 text-sm text-gray-700 hover:text-orange-700 rounded border border-gray-200 hover:border-orange-300 transition-colors text-center"
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
                  Explore Padel Court Hotels in Nearby Cities
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Discover more exceptional padel facilities in cities near {formattedCity}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nearbyCityLinks.map((city) => (
                    <Link
                      key={city.slug}
                      href={city.href}
                      className="inline-block px-4 py-3 bg-gray-100 hover:bg-orange-100 text-sm text-gray-700 hover:text-orange-700 rounded transition-colors text-center"
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
                Explore More Padel Court Hotels
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Browse padel facilities across {formattedCounty} and {formattedCountry}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <Link
                    href={`/padel-courts/${country}/${county}`}
                    className="inline-block px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    All {formattedCounty} Padel Hotels
                  </Link>
                  <p className="text-gray-600 mt-2">Explore all padel facilities in {formattedCounty}</p>
                </div>
                <div className="text-center">
                  <Link
                    href={`/padel-courts/${country}`}
                    className="inline-block px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    All {formattedCountry} Padel Hotels
                  </Link>
                  <p className="text-gray-600 mt-2">Discover padel venues across {formattedCountry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{formattedCity} Padel Excellence</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  {cityData.description}
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose {formattedCity} for Padel?</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  {cityData.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Padel Facilities in {formattedCity}</h3>
                <p className="text-gray-700 mb-6">
                  Hotels in {formattedCity} featuring padel courts offer world-class facilities including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Glass-enclosed courts with premium artificial turf surfaces</li>
                  <li>All-weather playing conditions year-round</li>
                  <li>Professional coaching from qualified instructors</li>
                  <li>Equipment hire including premium padel rackets and balls</li>
                  <li>Padel packages combining court time with luxury accommodation</li>
                  <li>Spa and wellness facilities for post-match recovery</li>
                  <li>Fine dining experiences and luxury amenities</li>
                  <li>On-site restaurants and relaxation areas</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Local Attractions in {formattedCity}</h3>
                <p className="text-gray-700 mb-6">
                  When visiting {formattedCity} for padel, you can also enjoy:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  {cityData.attractions.map((attraction, index) => (
                    <li key={index}>{attraction}</li>
                  ))}
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Planning Your Padel Visit to {formattedCity}</h3>
                <p className="text-gray-700">
                  {formattedCity} offers excellent padel conditions with convenient access to major transport links.
                  Padel can be enjoyed year-round thanks to glass-enclosed court facilities, with peak season from April through October.
                  Many venues feature climate-controlled environments, ensuring excellent playing conditions regardless
                  of weather. Whether you're visiting for a padel break, tournament, or combining sport with leisure,
                  {formattedCity} provides the perfect base for your padel holiday with world-class facilities and luxury accommodation.
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