import { Hotel } from '@/types/hotel'
import Image from 'next/image'
import Link from 'next/link'

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {hotel.image_url && (
        <div className="relative h-48 w-full">
          <Image
            src={hotel.image_url}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {hotel.name}
        </h3>

        <p className="text-gray-600 mb-2">
          {hotel.location}, {hotel.city}, {hotel.country}
        </p>

        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < hotel.rating ? "★" : "☆"}>
                ★
              </span>
            ))}
          </div>
          <span className="ml-2 text-gray-600">({hotel.rating})</span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {hotel.description}
        </p>

        {hotel.special_features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Special Features:</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.special_features.map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {feature.replace('_', ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-green-600">
            {hotel.price_range}
          </span>

          {hotel.website_url && (
            <Link
              href={hotel.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Hotel
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}