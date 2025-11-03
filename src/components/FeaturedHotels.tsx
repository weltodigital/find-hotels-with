import { Hotel } from '@/types/hotel'
import HotelCard from './HotelCard'

interface FeaturedHotelsProps {
  hotels: Hotel[]
}

export default function FeaturedHotels({ hotels }: FeaturedHotelsProps) {
  // Get a selection of featured hotels (first 6)
  const featuredHotels = hotels.slice(0, 6)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Featured Luxury Hotels
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked selection of premium hotels featuring the most extraordinary amenities
            and unparalleled luxury experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              const element = document.getElementById('features')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Discover Hotel Amenities ↑
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}