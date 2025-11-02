export interface Hotel {
  id: string
  name: string
  description: string
  location: string
  city: string
  country: string
  price_range: string
  rating: number
  amenities: string[]
  special_features: string[]
  image_url?: string
  website_url?: string
  contact_email?: string
  contact_phone?: string
  created_at: string
  updated_at: string
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