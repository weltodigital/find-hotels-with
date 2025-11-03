const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateImages() {
  console.log('🖼️ Updating padel hotel images...');

  // Get all padel hotels with Google photos but no main image_url
  const { data: padelHotels } = await supabase
    .from('hotels')
    .select('id, name, google_photo_url, image_url')
    .ilike('description', '%padel%')
    .not('google_photo_url', 'is', null)
    .is('image_url', null);

  if (!padelHotels || padelHotels.length === 0) {
    console.log('✅ All padel hotels already have image URLs set');
    return;
  }

  console.log(`📊 Found ${padelHotels.length} hotels to update`);

  let updateCount = 0;

  for (const hotel of padelHotels) {
    console.log(`🏨 Updating ${hotel.name}...`);

    const { error } = await supabase
      .from('hotels')
      .update({ image_url: hotel.google_photo_url })
      .eq('id', hotel.id);

    if (error) {
      console.error(`❌ Error updating ${hotel.name}:`, error);
    } else {
      updateCount++;
      console.log(`✅ Updated ${hotel.name}`);
    }
  }

  console.log(`\n🎉 Image update completed!`);
  console.log(`📊 Updated ${updateCount}/${padelHotels.length} hotels`);

  // Verify the results
  const { data: finalCheck } = await supabase
    .from('hotels')
    .select('id')
    .ilike('description', '%padel%')
    .not('image_url', 'is', null);

  console.log(`📸 Total padel hotels with images: ${finalCheck?.length || 0}/27`);
}

async function main() {
  try {
    await updateImages();
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

main();