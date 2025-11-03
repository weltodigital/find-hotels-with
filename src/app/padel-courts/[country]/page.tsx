import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import HotelsMap from '@/components/HotelsMap'
import Breadcrumbs from '@/components/Breadcrumbs'
import { LOCATION_COORDINATES } from '@/lib/locationCoordinates'
import { notFound } from 'next/navigation'
import { Hotel } from '@/types/hotel'

interface CountyGroup {
  name: string
  hotels: Hotel[]
  cities: string[]
}

async function getHotelsInCountry(country: string) {
  if (!country || typeof country !== 'string') {
    return []
  }

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .ilike('description', '%padel%')
    .ilike('country', country.replace('-', ' '))
    .order('name')

  if (error) {
    console.error('Error fetching hotels:', error)
    return []
  }

  return data || []
}

function getCountiesWithHotels(hotels: Hotel[]) {
  const countyGroups = hotels.reduce((acc, hotel) => {
    const county = hotel.county || 'Unknown'
    if (!acc[county]) {
      acc[county] = {
        name: county,
        hotels: [],
        cities: new Set()
      }
    }
    acc[county].hotels.push(hotel)
    acc[county].cities.add(hotel.city)
    return acc
  }, {} as Record<string, { name: string; hotels: Hotel[]; cities: Set<string> }>)

  return Object.entries(countyGroups).map(([key, value]) => ({
    slug: key.toLowerCase().replace(/\s+/g, '-'),
    name: value.name,
    hotels: value.hotels,
    cities: Array.from(value.cities).sort()
  }))
}

export default async function CountryPadelPage({
  params
}: {
  params: { country: string }
}) {
  const { country } = params
  const hotels = await getHotelsInCountry(country)

  if (hotels.length === 0) {
    notFound()
  }

  const counties = getCountiesWithHotels(hotels)
  const countryName = hotels[0]?.country || country.charAt(0).toUpperCase() + country.slice(1)

  const rawMapCoords = LOCATION_COORDINATES.countries[country as keyof typeof LOCATION_COORDINATES.countries] || { center: [54.5, -3.0], zoom: 6 }
  const mapCenter: [number, number] = [rawMapCoords.center[0], rawMapCoords.center[1]]
  const mapZoom = rawMapCoords.zoom

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hotels with Padel Courts in {countryName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Discover {hotels.length} premium hotels with padel courts across {counties.length} counties
            </p>
          </div>
        </div>
      </section>

      {/* Counties Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Browse by County
          </h2>

          <div className="space-y-8">
            {counties.map((county) => (
              <div key={county.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <Link
                        href={`/padel-courts/${country}/${county.slug}`}
                        className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                      >
                        {county.name}
                      </Link>
                      <p className="text-gray-600 mt-1">
                        {county.hotels.length} hotels with padel courts in {county.cities.length} locations
                      </p>
                    </div>
                    <Link
                      href={`/padel-courts/${country}/${county.slug}`}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center mt-4 lg:mt-0"
                    >
                      View Hotels in {county.name}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  <div className="mb-6">
                    <HotelsMap
                      hotels={county.hotels}
                      className="h-64 rounded-lg"
                      center={(() => {
                        const coords = LOCATION_COORDINATES.counties[county.slug as keyof typeof LOCATION_COORDINATES.counties]
                        return coords ? [coords.center[0], coords.center[1]] as [number, number] : undefined
                      })()}
                      zoom={LOCATION_COORDINATES.counties[county.slug as keyof typeof LOCATION_COORDINATES.counties]?.zoom}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {county.cities.map((city) => (
                      <Link
                        key={city}
                        href={`/padel-courts/${country}/${county.slug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-lg p-3 text-center transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700 hover:text-orange-600">
                          {city}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Hotels Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            All Hotels with Padel Courts in {countryName}
          </h2>
          <HotelsMap
            hotels={hotels}
            className="h-96 rounded-lg shadow-lg"
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Hotels with Padel Courts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.slice(0, 6).map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{hotel.name}</h3>
                  <p className="text-orange-600 font-medium mb-2">{hotel.city}, {hotel.county}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{hotel.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">{hotel.price_range}</span>
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateStaticParams() {

  const { data: hotels } = await supabase
    .from('hotels')
    .select('country')
    .ilike('description', '%padel%')

  if (!hotels) return []

  const countries = [...new Set(hotels.map(hotel =>
    hotel.country.toLowerCase().replace(/\s+/g, '-')
  ))]

  return countries.map((country) => ({
    country,
  }))
}