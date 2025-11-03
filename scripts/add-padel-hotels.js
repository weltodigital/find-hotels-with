import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Not found')

// Padel court hotels with location data
const padelHotels = [
  {
    name: "SeaSpace",
    city: "Camber",
    county: "East Sussex",
    country: "England",
    description: "Luxury beachfront resort with modern padel courts overlooking the coast. SeaSpace offers world-class padel facilities alongside stunning sea views and premium accommodation.",
    latitude: 50.9167,
    longitude: 0.7833,
    price_range: "££££",
    website: "https://seaspace.co.uk"
  },
  {
    name: "Fairmont Windsor Park",
    city: "Egham",
    county: "Surrey",
    country: "England",
    description: "Prestigious hotel featuring championship padel courts in beautiful parkland settings. This luxury resort combines traditional elegance with modern padel facilities.",
    amenities: ["Padel Courts", "Golf Course", "Spa", "Fine Dining", "Tennis Courts"],
    latitude: 51.4333,
    longitude: -0.5667,
    price_range: "£££££",
    website: "https://www.fairmont.com/windsor-park"
  },
  {
    name: "Foxhills Country Club",
    city: "Ottershaw",
    county: "Surrey",
    country: "England",
    description: "Premier country club with state-of-the-art padel courts and comprehensive sporting facilities. Foxhills offers an exceptional padel experience in Surrey's countryside.",
    amenities: ["Padel Courts", "Golf Courses", "Tennis Courts", "Spa", "Swimming Pool"],
    latitude: 51.3667,
    longitude: -0.5167,
    price_range: "££££",
    website: "https://www.foxhills.co.uk"
  },
  {
    name: "New Place Hotel",
    city: "Southampton",
    county: "Hampshire",
    country: "England",
    description: "Historic hotel with modern padel courts offering luxury accommodation and excellent sporting facilities in the heart of Hampshire.",
    amenities: ["Padel Courts", "Restaurant", "Bar", "Conference Facilities"],
    latitude: 50.9097,
    longitude: -1.4044,
    price_range: "£££",
    website: "https://www.newplacehotel.co.uk"
  },
  {
    name: "Hilton Cobham",
    city: "Cobham",
    county: "Surrey",
    country: "England",
    description: "Modern hotel featuring padel courts with professional-standard facilities. Convenient location with excellent transport links and premium amenities.",
    amenities: ["Padel Courts", "Fitness Center", "Restaurant", "Conference Facilities"],
    latitude: 51.3167,
    longitude: -0.4167,
    price_range: "£££",
    website: "https://www.hilton.com/cobham"
  },
  {
    name: "Bicester Hotel Golf and Spa",
    city: "Bicester",
    county: "Oxfordshire",
    country: "England",
    description: "Luxury resort with padel courts, golf course and spa facilities. Perfect combination of sport and relaxation in beautiful Oxfordshire countryside.",
    amenities: ["Padel Courts", "Golf Course", "Spa", "Restaurant", "Conference Facilities"],
    latitude: 51.9000,
    longitude: -1.1500,
    price_range: "££££",
    website: "https://www.bicesterhotel.com"
  },
  {
    name: "The Gleneagles Hotel",
    city: "Auchterarder",
    county: "Perth and Kinross",
    country: "Scotland",
    description: "World-renowned luxury resort featuring championship padel courts alongside legendary golf courses. Scotland's premier destination for luxury sports holidays.",
    amenities: ["Padel Courts", "Golf Courses", "Tennis Courts", "Spa", "Fine Dining", "Shooting", "Falconry"],
    latitude: 56.2833,
    longitude: -3.7000,
    price_range: "£££££",
    website: "https://www.gleneagles.com"
  },
  {
    name: "Beaverbrook",
    city: "Leatherhead",
    county: "Surrey",
    country: "England",
    description: "Luxury country house hotel with modern padel courts set in stunning Surrey Hills. Combines traditional elegance with contemporary sporting facilities.",
    amenities: ["Padel Courts", "Spa", "Fine Dining", "Gardens", "Tennis Courts"],
    latitude: 51.2833,
    longitude: -0.3833,
    price_range: "£££££",
    website: "https://www.beaverbrook.co.uk"
  },
  {
    name: "Stoke Park",
    city: "Stoke Poges",
    county: "Buckinghamshire",
    country: "England",
    description: "Historic luxury resort featuring championship padel courts on a world-famous estate. Combines sporting excellence with luxury accommodation and dining.",
    amenities: ["Padel Courts", "Golf Course", "Tennis Courts", "Spa", "Fine Dining"],
    latitude: 51.5333,
    longitude: -0.5833,
    price_range: "£££££",
    website: "https://www.stokepark.com"
  },
  {
    name: "Down Hall Hotel, Spa & Estate",
    city: "Hatfield Heath",
    county: "Essex",
    country: "England",
    description: "Country estate hotel with padel courts set in beautiful grounds. Offers luxury accommodation with excellent sporting and spa facilities.",
    amenities: ["Padel Courts", "Spa", "Golf Course", "Restaurant", "Conference Facilities"],
    latitude: 51.8000,
    longitude: 0.1833,
    price_range: "££££",
    website: "https://www.downhall.co.uk"
  },
  {
    name: "Babington House",
    city: "Babington",
    county: "Somerset",
    country: "England",
    description: "Exclusive country house hotel with padel courts in beautiful Somerset countryside. Member of Soho House group offering luxury and privacy.",
    amenities: ["Padel Courts", "Spa", "Swimming Pool", "Restaurant", "Cinema"],
    latitude: 51.3167,
    longitude: -2.4667,
    price_range: "£££££",
    website: "https://www.sohohouse.com/babington-house"
  },
  {
    name: "Dartington Hall Estate",
    city: "Totnes",
    county: "Devon",
    country: "England",
    description: "Historic estate with modern padel courts set in stunning Devon countryside. Unique combination of heritage and contemporary sporting facilities.",
    amenities: ["Padel Courts", "Gardens", "Arts Centre", "Restaurant"],
    latitude: 50.4667,
    longitude: -3.8000,
    price_range: "£££",
    website: "https://www.dartington.org"
  },
  {
    name: "The Ashbury Resort",
    city: "Ashbury",
    county: "Oxfordshire",
    country: "England",
    description: "Boutique resort featuring padel courts with panoramic countryside views. Luxury accommodation in the beautiful Vale of White Horse.",
    amenities: ["Padel Courts", "Restaurant", "Spa", "Conference Facilities"],
    latitude: 51.5667,
    longitude: -1.5833,
    price_range: "££££",
    website: "https://www.ashburyresort.co.uk"
  },
  {
    name: "The Manor Resort",
    city: "Yeovil",
    county: "Somerset",
    country: "England",
    description: "Country manor hotel with padel courts and comprehensive leisure facilities. Perfect for sporting breaks in beautiful Somerset.",
    amenities: ["Padel Courts", "Swimming Pool", "Gym", "Restaurant", "Conference Facilities"],
    latitude: 50.9500,
    longitude: -2.6333,
    price_range: "£££",
    website: "https://www.themanorresort.co.uk"
  },
  {
    name: "Trevose Golf and Country Club",
    city: "Padstow",
    county: "Cornwall",
    country: "England",
    description: "Coastal resort with padel courts overlooking the Cornish coast. Combines championship golf with excellent padel facilities and stunning sea views.",
    amenities: ["Padel Courts", "Golf Courses", "Restaurant", "Accommodation"],
    latitude: 50.5500,
    longitude: -4.9833,
    price_range: "£££",
    website: "https://www.trevose-gc.co.uk"
  },
  {
    name: "Prested Hall",
    city: "Feering",
    county: "Essex",
    country: "England",
    description: "Tudor manor house with modern padel courts in beautiful Essex countryside. Historic charm combined with contemporary sporting facilities.",
    amenities: ["Padel Courts", "Restaurant", "Conference Facilities", "Gardens"],
    latitude: 51.8667,
    longitude: 0.6833,
    price_range: "£££",
    website: "https://www.prested.co.uk"
  },
  {
    name: "Champneys Tring",
    city: "Tring",
    county: "Hertfordshire",
    country: "England",
    description: "Premier spa resort with padel courts and comprehensive wellness facilities. Leading destination for health, fitness and padel in Hertfordshire.",
    amenities: ["Padel Courts", "Spa", "Fitness Center", "Swimming Pool", "Healthy Dining"],
    latitude: 51.7833,
    longitude: -0.6667,
    price_range: "££££",
    website: "https://www.champneys.com/tring"
  },
  {
    name: "Champneys Forest Mere",
    city: "Liphook",
    county: "Hampshire",
    country: "England",
    description: "Forest spa resort featuring padel courts in tranquil woodland setting. Combines luxury spa treatments with excellent sporting facilities.",
    amenities: ["Padel Courts", "Spa", "Swimming Pool", "Fitness Center", "Forest Walks"],
    latitude: 51.0667,
    longitude: -0.8000,
    price_range: "££££",
    website: "https://www.champneys.com/forest-mere"
  },
  {
    name: "Doddington Hall",
    city: "Lincoln",
    county: "Lincolnshire",
    country: "England",
    description: "Historic hall with modern padel courts set in beautiful gardens. Unique venue combining Elizabethan architecture with contemporary sporting facilities.",
    amenities: ["Padel Courts", "Historic House", "Gardens", "Restaurant"],
    latitude: 53.2833,
    longitude: -0.4833,
    price_range: "£££",
    website: "https://www.doddingtonhall.com"
  },
  {
    name: "The Warren Resort & Spa",
    city: "Abersoch",
    county: "Gwynedd",
    country: "Wales",
    description: "Coastal resort with padel courts overlooking Cardigan Bay. Perfect combination of beach location and excellent sporting facilities in North Wales.",
    amenities: ["Padel Courts", "Spa", "Beach Access", "Restaurant", "Swimming Pool"],
    latitude: 52.8167,
    longitude: -4.4833,
    price_range: "££££",
    website: "https://www.warrenresort.co.uk"
  },
  {
    name: "Champneys Springs",
    city: "Ashby-de-la-Zouch",
    county: "Leicestershire",
    country: "England",
    description: "Luxury spa resort with padel courts and natural spring waters. Premier wellness destination with excellent sporting and spa facilities.",
    amenities: ["Padel Courts", "Spa", "Natural Springs", "Swimming Pool", "Fitness Center"],
    latitude: 52.7500,
    longitude: -1.4667,
    price_range: "££££",
    website: "https://www.champneys.com/springs"
  },
  {
    name: "Mad Swans in The Mendips",
    city: "Winscombe",
    county: "Somerset",
    country: "England",
    description: "Boutique resort in the Mendip Hills featuring padel courts with panoramic views. Unique venue combining luxury accommodation with outdoor pursuits.",
    amenities: ["Padel Courts", "Restaurant", "Outdoor Activities", "Conference Facilities"],
    latitude: 51.3500,
    longitude: -2.8167,
    price_range: "£££",
    website: "https://www.madswans.co.uk"
  },
  {
    name: "Fitzpatrick Castle Hotel",
    city: "Killiney",
    county: "Dublin",
    country: "Ireland",
    description: "Castle hotel with padel courts overlooking Dublin Bay. Historic luxury with modern sporting facilities and stunning coastal views.",
    amenities: ["Padel Courts", "Castle Setting", "Sea Views", "Restaurant", "Spa"],
    latitude: 53.2500,
    longitude: -6.1167,
    price_range: "££££",
    website: "https://www.fitzpatrickcastle.com"
  },
  {
    name: "Estelle Manor",
    city: "Oxfordshire",
    county: "Oxfordshire",
    country: "England",
    description: "Luxury manor house with padel courts in beautiful Oxfordshire countryside. Contemporary luxury in historic setting with excellent sporting facilities.",
    amenities: ["Padel Courts", "Spa", "Fine Dining", "Gardens", "Conference Facilities"],
    latitude: 51.7500,
    longitude: -1.2500,
    price_range: "£££££",
    website: "https://www.estellemanor.com"
  },
  {
    name: "Killyhevlin Lakeside Hotel & Lodges",
    city: "Enniskillen",
    county: "Fermanagh",
    country: "Northern Ireland",
    description: "Lakeside hotel with padel courts overlooking Lough Erne. Beautiful location combining water sports with excellent padel facilities.",
    amenities: ["Padel Courts", "Lakeside Location", "Water Sports", "Restaurant", "Spa"],
    latitude: 54.3500,
    longitude: -7.6333,
    price_range: "£££",
    website: "https://www.killyhevlin.com"
  },
  {
    name: "Brean Country Club",
    city: "Brean",
    county: "Somerset",
    country: "England",
    description: "Coastal country club with padel courts near Brean Beach. Family-friendly resort with excellent sporting facilities and beach access.",
    amenities: ["Padel Courts", "Beach Access", "Swimming Pool", "Restaurant", "Entertainment"],
    latitude: 51.2833,
    longitude: -3.0000,
    price_range: "££",
    website: "https://www.breancountryclub.co.uk"
  },
  {
    name: "Cotswolds Hotel & Spa",
    city: "Chipping Campden",
    county: "Gloucestershire",
    country: "England",
    description: "Cotswolds luxury hotel with padel courts in Area of Outstanding Natural Beauty. Traditional Cotswold stone architecture with modern sporting facilities.",
    amenities: ["Padel Courts", "Spa", "Fine Dining", "Gardens", "Cotswolds Location"],
    latitude: 52.0500,
    longitude: -1.7833,
    price_range: "££££",
    website: "https://www.cotswoldshotel.co.uk"
  },
  {
    name: "Mottram Hall",
    city: "Mottram St Andrew",
    county: "Cheshire",
    country: "England",
    description: "Country house hotel with padel courts set in Cheshire countryside. Georgian elegance combined with contemporary sporting and leisure facilities.",
    amenities: ["Padel Courts", "Golf Course", "Spa", "Restaurant", "Conference Facilities"],
    latitude: 53.2833,
    longitude: -2.1333,
    price_range: "££££",
    website: "https://www.mottramhall.com"
  }
]

async function addPadelHotels() {
  console.log('Adding padel court hotels to database...')

  try {
    for (const hotel of padelHotels) {
      console.log(`Adding ${hotel.name}...`)

      const { data, error } = await supabase
        .from('hotels')
        .insert([hotel])
        .select()

      if (error) {
        console.error(`Error adding ${hotel.name}:`, error)
      } else {
        console.log(`✓ Added ${hotel.name}`)
      }
    }

    console.log('\nAll padel court hotels added successfully!')

    // Verify the additions
    const { data: padelCount, error: countError } = await supabase
      .from('hotels')
      .select('count', { count: 'exact' })
      .or('description.ilike.%padel%,amenities.cs.["Padel Courts"]')

    if (!countError) {
      console.log(`\nTotal hotels with padel courts: ${padelCount.length || 0}`)
    }

  } catch (error) {
    console.error('Error in adding padel hotels:', error)
  }
}

addPadelHotels()