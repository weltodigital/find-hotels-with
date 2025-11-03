export interface Hotel {
  id: string
  name: string
  slug?: string
  description?: string
  address?: string
  city: string
  county?: string
  country: string
  postcode?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  website?: string
  star_rating?: number
  total_rooms?: number
  check_in_time?: string
  check_out_time?: string
  image_url?: string
  images?: string[]
  price_range?: string
  booking_url?: string
  google_rating?: number
  google_reviews_count?: number
  google_photo_url?: string
  google_place_id?: string
  amenities?: string[]
  special_features?: string[]
  created_at: string
  updated_at: string

  // Legacy compatibility
  location?: string
  rating?: number
  website_url?: string
  contact_email?: string
  contact_phone?: string
}

export interface HotelFilter {
  location?: string
  amenities?: string[]
  price_range?: string
  rating_min?: number
  special_features?: string[]
}

export const SPECIAL_FEATURES = [
  'padel_court',
  'hot_tub_in_room',
  'private_pool',
  'tennis_court',
  'spa',
  'rooftop_terrace',
  'wine_cellar',
  'private_beach',
  'helicopter_pad',
  'golf_course'
] as const

export const AMENITIES = [
  'wifi',
  'parking',
  'pool',
  'gym',
  'restaurant',
  'bar',
  'room_service',
  'concierge',
  'business_center',
  'pet_friendly'
] as const