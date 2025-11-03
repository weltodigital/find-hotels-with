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

// Define amenities and special features with their keywords
const AMENITY_KEYWORDS = {
  'wifi': ['wifi', 'wi-fi', 'wireless', 'internet'],
  'parking': ['parking', 'car park', 'valet parking'],
  'pool': ['swimming pool', 'outdoor pool', 'indoor pool', 'pool'],
  'gym': ['gym', 'fitness', 'exercise', 'workout'],
  'restaurant': ['restaurant', 'dining', 'bistro', 'brasserie'],
  'bar': ['bar', 'lounge', 'cocktail', 'pub'],
  'room_service': ['room service', 'in-room dining'],
  'concierge': ['concierge', 'butler', 'personal service'],
  'business_center': ['business center', 'conference', 'meeting room'],
  'pet_friendly': ['pet friendly', 'dog friendly', 'pets welcome']
}

const SPECIAL_FEATURE_KEYWORDS = {
  'tennis_court': ['tennis court', 'tennis', 'racquet', 'racket', 'lawn tennis'],
  'padel_court': ['padel court', 'padel', 'paddle tennis'],
  'hot_tub_in_room': ['hot tub', 'jacuzzi', 'in-room hot tub', 'private hot tub'],
  'private_pool': ['private pool', 'plunge pool', 'pool in room'],
  'spa': ['spa', 'wellness', 'treatment', 'massage', 'sauna'],
  'rooftop_terrace': ['rooftop', 'roof terrace', 'terrace', 'roof garden'],
  'wine_cellar': ['wine cellar', 'wine', 'cellar', 'vineyard'],
  'private_beach': ['private beach', 'beach access', 'beachfront'],
  'helicopter_pad': ['helicopter', 'helipad', 'heli'],
  'golf_course': ['golf course', 'golf', 'championship golf', 'putting green']
}

function extractFeatures(description, keywords) {
  if (!description) return []

  const lowerDesc = description.toLowerCase()
  const features = []

  for (const [feature, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(keyword => lowerDesc.includes(keyword))) {
      features.push(feature)
    }
  }

  return features
}

async function updateHotelAmenities() {
  try {
    console.log('🔄 Starting hotel amenities update...')

    // Get all hotels
    const { data: hotels, error: fetchError } = await supabase
      .from('hotels')
      .select('*')

    if (fetchError) {
      console.error('❌ Error fetching hotels:', fetchError.message)
      return
    }

    console.log(`📊 Processing ${hotels.length} hotels...`)

    let updatedCount = 0
    let tennisCount = 0
    let padelCount = 0
    let hotTubCount = 0
    let spaCount = 0

    for (const hotel of hotels) {
      const amenities = extractFeatures(hotel.description, AMENITY_KEYWORDS)
      const specialFeatures = extractFeatures(hotel.description, SPECIAL_FEATURE_KEYWORDS)

      // Count specific features for reporting
      if (specialFeatures.includes('tennis_court')) tennisCount++
      if (specialFeatures.includes('padel_court')) padelCount++
      if (specialFeatures.includes('hot_tub_in_room')) hotTubCount++
      if (specialFeatures.includes('spa')) spaCount++

      // Update hotel if we found any amenities or features
      if (amenities.length > 0 || specialFeatures.length > 0) {
        const { error: updateError } = await supabase
          .from('hotels')
          .update({
            amenities: amenities,
            special_features: specialFeatures
          })
          .eq('id', hotel.id)

        if (updateError) {
          console.error(`❌ Error updating ${hotel.name}:`, updateError.message)
        } else {
          updatedCount++
          console.log(`✅ Updated ${hotel.name}: ${amenities.length} amenities, ${specialFeatures.length} special features`)
        }
      }
    }

    console.log('\n🎉 Update Complete!')
    console.log(`📈 Updated ${updatedCount} hotels`)
    console.log(`🎾 Tennis courts: ${tennisCount} hotels`)
    console.log(`🏓 Padel courts: ${padelCount} hotels`)
    console.log(`🛁 Hot tubs: ${hotTubCount} hotels`)
    console.log(`💆 Spas: ${spaCount} hotels`)

    // Verify the updates
    console.log('\n🔍 Verifying updates...')
    const { data: updatedHotels, error: verifyError } = await supabase
      .from('hotels')
      .select('name, city, amenities, special_features')
      .not('amenities', 'is', null)
      .limit(5)

    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError.message)
    } else {
      console.log('\n📋 Sample updated hotels:')
      updatedHotels.forEach((hotel, index) => {
        console.log(`${index + 1}. ${hotel.name} (${hotel.city})`)
        console.log(`   Amenities: ${hotel.amenities?.join(', ') || 'none'}`)
        console.log(`   Special Features: ${hotel.special_features?.join(', ') || 'none'}`)
      })
    }

  } catch (error) {
    console.error('❌ Script error:', error.message)
  }
}

updateHotelAmenities()