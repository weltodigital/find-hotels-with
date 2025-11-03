import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Your Google Places API key
const GOOGLE_API_KEY = 'AIzaSyDyVJfmuPMCAcPjE6S5zd7GXdOJIyKdrS4'

// Delay between API calls to avoid rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function searchGooglePlace(hotelName, city) {
  try {
    const query = `${hotelName} hotel ${city} UK`
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&fields=place_id,name,rating,user_ratings_total,photos,formatted_address,geometry`

    console.log(`🔍 Searching: ${query}`)

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.log(`❌ No results for ${hotelName}`)
      return null
    }

    const place = data.results[0]
    return {
      place_id: place.place_id,
      name: place.name,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      photo_reference: place.photos?.[0]?.photo_reference || null,
      formatted_address: place.formatted_address,
      latitude: place.geometry?.location?.lat || null,
      longitude: place.geometry?.location?.lng || null
    }

  } catch (error) {
    console.log(`❌ Error searching ${hotelName}:`, error.message)
    return null
  }
}

async function getPhotoUrl(photoReference) {
  if (!photoReference) return null

  // Get high quality photo (maxwidth=800 for good quality but not huge file)
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`
}

async function updateHotelWithGoogleData(hotel) {
  try {
    console.log(`\n🏨 Processing: ${hotel.name} (${hotel.city})`)

    // Search for the place
    const googleData = await searchGooglePlace(hotel.name, hotel.city)

    if (!googleData) {
      console.log(`⚠️  No Google data found for ${hotel.name}`)
      return false
    }

    // Get photo URL if available
    const photoUrl = googleData.photo_reference
      ? await getPhotoUrl(googleData.photo_reference)
      : null

    // Parse address components
    let addressParts = null
    let postcode = null
    if (googleData.formatted_address) {
      const addressMatch = googleData.formatted_address.match(/^(.*?),\s*([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}),?\s*UK$/i)
      if (addressMatch) {
        addressParts = addressMatch[1] // Everything before postcode
        postcode = addressMatch[2] // Postcode
      }
    }

    // Update the hotel in database
    const updateData = {
      google_rating: googleData.rating,
      google_reviews_count: googleData.user_ratings_total,
      google_place_id: googleData.place_id
    }

    // Update address if we have better data
    if (googleData.formatted_address) {
      updateData.address = addressParts || googleData.formatted_address
    }
    if (postcode) {
      updateData.postcode = postcode
    }
    if (googleData.latitude && googleData.longitude) {
      updateData.latitude = googleData.latitude
      updateData.longitude = googleData.longitude
    }

    // Only update photo if we found one and hotel doesn't have image_url
    if (photoUrl && !hotel.image_url) {
      updateData.google_photo_url = photoUrl
      updateData.image_url = photoUrl
    } else if (photoUrl) {
      updateData.google_photo_url = photoUrl
    }

    const { error } = await supabase
      .from('hotels')
      .update(updateData)
      .eq('id', hotel.id)

    if (error) {
      console.log(`❌ Error updating ${hotel.name}:`, error.message)
      return false
    }

    console.log(`✅ Updated ${hotel.name}:`)
    console.log(`   📊 Rating: ${googleData.rating}/5 (${googleData.user_ratings_total} reviews)`)
    console.log(`   📍 Address: ${addressParts || googleData.formatted_address || 'Not found'}`)
    console.log(`   📮 Postcode: ${postcode || 'Not found'}`)
    console.log(`   🗺️  Coordinates: ${googleData.latitude ? `${googleData.latitude}, ${googleData.longitude}` : 'Not found'}`)
    console.log(`   🆔 Place ID: ${googleData.place_id}`)
    console.log(`   📸 Photo: ${photoUrl ? 'Yes' : 'No'}`)

    return true

  } catch (error) {
    console.log(`❌ Error processing ${hotel.name}:`, error.message)
    return false
  }
}

async function fetchGoogleDataForAllHotels() {
  try {
    console.log('🚀 Starting Google Places API data fetch...')
    console.log('💰 Cost-saving measures:')
    console.log('  - 1 second delay between requests')
    console.log('  - Only Text Search API calls (cheaper than Details API)')
    console.log('  - Batch processing to avoid timeouts')
    console.log('  - Only updating hotels without existing Google data')

    // Get hotels that need Google data (prioritize those without google_place_id)
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select('id, name, city, image_url, google_place_id, google_rating, address, postcode')
      .is('google_place_id', null) // Only hotels without Google data
      .order('name')

    if (error) throw error

    console.log(`\n📊 Found ${hotels.length} hotels needing Google data`)
    console.log('💡 Estimated cost: ~$0.017 per hotel (Text Search API)')
    console.log(`💰 Total estimated cost: ~$${(hotels.length * 0.017).toFixed(2)}`)

    const readline = await import('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const answer = await new Promise(resolve => {
      rl.question('\n❓ Continue with API calls? (y/n): ', resolve)
    })
    rl.close()

    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Cancelled by user')
      return
    }

    console.log('\n🔄 Starting data fetch...')

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i]

      console.log(`\n[${i + 1}/${hotels.length}] Processing hotels...`)

      const success = await updateHotelWithGoogleData(hotel)

      if (success) {
        successCount++
      } else {
        failCount++
      }

      // Add delay to avoid rate limits and reduce costs
      if (i < hotels.length - 1) {
        console.log('⏳ Waiting 1 second...')
        await delay(1000)
      }
    }

    console.log('\n📊 Summary:')
    console.log(`✅ Successfully updated: ${successCount} hotels`)
    console.log(`❌ Failed: ${failCount} hotels`)
    console.log(`💰 Estimated cost: ~$${(successCount * 0.017).toFixed(2)}`)

  } catch (error) {
    console.error('❌ Script error:', error.message)
  }
}

// Command line options
const command = process.argv[2]

switch (command) {
  case 'all':
    fetchGoogleDataForAllHotels()
    break
  case 'test':
    // Test with just one hotel
    console.log('🧪 Testing with one hotel...')
    supabase
      .from('hotels')
      .select('id, name, city, image_url')
      .limit(1)
      .then(({ data }) => {
        if (data && data[0]) {
          updateHotelWithGoogleData(data[0])
        }
      })
    break
  default:
    console.log('Usage:')
    console.log('  node scripts/fetch-google-data.js test    # Test with one hotel')
    console.log('  node scripts/fetch-google-data.js all     # Fetch data for all hotels')
    console.log('')
    console.log('💰 Cost Information:')
    console.log('  - Text Search API: ~$0.017 per request')
    console.log('  - Photo API: Free (no additional cost)')
    console.log('  - 70 hotels = ~$1.19 total')
}