import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTennisHotels() {
  try {
    console.log('🎾 Checking hotels with tennis courts...')

    // Get all hotels
    const { data: allHotels, error: allError } = await supabase
      .from('hotels')
      .select('*')

    if (allError) {
      console.error('❌ Error fetching all hotels:', allError.message)
      return
    }

    console.log(`📊 Total hotels in database: ${allHotels.length}`)

    // Check hotels with tennis court amenities
    const hotelsWithTennis = allHotels.filter(hotel =>
      (hotel.amenities && hotel.amenities.includes('tennis_court')) ||
      (hotel.special_features && hotel.special_features.includes('tennis_court'))
    )

    console.log(`🎾 Hotels with tennis courts in amenities/special_features: ${hotelsWithTennis.length}`)

    if (hotelsWithTennis.length > 0) {
      console.log('\n🏆 Hotels with tennis courts:')
      hotelsWithTennis.forEach((hotel, index) => {
        console.log(`${index + 1}. ${hotel.name} (${hotel.city})`)
        if (hotel.amenities && hotel.amenities.includes('tennis_court')) {
          console.log('   - Has tennis_court in amenities')
        }
        if (hotel.special_features && hotel.special_features.includes('tennis_court')) {
          console.log('   - Has tennis_court in special_features')
        }
      })
    }

    // Check for hotels with tennis-related names/descriptions
    const tennisKeywords = ['tennis', 'court', 'racquet', 'racket']
    const potentialTennisHotels = allHotels.filter(hotel => {
      const searchText = `${hotel.name} ${hotel.description || ''}`.toLowerCase()
      return tennisKeywords.some(keyword => searchText.includes(keyword))
    })

    console.log(`\n🔍 Hotels with tennis-related keywords: ${potentialTennisHotels.length}`)

    if (potentialTennisHotels.length > 0) {
      console.log('\n📝 Potential tennis hotels based on name/description:')
      potentialTennisHotels.forEach((hotel, index) => {
        console.log(`${index + 1}. ${hotel.name} (${hotel.city})`)
        if (hotel.description) {
          console.log(`   Description: ${hotel.description.substring(0, 100)}...`)
        }
      })
    }

    // Sample some hotel data to see structure
    console.log('\n📋 Sample hotel data structure:')
    const sampleHotels = allHotels.slice(0, 3)
    sampleHotels.forEach((hotel, index) => {
      console.log(`\n${index + 1}. ${hotel.name}:`)
      console.log(`   City: ${hotel.city}`)
      console.log(`   Amenities: ${hotel.amenities ? JSON.stringify(hotel.amenities) : 'null'}`)
      console.log(`   Special Features: ${hotel.special_features ? JSON.stringify(hotel.special_features) : 'null'}`)
      console.log(`   Description: ${hotel.description ? hotel.description.substring(0, 80) + '...' : 'null'}`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkTennisHotels()