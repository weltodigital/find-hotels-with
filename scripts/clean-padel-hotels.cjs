const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function removeDuplicates() {
  console.log('🔍 Finding and removing duplicates...');

  // Get all padel hotels
  const { data: padelHotels } = await supabase
    .from('hotels')
    .select('*')
    .ilike('description', '%padel%');

  if (!padelHotels) {
    console.log('❌ No padel hotels found');
    return;
  }

  console.log(`📊 Found ${padelHotels.length} padel hotels`);

  // Find duplicates
  const duplicatesToRemove = [];

  // Handle Babington House duplicates - keep the first one
  const babingtonHouses = padelHotels.filter(hotel => hotel.name === 'Babington House');
  if (babingtonHouses.length > 1) {
    console.log('🔄 Found multiple Babington House entries, keeping the first one');
    for (let i = 1; i < babingtonHouses.length; i++) {
      duplicatesToRemove.push(babingtonHouses[i].id);
    }
  }

  // Handle Gleneagles duplicates - keep "The Gleneagles Hotel" (more official name)
  const gleneaglesHotels = padelHotels.filter(hotel =>
    hotel.name === 'Gleneagles' || hotel.name === 'The Gleneagles Hotel'
  );
  if (gleneaglesHotels.length > 1) {
    console.log('🔄 Found multiple Gleneagles entries, keeping "The Gleneagles Hotel"');
    const toKeep = gleneaglesHotels.find(hotel => hotel.name === 'The Gleneagles Hotel');
    const toRemove = gleneaglesHotels.filter(hotel => hotel.id !== toKeep.id);
    toRemove.forEach(hotel => duplicatesToRemove.push(hotel.id));
  }

  // Remove duplicates
  if (duplicatesToRemove.length > 0) {
    console.log(`🗑️ Removing ${duplicatesToRemove.length} duplicate hotels...`);

    for (const id of duplicatesToRemove) {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`❌ Error removing hotel ${id}:`, error);
      } else {
        console.log(`✅ Removed duplicate hotel ${id}`);
      }
    }
  } else {
    console.log('✅ No duplicates found to remove');
  }

  // Verify final count
  const { data: finalHotels } = await supabase
    .from('hotels')
    .select('id')
    .ilike('description', '%padel%');

  console.log(`📊 Final padel hotel count: ${finalHotels?.length || 0}`);
}

async function main() {
  try {
    await removeDuplicates();
    console.log('🎉 Duplicate removal completed!');
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

main();