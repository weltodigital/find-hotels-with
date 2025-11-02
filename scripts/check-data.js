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

async function checkData() {
  try {
    console.log('📊 Checking database contents...')

    const { data: hotels, error } = await supabase
      .from('hotels')
      .select('*')

    if (error) {
      console.error('❌ Error fetching hotels:', error.message)
      return
    }

    console.log(`✅ Found ${hotels.length} hotels in the database:`)

    hotels.forEach((hotel, index) => {
      console.log(`\n${index + 1}. ${hotel.name}`)
      console.log(`   📍 Location: ${hotel.location}, ${hotel.city}`)
      console.log(`   ⭐ Rating: ${hotel.rating}/5`)
      console.log(`   💰 Price: ${hotel.price_range}`)
      console.log(`   🎯 Special Features: ${hotel.special_features?.join(', ') || 'None'}`)
      console.log(`   🏨 Amenities: ${hotel.amenities?.join(', ') || 'None'}`)
    })

    console.log('\n🎉 Your database is ready!')
    console.log('🌐 Visit http://localhost:3001 to see the application')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkData()