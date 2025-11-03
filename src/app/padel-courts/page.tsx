'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Hotel } from '@/types/hotel'
import HotelCard from '@/components/HotelCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HotelsMap from '@/components/HotelsMap'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function PadelCourtHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'google_rating' | 'price_low' | 'price_high'>('price_high')

  useEffect(() => {
    fetchPadelHotels()
  }, [])

  useEffect(() => {
    applySorting()
  }, [hotels, sortBy])

  const applySorting = () => {
    let sortedHotels = [...hotels]

    switch (sortBy) {
      case 'google_rating':
        sortedHotels.sort((a, b) => {
          const ratingA = a.google_rating || 0
          const ratingB = b.google_rating || 0
          return ratingB - ratingA // Highest rating first
        })
        break
      case 'price_low':
        sortedHotels.sort((a, b) => {
          // Convert price ranges to numeric values for sorting
          const getPriceOrder = (priceRange: string | undefined) => {
            if (!priceRange) return 999
            if (priceRange.includes('£') || priceRange.includes('$')) {
              const priceLevel = (priceRange.match(/[£$]/g) || []).length
              return priceLevel
            }
            return 999
          }
          return getPriceOrder(a.price_range) - getPriceOrder(b.price_range) // Lowest price first
        })
        break
      case 'price_high':
        sortedHotels.sort((a, b) => {
          // Convert price ranges to numeric values for sorting
          const getPriceOrder = (priceRange: string | undefined) => {
            if (!priceRange) return 0 // No price goes to bottom for high-to-low
            if (priceRange.includes('£') || priceRange.includes('$')) {
              const priceLevel = (priceRange.match(/[£$]/g) || []).length
              return priceLevel
            }
            return 0
          }
          return getPriceOrder(b.price_range) - getPriceOrder(a.price_range) // Highest price first
        })
        break
      case 'name':
      default:
        sortedHotels.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredHotels(sortedHotels)
  }

  const fetchPadelHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Filter hotels with padel courts in descriptions
      const padelHotels = (data || []).filter(hotel =>
        hotel.description &&
        hotel.description.toLowerCase().includes('padel')
      )

      setHotels(padelHotels)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-xl">Loading padel court hotels...</div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      {/* Schema Markup for Padel Court Hotels */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "UK Hotels with Padel Courts",
            "description": "Comprehensive directory of luxury hotels across the United Kingdom featuring professional padel courts, championship facilities, and world-class accommodation.",
            "url": "https://findhotelswith.com/padel-courts",
            "mainEntity": {
              "@type": "ItemList",
              "name": "UK Hotels with Padel Courts",
              "numberOfItems": filteredHotels.length,
              "itemListElement": filteredHotels.slice(0, 20).map((hotel, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Hotel",
                  "name": hotel.name,
                  "description": hotel.description,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": hotel.city,
                    "addressCountry": "United Kingdom"
                  },
                  "amenityFeature": [
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Padel Court",
                      "value": true
                    }
                  ],
                  "url": hotel.website || hotel.booking_url
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://findhotelswith.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Padel Court Hotels",
                  "item": "https://findhotelswith.com/padel-courts"
                }
              ]
            }
          })
        }}
      />

      <Header />
      <Breadcrumbs />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                UK Hotels with Padel Courts
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                Discover the finest luxury hotels across the United Kingdom featuring championship padel courts,
                professional facilities, and world-class accommodation. From glass-enclosed courts to
                all-weather surfaces, find your perfect padel holiday destination.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg mb-8">
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium">
                  🏸 {filteredHotels.length} Hotels Available
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                  🏆 Championship Facilities
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                  🇬🇧 Across the UK
                </span>
              </div>

              {/* Anchor Button to Hotels List */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const element = document.getElementById('hotels-list')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="bg-white text-orange-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors shadow-md border-2 border-orange-200"
                >
                  Browse All Hotels ↓
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Country Links Section */}
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore by Country
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover padel court hotels across England, Scotland, Wales, and Northern Ireland. Each country offers unique venues from historic estates to modern luxury resorts.
              </p>
            </div>

            <div className="space-y-8 max-w-6xl mx-auto">
              {/* England Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center bg-gray-50 p-6">
                  <div className="text-gray-700 text-4xl mr-6">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">England</h3>
                      <Link href="/padel-courts/england" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        View All England Hotels →
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      17 luxury hotels featuring championship padel courts from glass-enclosed facilities to outdoor courts across prestigious estates.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">All Counties:</p>
                  <div className="flex flex-wrap gap-2">
                        <Link href="/padel-courts/england/surrey" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Surrey
                        </Link>
                        <Link href="/padel-courts/england/hampshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Hampshire
                        </Link>
                        <Link href="/padel-courts/england/oxfordshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Oxfordshire
                        </Link>
                        <Link href="/padel-courts/england/buckinghamshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Buckinghamshire
                        </Link>
                        <Link href="/padel-courts/england/essex" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Essex
                        </Link>
                        <Link href="/padel-courts/england/somerset" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Somerset
                        </Link>
                        <Link href="/padel-courts/england/devon" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Devon
                        </Link>
                        <Link href="/padel-courts/england/cornwall" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Cornwall
                        </Link>
                        <Link href="/padel-courts/england/hertfordshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Hertfordshire
                        </Link>
                        <Link href="/padel-courts/england/leicestershire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Leicestershire
                        </Link>
                        <Link href="/padel-courts/england/lincolnshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Lincolnshire
                        </Link>
                        <Link href="/padel-courts/england/gloucestershire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Gloucestershire
                        </Link>
                        <Link href="/padel-courts/england/cheshire" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Cheshire
                        </Link>
                        <Link href="/padel-courts/england/east-sussex" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          East Sussex
                        </Link>
                      </div>
                </div>
              </div>

              {/* Scotland Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center bg-gray-50 p-6">
                  <div className="text-gray-700 text-4xl mr-6">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">Scotland</h3>
                      <Link href="/padel-courts/scotland" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        View All Scotland Hotels →
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      1 world-renowned resort featuring championship padel courts set against Highland landscapes, including the legendary Gleneagles.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">All Counties:</p>
                  <div className="flex flex-wrap gap-2">
                        <Link href="/padel-courts/scotland/perth-and-kinross" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Perth and Kinross
                        </Link>
                      </div>
                </div>
              </div>

              {/* Wales Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center bg-gray-50 p-6">
                  <div className="text-gray-700 text-4xl mr-6">🏴󠁧󠁢󠁷󠁬󠁳󠁿</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">Wales</h3>
                      <Link href="/padel-courts/wales" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        View All Wales Hotels →
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      1 coastal resort featuring padel courts with stunning views over Cardigan Bay in the beautiful Welsh countryside.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">All Counties:</p>
                  <div className="flex flex-wrap gap-2">
                        <Link href="/padel-courts/wales/gwynedd" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Gwynedd
                        </Link>
                  </div>
                </div>
              </div>


              {/* Northern Ireland Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center bg-gray-50 p-6">
                  <div className="text-gray-700 text-4xl mr-6">🇬🇧</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">Northern Ireland</h3>
                      <Link href="/padel-courts/northern-ireland" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        View All Northern Ireland Hotels →
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      1 lakeside hotel featuring padel courts overlooking Lough Erne, offering a perfect blend of water sports and padel excellence.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">All Counties:</p>
                  <div className="flex flex-wrap gap-2">
                        <Link href="/padel-courts/northern-ireland/fermanagh" className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 hover:text-gray-900 rounded transition-colors">
                          Fermanagh
                        </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hotels Listing Section */}
        <section id="hotels-list" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {filteredHotels.length} UK Hotels with Padel Courts
              </h2>
              <p className="text-xl text-gray-600">
                Luxury accommodation with championship padel facilities
              </p>
            </div>

            {/* Sorting Controls */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'google_rating' | 'price_low' | 'price_high')}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="google_rating">Rating (High to Low)</option>
                    <option value="price_low">Price (Low to High)</option>
                    <option value="price_high">Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredHotels.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No padel court hotels found
                </h3>
                <p className="text-gray-600">
                  Please check back later as we add more properties
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find A Hotel With Padel Courts Near You
              </h2>
              <p className="text-xl text-gray-600">
                Interactive map showing all UK hotels with padel courts. Click markers for hotel details.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <HotelsMap
                hotels={filteredHotels}
                className="h-[500px] md:h-[600px] lg:h-[700px] w-full"
              />
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                🗺️ Powered by OpenStreetMap • Click markers to view hotel details
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                The Ultimate Guide to UK Hotels with Padel Courts
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8">
                  Whether you're a seasoned padel player, new to this exciting sport, or simply looking for active leisure
                  during your stay, the United Kingdom offers an exceptional collection of hotels with world-class
                  padel facilities. From historic country estates to modern luxury resorts, these properties
                  combine outstanding accommodation with championship-quality glass-enclosed courts.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Why Choose UK Padel Hotels?
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">✓</span>
                        Professional championship-standard glass-enclosed courts
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">✓</span>
                        All-weather playing surfaces with premium artificial turf
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">✓</span>
                        Professional coaching and equipment hire available
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">✓</span>
                        Luxury spa and wellness facilities for post-game recovery
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">✓</span>
                        Fine dining and premium accommodation
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Top Padel Destinations in the UK
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Surrey:</strong> Championship venues with state-of-the-art facilities
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Scotland:</strong> Highland resorts with stunning mountain backdrops
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Cotswolds:</strong> Historic estates in picture-perfect settings
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Hampshire:</strong> Country clubs with professional-standard facilities
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">📍</span>
                        <strong>Cornwall:</strong> Coastal resorts combining padel with stunning sea views
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Featured Padel Court Hotels Across the UK
                </h3>
                <p className="text-gray-600 mb-8">
                  Our curated selection includes properties that go beyond basic court facilities, offering
                  championship-quality glass-enclosed courts, professional coaching, equipment hire, and luxury
                  amenities. Many feature multiple courts with premium artificial turf surfaces, allowing guests to experience
                  this fast-growing sport in world-class settings.
                </p>

                <div className="bg-orange-50 p-6 rounded-lg mb-8">
                  <h4 className="text-xl font-semibold text-orange-900 mb-4">
                    🏆 Championship Standard Facilities
                  </h4>
                  <p className="text-orange-800">
                    Many of our featured hotels maintain courts to professional tournament standards,
                    including proper lighting for evening play, spectator seating, and surfaces maintained
                    by qualified groundsmen. Some properties even host professional tournaments and coaching clinics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What is padel and how is it different from tennis?
                </h3>
                <p className="text-gray-600">
                  Padel is a racquet sport played in doubles on an enclosed court about one-third the size of a tennis court.
                  The game is played with solid rackets (no strings) and lower-pressure tennis balls. The walls are used
                  as part of the game, similar to squash, making it more accessible and social than traditional tennis.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Do I need to bring my own padel equipment?
                </h3>
                <p className="text-gray-600">
                  Most hotels with padel facilities offer racket and ball hire, though availability and quality
                  vary. Professional-standard venues often provide premium equipment from leading brands.
                  We recommend checking with your chosen hotel about equipment availability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Are padel coaching services available at these hotels?
                </h3>
                <p className="text-gray-600">
                  Many of our featured hotels employ resident padel professionals who offer coaching for all
                  skill levels, from complete beginners to advanced players. Padel is known for being easy to learn
                  but challenging to master. Professional coaching should be booked in advance, especially during peak seasons.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Can padel be played year-round in the UK?
                </h3>
                <p className="text-gray-600">
                  Yes! Most padel courts in the UK are enclosed glass structures that can be played in most weather conditions.
                  Many hotels also offer indoor courts with climate control, making padel an excellent year-round activity.
                  The enclosed nature of padel courts provides shelter from wind and light rain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-orange-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Book Your Padel Holiday?
            </h2>
            <p className="text-xl mb-8">
              Discover championship padel facilities at luxury hotels across the United Kingdom.
              Perfect your game while enjoying world-class accommodation and amenities.
            </p>
            <a
              href="#padel-hotels"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Browse Padel Court Hotels
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}