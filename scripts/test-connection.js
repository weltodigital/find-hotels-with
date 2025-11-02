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
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    console.log('📍 URL:', supabaseUrl)

    // Test basic connection by listing tables
    const { data, error } = await supabase
      .rpc('version') // This is a built-in PostgreSQL function

    if (error) {
      console.log('⚠️  RPC test failed, but this is expected if you haven\'t set up the schema yet')
      console.log('Error:', error.message)
    } else {
      console.log('✅ Supabase connection successful!')
    }

    // Try to access the hotels table
    const { data: hotelData, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .limit(1)

    if (hotelError) {
      if (hotelError.message.includes('relation "public.hotels" does not exist')) {
        console.log('\n📋 Next step: Create the database schema')
        console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
        console.log('2. Select your project')
        console.log('3. Go to SQL Editor')
        console.log('4. Copy and paste the contents of database/schema.sql')
        console.log('5. Run the SQL script')
        console.log('6. Come back and run this test again')
      } else {
        console.log('❌ Unexpected database error:', hotelError.message)
      }
    } else {
      console.log('✅ Hotels table exists!')
      console.log(`📊 Found ${hotelData?.length || 0} hotels in the database`)
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testConnection()