import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database schema...')

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')

    // Split SQL by statements (simple approach)
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          })

          if (error) {
            // Try direct query for simpler statements
            const { error: directError } = await supabase
              .from('_')
              .select('*')
              .limit(0)

            if (directError && !directError.message.includes('relation "_" does not exist')) {
              console.warn(`⚠️  Statement ${i + 1} warning:`, error.message)
            }
          }
        } catch (err) {
          console.warn(`⚠️  Statement ${i + 1} error:`, err.message)
        }
      }
    }

    // Test the setup by querying the hotels table
    const { data, error } = await supabase
      .from('hotels')
      .select('count(*)')
      .single()

    if (error) {
      console.error('❌ Database setup verification failed:', error.message)
      console.log('\n📋 Manual setup required:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Run the contents of database/schema.sql')
      return
    }

    console.log('✅ Database schema setup complete!')
    console.log(`📊 Hotels table ready with ${data.count || 0} records`)

    // Test insert/select functionality
    console.log('🧪 Testing database operations...')

    const testHotel = {
      name: 'Setup Test Hotel',
      description: 'Test hotel created during setup',
      location: 'Test Location',
      city: 'Test City',
      country: 'United Kingdom',
      price_range: '££',
      rating: 4,
      amenities: ['wifi', 'parking'],
      special_features: ['hot_tub_in_room']
    }

    const { data: insertData, error: insertError } = await supabase
      .from('hotels')
      .insert(testHotel)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message)
    } else {
      console.log('✅ Insert test successful')

      // Clean up test data
      await supabase
        .from('hotels')
        .delete()
        .eq('id', insertData.id)

      console.log('✅ Test data cleaned up')
    }

    console.log('\n🎉 Database is ready for your hotel directory!')
    console.log('🌐 Your app is running at: http://localhost:3001')

  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.log('\n📋 Manual setup required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the contents of database/schema.sql')
  }
}

setupDatabase()