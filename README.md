# Find Hotels With Special Amenities

A modern web application for discovering unique hotels with extraordinary features like padel courts, in-room hot tubs, private pools, and more.

## Features

- 🏨 Browse hotels with special amenities
- 🔍 Advanced filtering by location, rating, and features
- 🎾 Find hotels with padel courts
- 🛁 Discover hotels with in-room hot tubs
- 🏊 Filter by pools, spas, tennis courts, and more
- 📱 Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/find-hotels-with.git
cd find-hotels-with
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses a `hotels` table with the following structure:

```sql
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  price_range TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  amenities TEXT[] DEFAULT '{}',
  special_features TEXT[] DEFAULT '{}',
  image_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Special Features

The application supports filtering by these special features:

- `padel_court` - Padel courts on property
- `hot_tub_in_room` - In-room hot tubs/jacuzzis
- `private_pool` - Private pools
- `tennis_court` - Tennis courts
- `spa` - Full-service spa
- `rooftop_terrace` - Rooftop terraces
- `wine_cellar` - Wine cellars
- `private_beach` - Private beach access
- `helicopter_pad` - Helicopter landing pad
- `golf_course` - Golf course on property

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
