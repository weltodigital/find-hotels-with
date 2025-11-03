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

async function setupAmenityColumns() {
  try {
    console.log('🔧 Setting up amenity columns...')

    // Try to add the columns using SQL
    const addColumnsSQL = `
      DO $$
      BEGIN
        -- Add amenities column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name = 'hotels' AND column_name = 'amenities') THEN
          ALTER TABLE hotels ADD COLUMN amenities TEXT[] DEFAULT '{}';
        END IF;

        -- Add special_features column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name = 'hotels' AND column_name = 'special_features') THEN
          ALTER TABLE hotels ADD COLUMN special_features TEXT[] DEFAULT '{}';
        END IF;
      END $$;
    `

    // Execute the SQL using a raw query
    const { error: alterError } = await supabase.rpc('exec_sql', { sql: addColumnsSQL })

    if (alterError) {
      console.log('⚠️  Could not add columns automatically. Please add them manually:')
      console.log('')
      console.log('📝 Run this SQL in your Supabase Dashboard SQL Editor:')
      console.log('')
      console.log('ALTER TABLE hotels ADD COLUMN amenities TEXT[] DEFAULT \'{}\';')
      console.log('ALTER TABLE hotels ADD COLUMN special_features TEXT[] DEFAULT \'{}\';')
      console.log('')
      console.log('Then run: node scripts/update-hotel-amenities.js')
      return
    }

    console.log('✅ Columns added successfully!')

    // Verify the columns were added
    const { data: testData, error: testError } = await supabase
      .from('hotels')
      .select('id, name, amenities, special_features')
      .limit(1)

    if (testError) {
      console.error('❌ Error verifying columns:', testError.message)
    } else {
      console.log('✅ Columns verified successfully!')
      console.log('🚀 Ready to run: node scripts/update-hotel-amenities.js')
    }

  } catch (error) {
    console.error('❌ Script error:', error.message)
    console.log('')
    console.log('📝 Please manually add these columns in Supabase Dashboard:')
    console.log('ALTER TABLE hotels ADD COLUMN amenities TEXT[] DEFAULT \'{}\';')
    console.log('ALTER TABLE hotels ADD COLUMN special_features TEXT[] DEFAULT \'{}\';')
  }
}

setupAmenityColumns()