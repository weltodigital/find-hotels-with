'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Hotel } from '@/types/hotel'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface HotelsMapProps {
  hotels: Hotel[]
  className?: string
  center?: [number, number]
  zoom?: number
}

export default function HotelsMap({ hotels, className = '', center, zoom }: HotelsMapProps) {
  const [mounted, setMounted] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Import Leaflet dynamically for client-side only
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)
    })
  }, [])

  // Filter hotels that have coordinates
  const hotelsWithCoordinates = hotels.filter(hotel =>
    hotel.latitude && hotel.longitude &&
    !isNaN(Number(hotel.latitude)) && !isNaN(Number(hotel.longitude))
  )

  // Calculate center and zoom based on hotels or use provided values
  const calculateMapCenter = (): [number, number] => {
    if (center) return center

    if (hotelsWithCoordinates.length === 0) {
      return [55.0, -3.0] // UK center fallback
    }

    if (hotelsWithCoordinates.length === 1) {
      const hotel = hotelsWithCoordinates[0]
      return [Number(hotel.latitude), Number(hotel.longitude)]
    }

    // Calculate center of all hotels
    const avgLat = hotelsWithCoordinates.reduce((sum, hotel) => sum + Number(hotel.latitude), 0) / hotelsWithCoordinates.length
    const avgLng = hotelsWithCoordinates.reduce((sum, hotel) => sum + Number(hotel.longitude), 0) / hotelsWithCoordinates.length

    return [avgLat, avgLng]
  }

  const calculateZoom = (): number => {
    if (zoom) return zoom

    if (hotelsWithCoordinates.length === 0) return 5.5 // UK overview
    if (hotelsWithCoordinates.length === 1) return 10 // City level for single hotel

    // Calculate bounds and appropriate zoom
    const lats = hotelsWithCoordinates.map(hotel => Number(hotel.latitude))
    const lngs = hotelsWithCoordinates.map(hotel => Number(hotel.longitude))

    const latDiff = Math.max(...lats) - Math.min(...lats)
    const lngDiff = Math.max(...lngs) - Math.min(...lngs)
    const maxDiff = Math.max(latDiff, lngDiff)

    // Adjust zoom based on spread of hotels
    if (maxDiff < 0.1) return 11 // City level
    if (maxDiff < 0.5) return 9  // County level
    if (maxDiff < 1.5) return 7  // Regional level
    return 6 // Country level
  }

  const mapCenter = calculateMapCenter()
  const mapZoom = calculateZoom()

  // Create tennis ball icon
  const createTennisBallIcon = () => {
    if (!L) return undefined

    return L.divIcon({
      html: `
        <div style="
          background: #FFEB3B;
          border: 2px solid #FFD600;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          position: relative;
        ">
          🎾
        </div>
      `,
      className: 'tennis-ball-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }

  if (!mounted || !L) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotelsWithCoordinates.map((hotel) => {
          const lat = Number(hotel.latitude)
          const lng = Number(hotel.longitude)
          const tennisBallIcon = createTennisBallIcon()

          return (
            <Marker
              key={hotel.id}
              position={[lat, lng]}
              icon={tennisBallIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>

                  {hotel.image_url && (
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}

                  <p className="text-sm text-gray-600 mb-2">
                    {hotel.city}, {hotel.county}
                  </p>

                  {hotel.google_rating && (
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500">★</span>
                      <span className="text-sm ml-1">
                        {hotel.google_rating}/5 ({hotel.google_reviews_count || 0} reviews)
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {hotel.description}
                  </p>

                  {hotel.price_range && (
                    <div className="text-green-600 font-semibold mb-2">
                      {hotel.price_range}
                    </div>
                  )}

                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      View Hotel
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Statistics */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="text-sm">
          <div className="font-semibold text-gray-900">
            {hotelsWithCoordinates.length} Hotels on Map
          </div>
          <div className="text-gray-600">
            {hotels.length - hotelsWithCoordinates.length} without coordinates
          </div>
        </div>
      </div>
    </div>
  )
}