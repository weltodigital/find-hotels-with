import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const hotelsToSearch = [
  {
    name: 'Morton of Pitmilly',
    search: 'Morton of Pitmilly St Andrews Fife Scotland',
    city: 'St Andrews',
    county: 'Fife'
  },
  {
    name: 'Hoar Cross Hall Spa Hotel',
    search: 'Hoar Cross Hall Spa Hotel Burton on Trent Staffordshire',
    city: 'Burton on Trent',
    county: 'Staffordshire'
  },
  {
    name: 'Champneys Henlow Grange',
    search: 'Champneys Henlow Grange Bedfordshire',
    city: 'Henlow',
    county: 'Bedfordshire'
  },
  {
    name: 'Trefeddian Hotel',
    search: 'Trefeddian Hotel Aberdyfi Gwynedd Wales',
    city: 'Aberdyfi',
    county: 'Gwynedd'
  },
  {
    name: 'Headland Hotel',
    search: 'Headland Hotel Newquay Cornwall',
    city: 'Newquay',
    county: 'Cornwall'
  },
  {
    name: 'Manor & Ashbury Resorts',
    search: 'Manor Ashbury Resorts Okehampton Devon',
    city: 'Okehampton',
    county: 'Devon'
  }
]

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function searchGooglePlace(query) {
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googleApiKey}`

    console.log(`🔍 Searching: ${query}`)

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data.status !== 'OK') {
      console.log(`❌ Search failed: ${data.status}`)
      return null
    }

    if (data.results.length === 0) {
      console.log(`❌ No results found`)
      return null
    }

    const place = data.results[0]
    console.log(`✅ Found: ${place.name} (Rating: ${place.rating || 'N/A'})`)

    return {
      place_id: place.place_id,
      name: place.name,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      photos: place.photos || []
    }

  } catch (error) {
    console.error(`❌ Error searching for ${query}:`, error.message)
    return null
  }
}

async function getPlacePhoto(photoReference, maxWidth = 800) {
  if (!photoReference) return null

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${googleApiKey}`
}

async function updateHotelWithGoogleData() {
  try {
    console.log('🔄 Getting Google data for 6 new hotels...')
    console.log('⏱️  Adding delays between API calls to manage costs...\n')

    for (const hotel of hotelsToSearch) {
      console.log(`\n📍 Processing: ${hotel.name}`)

      // Search for the place
      const placeData = await searchGooglePlace(hotel.search)

      if (!placeData) {
        console.log(`⚠️  Skipping ${hotel.name} - no Google data found`)
        continue
      }

      // Get photo URL if available
      let imageUrl = null
      if (placeData.photos.length > 0) {
        imageUrl = await getPlacePhoto(placeData.photos[0].photo_reference)
        console.log(`📸 Photo URL generated`)
      }

      // Update the database
      const updateData = {
        google_place_id: placeData.place_id,
        google_rating: placeData.rating,
        google_reviews_count: placeData.user_ratings_total,
        updated_at: new Date().toISOString()
      }

      if (imageUrl) {
        updateData.image_url = imageUrl
        updateData.google_photo_url = imageUrl
      }

      const { data, error } = await supabase
        .from('hotels')
        .update(updateData)
        .eq('name', hotel.name)
        .select()

      if (error) {
        console.log(`❌ Database error for ${hotel.name}:`, error.message)
        continue
      }

      if (data.length === 0) {
        console.log(`⚠️  Hotel "${hotel.name}" not found in database`)
        continue
      }

      console.log(`✅ Updated ${hotel.name}:`)
      console.log(`   Rating: ${placeData.rating || 'N/A'}/5`)
      console.log(`   Reviews: ${placeData.user_ratings_total || 'N/A'}`)
      console.log(`   Image: ${imageUrl ? 'Added' : 'Not available'}`)

      // Add delay between API calls to manage costs
      console.log('⏳ Waiting 2 seconds before next request...')
      await sleep(2000)
    }

    console.log('\n🎾 Successfully updated hotels with Google data!')

    // Show summary
    const { data: updatedHotels, error: summaryError } = await supabase
      .from('hotels')
      .select('name, google_rating, google_reviews_count, image_url')
      .in('name', hotelsToSearch.map(h => h.name))

    if (!summaryError) {
      console.log('\n📊 Summary of updated hotels:')
      updatedHotels.forEach(hotel => {
        console.log(`- ${hotel.name}: ${hotel.google_rating || 'N/A'}/5 (${hotel.google_reviews_count || 0} reviews) ${hotel.image_url ? '📸' : ''}`)
      })
    }

  } catch (error) {
    console.error('❌ Error updating hotels with Google data:', error.message)
  }
}

// Command line interface
const command = process.argv[2]

switch (command) {
  case 'fetch':
    if (!googleApiKey) {
      console.error('❌ GOOGLE_PLACES_API_KEY not found in environment variables')
      process.exit(1)
    }
    updateHotelWithGoogleData()
    break
  default:
    console.log('Usage:')
    console.log('  node scripts/get-google-data.js fetch')
    console.log('')
    console.log('Note: This will make Google Places API calls and may incur costs.')
    console.log('Ensure GOOGLE_PLACES_API_KEY is set in your .env.local file.')
}