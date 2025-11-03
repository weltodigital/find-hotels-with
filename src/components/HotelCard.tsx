import { Hotel } from '@/types/hotel'
import Image from 'next/image'
import Link from 'next/link'

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  // Function to bold tennis court mentions in description
  const formatDescription = (description: string) => {
    if (!description) return description

    // Replace tennis-related terms with bold versions (case insensitive)
    let result = description

    // First, handle multi-word phrases
    result = result.replace(/(tennis\s+courts?)/gi, '<strong>$1</strong>')
    result = result.replace(/(racquets?\s+courts?)/gi, '<strong>$1</strong>')
    result = result.replace(/(rackets?\s+courts?)/gi, '<strong>$1</strong>')

    // Then bold standalone "tennis" that isn't already in a <strong> tag
    result = result.replace(/\b(tennis)\b(?![^<]*<\/strong>)/gi, (match, word, offset, string) => {
      // Check if this "tennis" is already inside a <strong> tag
      const beforeMatch = string.substring(0, offset)
      const lastStrongOpen = beforeMatch.lastIndexOf('<strong>')
      const lastStrongClose = beforeMatch.lastIndexOf('</strong>')

      // If we're inside a <strong> tag, don't bold again
      if (lastStrongOpen > lastStrongClose) {
        return match
      }

      return `<strong>${word}</strong>`
    })

    return result
  }

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
          {hotel.address || hotel.location || 'Address TBD'}, {hotel.city}, {hotel.country}
        </p>

        {hotel.google_rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-1">
              <div className="flex text-blue-500">
                {[...Array(5)].map((_, i) => {
                  const rating = hotel.google_rating || 0;
                  const starValue = i + 1;

                  if (rating >= starValue) {
                    // Full star
                    return <span key={i}>★</span>;
                  } else if (rating >= starValue - 0.5) {
                    // Half star (use a different character or style)
                    return <span key={i} className="relative">
                      <span className="text-gray-300">★</span>
                      <span className="absolute inset-0 overflow-hidden w-1/2">★</span>
                    </span>;
                  } else {
                    // Empty star
                    return <span key={i} className="text-gray-300">★</span>;
                  }
                })}
              </div>
              <span className="text-sm text-gray-600">
                {hotel.google_rating}/5 ({hotel.google_reviews_count || 0} reviews)
              </span>
            </div>
          </div>
        )}

        <p
          className="text-gray-700 mb-4"
          dangerouslySetInnerHTML={{
            __html: formatDescription(hotel.description || '')
          }}
        />

        {hotel.special_features && hotel.special_features.length > 0 && (
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

          {(hotel.website || hotel.website_url || hotel.booking_url) && (
            <Link
              href={hotel.website || hotel.website_url || hotel.booking_url || '#'}
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