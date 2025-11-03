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

const hotelUpdates = [
  {
    name: 'Morton of Pitmilly',
    address: 'Kingsbarns, St Andrews',
    postcode: 'KY16 8QF',
    phone: '01334 880466',
    email: 'stay@pitmilly.co.uk',
    website: 'https://www.pitmilly.co.uk',
    latitude: 56.305285,
    longitude: -2.675194
  },
  {
    name: 'Hoar Cross Hall Spa Hotel',
    address: 'Maker Lane, Hoar Cross',
    postcode: 'DE13 8QS',
    phone: '01283 477900',
    email: 'info@hoarcross.co.uk',
    website: 'https://baronseden.com/hoar-cross-hall'
  },
  {
    name: 'Champneys Henlow Grange',
    address: 'The Grange, Henlow',
    postcode: 'SG16 6DB',
    phone: '0343 316 2222',
    website: 'https://www.champneys.com/spa-resorts/henlow.html'
  },
  {
    name: 'Trefeddian Hotel',
    address: 'Tywyn Road, Aberdyfi',
    postcode: 'LL35 0SB',
    phone: '01654 767 213'
  },
  {
    name: 'Headland Hotel',
    address: 'Fistral Beach, Headland Road',
    postcode: 'TR7 1EW',
    phone: '01637 872211',
    email: 'reception@headlandhotel.co.uk',
    website: 'https://www.headlandhotel.co.uk'
  },
  {
    name: 'Manor & Ashbury Resorts',
    address: 'Fowley Cross, Okehampton',
    postcode: 'EX20 4NA',
    phone: '01837 53053',
    email: 'marketing@manorashbury.co.uk',
    website: 'https://www.manorandashburyresorts.co.uk'
  }
]

async function updateHotelDetails() {
  try {
    console.log('🔄 Updating hotel contact details...')

    for (const hotelData of hotelUpdates) {
      const { name, ...updateData } = hotelData

      // Update the hotel
      const { data, error } = await supabase
        .from('hotels')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('name', name)
        .select()

      if (error) {
        console.log(`❌ Error updating ${name}:`, error.message)
        continue
      }

      if (data.length === 0) {
        console.log(`⚠️  Hotel "${name}" not found in database`)
        continue
      }

      console.log(`✅ Updated ${name} with contact details`)
    }

    console.log('\n📞 Successfully updated hotel contact information!')

  } catch (error) {
    console.error('❌ Error updating hotel details:', error.message)
  }
}

// Command line interface
const command = process.argv[2]

switch (command) {
  case 'update':
    updateHotelDetails()
    break
  default:
    console.log('Usage:')
    console.log('  node scripts/update-hotel-details.js update')
}