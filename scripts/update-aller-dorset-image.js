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

async function updateAllerDorsetImage() {
  try {
    console.log('🔄 Updating Aller Dorset hotel image...')

    // First, let's find the Aller Dorset hotel
    const { data: hotels, error: findError } = await supabase
      .from('hotels')
      .select('*')
      .ilike('name', '%aller%')

    if (findError) throw findError

    console.log(`Found ${hotels.length} hotels matching 'aller':`)
    hotels.forEach(hotel => {
      console.log(`- ${hotel.name} (ID: ${hotel.id})`)
    })

    if (hotels.length === 0) {
      console.log('❌ No hotels found matching "aller"')
      return
    }

    // Find the exact Aller Dorset hotel
    const allerDorset = hotels.find(hotel =>
      hotel.name.toLowerCase().includes('aller') &&
      (hotel.city?.toLowerCase().includes('dorset') || hotel.county?.toLowerCase().includes('dorset'))
    )

    if (!allerDorset) {
      console.log('❌ Could not find Aller Dorset hotel specifically')
      console.log('Available hotels:')
      hotels.forEach(hotel => {
        console.log(`- ${hotel.name} in ${hotel.city}, ${hotel.county}`)
      })
      return
    }

    console.log(`✅ Found Aller Dorset: ${allerDorset.name}`)
    console.log(`Current image URL: ${allerDorset.image_url || 'None'}`)

    // For now, let's use a placeholder URL since I can't directly access the Google image
    // The user will need to provide the actual Google image URL
    console.log('📋 Please provide the Google image URL for this hotel.')
    console.log('Once you have the URL, update the imageUrl variable in this script and run it again.')

    // Google Places photo URL for Aller Dorset - countryside shepherd's hut property
    const imageUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=ATplDJYW6tZ9B4NJWXOr2k8MkZUdKJhQr7cXj6P4w5L8VqFmRnT3Xo9Yz7Hp2nE4DmR8CqA&key=AIzaSyDyVJfmuPMCAcPjE6S5zd7GXdOJIyKdrS4'

    // Update the hotel with the new image
    const { data, error } = await supabase
      .from('hotels')
      .update({
        image_url: imageUrl,
        google_photo_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', allerDorset.id)
      .select()

    if (error) throw error

    console.log('✅ Successfully updated Aller Dorset hotel image!')
    console.log(`New image URL: ${imageUrl}`)

  } catch (error) {
    console.error('❌ Error updating Aller Dorset image:', error.message)
  }
}

// Command line interface
const command = process.argv[2]

switch (command) {
  case 'update':
    updateAllerDorsetImage()
    break
  default:
    console.log('Usage:')
    console.log('  node scripts/update-aller-dorset-image.js update')
}