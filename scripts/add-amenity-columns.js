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

async function addAmenityColumns() {
  try {
    console.log('🔧 Adding amenity columns to hotels table...')

    // First, let's check the current table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('hotels')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('❌ Error checking table:', tableError.message)
      return
    }

    console.log('📋 Current table columns:', Object.keys(tableInfo[0] || {}))

    // Check if columns already exist
    const sampleHotel = tableInfo[0]
    const hasAmenities = sampleHotel && 'amenities' in sampleHotel
    const hasSpecialFeatures = sampleHotel && 'special_features' in sampleHotel

    console.log(`🔍 Has amenities column: ${hasAmenities}`)
    console.log(`🔍 Has special_features column: ${hasSpecialFeatures}`)

    if (!hasAmenities || !hasSpecialFeatures) {
      console.log('⚠️  Missing columns detected. You need to add them in Supabase Dashboard:')
      console.log('')
      console.log('📝 SQL to run in Supabase SQL Editor:')
      console.log('')

      if (!hasAmenities) {
        console.log('-- Add amenities column')
        console.log('ALTER TABLE hotels ADD COLUMN amenities TEXT[] DEFAULT \'{}\';')
        console.log('')
      }

      if (!hasSpecialFeatures) {
        console.log('-- Add special_features column')
        console.log('ALTER TABLE hotels ADD COLUMN special_features TEXT[] DEFAULT \'{}\';')
        console.log('')
      }

      console.log('🔗 Instructions:')
      console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
      console.log('2. Select your project')
      console.log('3. Go to SQL Editor')
      console.log('4. Copy and paste the SQL above')
      console.log('5. Run the SQL')
      console.log('6. Come back and run the amenities update script')
    } else {
      console.log('✅ All required columns exist!')
    }

  } catch (error) {
    console.error('❌ Script error:', error.message)
  }
}

addAmenityColumns()