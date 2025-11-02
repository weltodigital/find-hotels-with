-- Create hotels table for storing hotel information
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United Kingdom',
  price_range TEXT CHECK (price_range IN ('£', '££', '£££', '££££')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  amenities TEXT[] DEFAULT '{}',
  special_features TEXT[] DEFAULT '{}',
  image_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_country ON hotels(country);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(rating);
CREATE INDEX IF NOT EXISTS idx_hotels_special_features ON hotels USING GIN (special_features);
CREATE INDEX IF NOT EXISTS idx_hotels_amenities ON hotels USING GIN (amenities);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hotels_updated_at
    BEFORE UPDATE ON hotels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO hotels (name, description, location, city, country, price_range, rating, amenities, special_features, website_url) VALUES
(
  'The Padel Palace Hotel',
  'A luxury hotel featuring state-of-the-art padel courts and premium accommodations. Perfect for sports enthusiasts looking for an active holiday.',
  'Hyde Park Corner',
  'London',
  'United Kingdom',
  '££££',
  5,
  ARRAY['wifi', 'parking', 'pool', 'gym', 'restaurant', 'bar', 'room_service', 'concierge'],
  ARRAY['padel_court', 'spa', 'rooftop_terrace'],
  'https://example.com/padel-palace'
),
(
  'Hot Tub Hideaway',
  'Intimate boutique hotel where every room features its own private hot tub. Unwind in luxury with stunning city views.',
  'Camden',
  'London',
  'United Kingdom',
  '£££',
  4,
  ARRAY['wifi', 'parking', 'restaurant', 'bar', 'room_service'],
  ARRAY['hot_tub_in_room', 'rooftop_terrace'],
  'https://example.com/hot-tub-hideaway'
),
(
  'The Private Pool Resort',
  'Exclusive resort featuring private pools in every suite. Experience ultimate privacy and luxury.',
  'Marylebone',
  'London',
  'United Kingdom',
  '££££',
  5,
  ARRAY['wifi', 'parking', 'gym', 'restaurant', 'bar', 'room_service', 'concierge', 'business_center'],
  ARRAY['private_pool', 'spa', 'wine_cellar'],
  'https://example.com/private-pool-resort'
),
(
  'Tennis & Spa Manor',
  'Historic manor house with championship tennis courts and world-class spa facilities.',
  'Windsor',
  'Windsor',
  'United Kingdom',
  '£££',
  4,
  ARRAY['wifi', 'parking', 'pool', 'gym', 'restaurant', 'bar', 'pet_friendly'],
  ARRAY['tennis_court', 'spa', 'golf_course'],
  'https://example.com/tennis-spa-manor'
),
(
  'Sky Terrace Hotel',
  'Modern hotel featuring stunning rooftop terraces with panoramic views and premium amenities.',
  'Canary Wharf',
  'London',
  'United Kingdom',
  '££',
  3,
  ARRAY['wifi', 'parking', 'restaurant', 'bar', 'business_center'],
  ARRAY['rooftop_terrace'],
  'https://example.com/sky-terrace'
);

-- Enable Row Level Security (optional, for multi-tenant applications)
-- ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;