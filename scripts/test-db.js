import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')

    // Test basic connection
    const { data, error } = await supabase
      .from('hotels')
      .select('count(*)')
      .single()

    if (error) {
      console.error('Database connection error:', error.message)
      return
    }

    console.log('✅ Successfully connected to Supabase!')
    console.log('Hotels in database:', data.count || 0)

    // Test inserting a sample hotel
    const { data: insertData, error: insertError } = await supabase
      .from('hotels')
      .insert({
        name: 'Test Hotel',
        description: 'A test hotel for development',
        location: 'Test Location',
        city: 'Test City',
        country: 'United Kingdom',
        price_range: '££',
        rating: 4,
        amenities: ['wifi', 'parking'],
        special_features: ['hot_tub_in_room']
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError.message)
    } else {
      console.log('✅ Successfully inserted test hotel:', insertData.name)

      // Clean up test data
      await supabase
        .from('hotels')
        .delete()
        .eq('id', insertData.id)

      console.log('✅ Test data cleaned up')
    }

  } catch (error) {
    console.error('Connection test failed:', error.message)
  }
}

testConnection()