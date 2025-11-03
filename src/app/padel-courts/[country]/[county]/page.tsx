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

// County data for SEO content
const COUNTY_DATA: Record<string, {
  country: string
  description: string
  highlights: string[]
  venues: string[]
}> = {
  'hampshire': {
    country: 'England',
    description: 'Hampshire offers some of England\'s most prestigious padel destinations, combining championship facilities with stunning countryside and coastal locations.',
    highlights: [
      'Home to prestigious padel clubs and luxury resort courts',
      'Beautiful countryside and coastal settings',
      'Year-round padel with excellent all-weather facilities',
      'Close proximity to London and major padel venues'
    ],
    venues: [
      'New Forest luxury hotel padel facilities',
      'Portsmouth coastal padel venues',
      'Winchester countryside padel clubs',
      'Southampton premium padel courts'
    ]
  },
  'surrey': {
    country: 'England',
    description: 'Surrey is home to numerous world-class padel facilities at luxury hotels throughout the county, featuring championship courts in beautiful settings.',
    highlights: [
      'Numerous championship-standard hotel padel courts',
      'Beautiful Surrey Hills countryside settings',
      'Easy access to London and premium padel facilities',
      'World-class resorts with padel excellence'
    ],
    venues: [
      'Surrey Hills countryside padel venues',
      'Guildford premium hotel facilities',
      'Foxhills championship padel courts',
      'Beaverbrook luxury padel facilities'
    ]
  },
  'somerset': {
    country: 'England',
    description: 'Somerset combines countryside charm with excellent padel facilities, offering luxury venues set within beautiful rural landscapes.',
    highlights: [
      'Luxury countryside padel resorts',
      'Glass-enclosed courts with scenic views',
      'Traditional English hospitality',
      'Spa and wellness facilities'
    ],
    venues: [
      'Babington House padel courts',
      'Somerset countryside padel venues',
      'Rural luxury hotel facilities',
      'Premium spa resort courts'
    ]
  },
  'perth-and-kinross': {
    country: 'Scotland',
    description: 'Perth and Kinross is home to Scotland\'s most famous padel destination, featuring world-class facilities set against stunning Highland landscapes.',
    highlights: [
      'World-renowned Gleneagles padel courts',
      'Championship facilities in Highland settings',
      'Traditional Scottish hospitality',
      'Mountain and countryside views'
    ],
    venues: [
      'Gleneagles championship padel courts',
      'Highland luxury hotel facilities',
      'Perthshire countryside venues',
      'Premium resort padel courts'
    ]
  },
  // Default template for other counties
  'default': {
    country: '',
    description: 'Discover exceptional padel facilities at luxury hotels featuring championship courts, professional coaching, and world-class accommodation.',
    highlights: [
      'Glass-enclosed championship padel courts',
      'Professional coaching and instruction',
      'Luxury accommodation and dining',
      'Beautiful scenic locations'
    ],
    venues: [
      'Luxury resort padel facilities',
      'Championship padel courts',
      'Professional padel venues',
      'Premium hotel padel facilities'
    ]
  }
}

// Nearby counties data for recommendations
const NEARBY_COUNTIES: Record<string, string[]> = {
  // England counties and their neighbors
  'bedfordshire': ['hertfordshire', 'buckinghamshire', 'cambridgeshire', 'northamptonshire'],
  'berkshire': ['oxfordshire', 'buckinghamshire', 'surrey', 'hampshire', 'wiltshire'],
  'buckinghamshire': ['oxfordshire', 'hertfordshire', 'bedfordshire', 'northamptonshire', 'berkshire'],
  'cambridgeshire': ['bedfordshire', 'hertfordshire', 'essex', 'suffolk', 'norfolk', 'lincolnshire', 'northamptonshire'],
  'cornwall': ['devon'],
  'cumbria': ['northumberland', 'durham', 'north-yorkshire', 'lancashire'],
  'derbyshire': ['cheshire', 'staffordshire', 'leicestershire', 'nottinghamshire', 'south-yorkshire', 'west-yorkshire'],
  'devon': ['cornwall', 'somerset', 'dorset'],
  'dorset': ['devon', 'somerset', 'wiltshire', 'hampshire'],
  'durham': ['northumberland', 'cumbria', 'north-yorkshire'],
  'essex': ['hertfordshire', 'cambridgeshire', 'suffolk'],
  'gloucestershire': ['worcestershire', 'warwickshire', 'oxfordshire', 'wiltshire', 'somerset'],
  'hampshire': ['dorset', 'wiltshire', 'berkshire', 'surrey', 'west-sussex'],
  'hertfordshire': ['bedfordshire', 'buckinghamshire', 'essex', 'cambridgeshire'],
  'kent': ['surrey', 'east-sussex'],
  'lancashire': ['cumbria', 'north-yorkshire', 'west-yorkshire', 'greater-manchester', 'merseyside'],
  'leicestershire': ['nottinghamshire', 'derbyshire', 'staffordshire', 'warwickshire', 'northamptonshire', 'rutland'],
  'lincolnshire': ['nottinghamshire', 'leicestershire', 'rutland', 'northamptonshire', 'cambridgeshire', 'norfolk', 'east-yorkshire', 'south-yorkshire'],
  'norfolk': ['lincolnshire', 'cambridgeshire', 'suffolk'],
  'northamptonshire': ['leicestershire', 'warwickshire', 'oxfordshire', 'buckinghamshire', 'bedfordshire', 'cambridgeshire', 'lincolnshire'],
  'northumberland': ['cumbria', 'durham'],
  'nottinghamshire': ['derbyshire', 'leicestershire', 'lincolnshire', 'south-yorkshire'],
  'oxfordshire': ['gloucestershire', 'warwickshire', 'northamptonshire', 'buckinghamshire', 'berkshire', 'wiltshire'],
  'rutland': ['leicestershire', 'lincolnshire', 'northamptonshire'],
  'shropshire': ['cheshire', 'staffordshire', 'worcestershire', 'herefordshire', 'powys'],
  'somerset': ['devon', 'dorset', 'wiltshire', 'gloucestershire'],
  'staffordshire': ['cheshire', 'derbyshire', 'leicestershire', 'warwickshire', 'worcestershire', 'shropshire'],
  'suffolk': ['essex', 'cambridgeshire', 'norfolk'],
  'surrey': ['kent', 'east-sussex', 'west-sussex', 'hampshire', 'berkshire'],
  'east-sussex': ['kent', 'surrey', 'west-sussex'],
  'west-sussex': ['surrey', 'hampshire', 'east-sussex'],
  'warwickshire': ['worcestershire', 'staffordshire', 'leicestershire', 'northamptonshire', 'oxfordshire', 'gloucestershire'],
  'wiltshire': ['gloucestershire', 'oxfordshire', 'berkshire', 'hampshire', 'dorset', 'somerset'],
  'worcestershire': ['herefordshire', 'shropshire', 'staffordshire', 'warwickshire', 'gloucestershire'],
  'east-yorkshire': ['lincolnshire', 'south-yorkshire', 'north-yorkshire'],
  'north-yorkshire': ['durham', 'cumbria', 'lancashire', 'west-yorkshire', 'south-yorkshire', 'east-yorkshire'],
  'south-yorkshire': ['derbyshire', 'nottinghamshire', 'lincolnshire', 'east-yorkshire', 'north-yorkshire', 'west-yorkshire'],
  'west-yorkshire': ['lancashire', 'north-yorkshire', 'south-yorkshire', 'derbyshire'],

  // Scotland counties and their neighbors
  'aberdeenshire': ['moray', 'highland', 'angus', 'perth-and-kinross'],
  'fife': ['perth-and-kinross', 'clackmannanshire', 'stirling', 'falkirk'],
  'perth-and-kinross': ['highland', 'aberdeenshire', 'angus', 'dundee-city', 'fife', 'clackmannanshire', 'stirling', 'argyll-and-bute'],
  'stirling': ['highland', 'perth-and-kinross', 'clackmannanshire', 'falkirk', 'north-lanarkshire', 'west-dunbartonshire', 'argyll-and-bute'],
  'west-dunbartonshire': ['highland', 'stirling', 'north-lanarkshire', 'renfrewshire', 'argyll-and-bute'],

  // Wales counties and their neighbors
  'gwynedd': ['anglesey', 'conwy', 'denbighshire', 'powys', 'ceredigion'],
  'newport': ['monmouthshire', 'caerphilly', 'cardiff', 'vale-of-glamorgan'],
  'vale-of-glamorgan': ['cardiff', 'rhondda-cynon-taf', 'bridgend', 'newport']
}

export default function CountyPadelPage() {
  const params = useParams()
  const country = typeof params.country === 'string' ? params.country : ''
  const county = typeof params.county === 'string' ? params.county : ''

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  // Get county data for SEO content
  const countyKey = county.toLowerCase().replace(/\s+/g, '-')
  const countyData = COUNTY_DATA[countyKey] || {
    ...COUNTY_DATA.default,
    country: country.charAt(0).toUpperCase() + country.slice(1)
  }

  const formattedCounty = county.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1)

  useEffect(() => {
    async function fetchCountyHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('county', formattedCounty)
          .ilike('description', '%padel%')
          .order('name')

        if (error) throw error
        setHotels(data || [])
      } catch (error) {
        console.error(`Error fetching ${formattedCounty} padel hotels:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountyHotels()
  }, [formattedCounty])

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

  // Get unique cities from hotels for city links
  const uniqueCities = [...new Set(hotels.map(hotel => hotel.city))]
    .filter(city => city) // Remove null/undefined values
    .sort()
  const cityLinks = uniqueCities.map(city => ({
    name: city,
    slug: city.toLowerCase().replace(/\s+/g, '-'),
    href: `/padel-courts/${country}/${county}/${city.toLowerCase().replace(/\s+/g, '-')}`
  }))

  // Get county coordinates for map centering
  const countyCoords = LOCATION_COORDINATES.counties?.[countyKey] || {
    center: [51.5, -1.0],
    zoom: 10
  }

  // Get nearby counties for recommendations
  const nearbyCounties = NEARBY_COUNTIES[countyKey] || []
  const nearbyCountyLinks = nearbyCounties.map(nearbyCounty => ({
    slug: nearbyCounty,
    name: nearbyCounty.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: `/padel-courts/${country}/${nearbyCounty}`
  }))

  // Create schema markup for structured data
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${formattedCounty} Hotels with Padel Courts`,
    "description": `Discover luxury hotels with padel courts in ${formattedCounty}, ${formattedCountry}. Championship facilities and world-class accommodation.`,
    "url": `https://findhotelswith.com/padel-courts/${country}/${county}`,
    "about": {
      "@type": "Product",
      "name": `Padel Court Hotels in ${formattedCounty}`,
      "description": `Luxury accommodations with professional padel facilities in ${formattedCounty}`
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
        <div className="text-xl">Loading {formattedCounty} padel court hotels...</div>
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
                Hotels with Padel Courts in {formattedCounty} Near You
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Discover {sortedHotels.length} exceptional hotels in {formattedCounty}, {formattedCountry} featuring championship padel courts and luxury accommodation.
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
              {sortedHotels.length} Padel Court Hotels in {formattedCounty}
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
              <p className="text-gray-600 text-lg">No padel court hotels found in {formattedCounty} at this time.</p>
              <p className="text-gray-500 mt-2">Please check our other locations or contact us for assistance.</p>
            </div>
          )}
        </div>

        {/* Map Section */}
        {sortedHotels.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Padel Court Hotels in {formattedCounty}
            </h2>
            <div className="bg-white rounded-lg shadow-lg">
              <HotelsMap
                hotels={sortedHotels}
                className="h-[500px]"
                center={countyCoords?.center}
                zoom={countyCoords?.zoom}
              />
            </div>
          </div>
        )}

        {/* Cities/Towns Section */}
        {cityLinks.length > 0 && (
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Padel Court Hotels by City in {formattedCounty}
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Explore padel facilities in specific cities and towns across {formattedCounty}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cityLinks.map((city) => (
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

        {/* Nearby Counties Section */}
        {nearbyCountyLinks.length > 0 && (
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Explore Padel Court Hotels in Nearby Counties
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Discover more exceptional padel facilities in counties near {formattedCounty}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nearbyCountyLinks.map((county) => (
                    <Link
                      key={county.slug}
                      href={county.href}
                      className="inline-block px-4 py-3 bg-gray-100 hover:bg-orange-100 text-sm text-gray-700 hover:text-orange-700 rounded transition-colors text-center"
                    >
                      {county.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{formattedCounty} Padel Excellence</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  {countyData.description.replace(/County/g, formattedCounty)}
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose {formattedCounty} for Padel?</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  {countyData.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Premier Padel Venues in {formattedCounty}</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  {countyData.venues.map((venue, index) => (
                    <li key={index}>{venue}</li>
                  ))}
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Padel Facilities & Standards</h3>
                <p className="text-gray-700 mb-6">
                  Hotels in {formattedCounty} featuring padel courts offer world-class facilities including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Glass-enclosed courts with premium artificial turf surfaces</li>
                  <li>All-weather playing conditions year-round</li>
                  <li>Professional coaching from qualified instructors</li>
                  <li>Equipment hire including premium padel rackets and balls</li>
                  <li>Padel packages combining court time with luxury accommodation</li>
                  <li>Spa and wellness facilities for post-match recovery</li>
                  <li>Fine dining experiences and luxury amenities</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Time to Visit {formattedCounty}</h3>
                <p className="text-gray-700">
                  {formattedCounty} offers excellent padel conditions throughout the year. Padel can be enjoyed year-round
                  thanks to glass-enclosed court facilities. The peak season runs from April through October, with the warmest
                  and driest conditions typically found between May and September. Indoor courts and all-weather surfaces
                  make padel possible regardless of weather conditions.
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