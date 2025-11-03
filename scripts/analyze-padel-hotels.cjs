const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
  // Get a sample tennis hotel to see structure
  const { data: tennisHotels } = await supabase
    .from('hotels')
    .select('*')
    .ilike('description', '%tennis%')
    .limit(1);

  console.log('=== TENNIS HOTEL STRUCTURE ===');
  if (tennisHotels && tennisHotels[0]) {
    console.log('Available fields:', Object.keys(tennisHotels[0]));
  }

  // Get all padel hotels to check for duplicates and missing data
  const { data: padelHotels } = await supabase
    .from('hotels')
    .select('*')
    .ilike('description', '%padel%');

  console.log('\n=== PADEL HOTELS ANALYSIS ===');
  console.log('Total padel hotels:', padelHotels?.length || 0);

  if (padelHotels) {
    // Check for duplicates by name
    const nameCount = {};
    padelHotels.forEach(hotel => {
      nameCount[hotel.name] = (nameCount[hotel.name] || 0) + 1;
    });

    const duplicates = Object.entries(nameCount).filter(([name, count]) => count > 1);
    console.log('Duplicate hotel names:', duplicates);

    // Show all hotel names for review
    console.log('\nAll padel hotel names:');
    padelHotels.forEach((hotel, index) => {
      console.log(`${index + 1}. ${hotel.name} - ${hotel.city}, ${hotel.county}`);
    });

    // Check missing data
    console.log('\nMissing data summary:');
    let missingGoogle = 0;
    let missingRooms = 0;
    let missingStars = 0;
    let missingAddress = 0;
    let missingPhone = 0;
    let missingPostcode = 0;

    padelHotels.forEach(hotel => {
      if (!hotel.google_rating) missingGoogle++;
      if (!hotel.total_rooms) missingRooms++;
      if (!hotel.star_rating) missingStars++;
      if (!hotel.address) missingAddress++;
      if (!hotel.phone) missingPhone++;
      if (!hotel.postcode) missingPostcode++;
    });

    console.log(`Google ratings missing: ${missingGoogle}/${padelHotels.length}`);
    console.log(`Room counts missing: ${missingRooms}/${padelHotels.length}`);
    console.log(`Star ratings missing: ${missingStars}/${padelHotels.length}`);
    console.log(`Addresses missing: ${missingAddress}/${padelHotels.length}`);
    console.log(`Phone numbers missing: ${missingPhone}/${padelHotels.length}`);
    console.log(`Postcodes missing: ${missingPostcode}/${padelHotels.length}`);
  }
}

checkData().catch(console.error);