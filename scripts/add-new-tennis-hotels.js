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

const newHotels = [
  {
    name: 'Morton of Pitmilly',
    city: 'St Andrews',
    county: 'Fife',
    country: 'United Kingdom',
    description: 'A luxury resort located on a 150-acre farm near St Andrews, featuring both indoor and outdoor tennis courts. The property offers LTA qualified tennis lessons and additional facilities including heated pool, sauna, spa, and gym. Set in the historic town famous for golf and the university.',
    price_range: '£££',
    star_rating: 4,
    google_rating: 4.5,
    google_reviews_count: 287
  },
  {
    name: 'Hoar Cross Hall Spa Hotel',
    city: 'Burton on Trent',
    county: 'Staffordshire',
    country: 'United Kingdom',
    description: 'Set amid 50 acres of beautiful countryside, this spa hotel offers outdoor tennis courts along with a saltwater vitality pool and thermal suite. A peaceful retreat combining wellness facilities with recreational activities including tennis for active guests.',
    price_range: '£££',
    star_rating: 4,
    google_rating: 4.3,
    google_reviews_count: 1542
  },
  {
    name: 'Champneys Henlow Grange',
    city: 'Henlow',
    county: 'Bedfordshire',
    country: 'United Kingdom',
    description: 'A Georgian manor converted into a luxury health spa hotel set in 150 acres of parkland. Features tennis facilities alongside comprehensive spa treatments and wellness programs. Perfect for those seeking active recreation combined with relaxation and rejuvenation.',
    price_range: '£££',
    star_rating: 4,
    google_rating: 4.4,
    google_reviews_count: 2156
  },
  {
    name: 'Trefeddian Hotel',
    city: 'Aberdyfi',
    county: 'Gwynedd',
    country: 'United Kingdom',
    description: 'Overlooking the stunning Cardigan Bay, this family-friendly hotel offers tennis courts with spectacular sea views. Features games room, library, and indoor pool, making it perfect for family holidays with activities for all ages including tennis on courts with breathtaking coastal backdrops.',
    price_range: '££',
    star_rating: 3,
    google_rating: 4.2,
    google_reviews_count: 876
  },
  {
    name: 'Headland Hotel',
    city: 'Newquay',
    county: 'Cornwall',
    country: 'United Kingdom',
    description: 'Features possibly the most jaw-dropping tennis court in Britain, perching atop a classic Cornish beach with 360-degree panoramic ocean views. This clifftop location offers an unparalleled tennis experience with dramatic coastal scenery as your backdrop.',
    price_range: '£££',
    star_rating: 4,
    google_rating: 4.3,
    google_reviews_count: 3245
  },
  {
    name: 'Manor & Ashbury Resorts',
    city: 'Okehampton',
    county: 'Devon',
    country: 'United Kingdom',
    description: 'A comprehensive resort featuring 6 indoor and 5 outdoor tennis courts with breathtaking views of Dartmoor. Daily tennis competitions are available for guests. Also operates as a golf resort, offering multiple recreational activities in the stunning Devon countryside.',
    price_range: '£££',
    star_rating: 4,
    google_rating: 4.4,
    google_reviews_count: 1987
  }
]

// Function to generate slug from hotel name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function addNewHotels() {
  try {
    console.log('🏨 Adding 6 new hotels with tennis courts...')

    for (const hotel of newHotels) {
      // Check if hotel already exists
      const { data: existing, error: checkError } = await supabase
        .from('hotels')
        .select('name')
        .eq('name', hotel.name)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError
      }

      if (existing) {
        console.log(`⚠️  Hotel "${hotel.name}" already exists, skipping...`)
        continue
      }

      // Add the hotel with generated slug
      const { data, error } = await supabase
        .from('hotels')
        .insert({
          ...hotel,
          slug: generateSlug(hotel.name),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error

      console.log(`✅ Added ${hotel.name} in ${hotel.city}, ${hotel.county}`)
    }

    console.log('\n🎾 Successfully added new tennis court hotels!')

    // Show updated count
    const { data: allHotels, error: countError } = await supabase
      .from('hotels')
      .select('id')

    if (countError) throw countError

    console.log(`📊 Total hotels in database: ${allHotels.length}`)

  } catch (error) {
    console.error('❌ Error adding hotels:', error.message)
  }
}

// Command line interface
const command = process.argv[2]

switch (command) {
  case 'add':
    addNewHotels()
    break
  default:
    console.log('Usage:')
    console.log('  node scripts/add-new-tennis-hotels.js add')
}