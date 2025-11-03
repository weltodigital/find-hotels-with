import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'England Hotels with Tennis Courts | 67 Luxury Properties | Championship Facilities',
  description: 'Discover 67 luxury hotels with tennis courts across England. From Wimbledon-standard grass courts to historic country estates. Championship facilities in London, Cotswolds, Devon, Yorkshire & more.',
  keywords: 'England hotels tennis courts, luxury tennis hotels London, Wimbledon tennis hotels, country estate tennis, tennis holidays England, championship tennis courts England, grass court hotels, tennis resorts England',
  openGraph: {
    title: 'England Hotels with Tennis Courts | 67 Luxury Properties | Championship Facilities',
    description: 'Discover 67 luxury hotels with tennis courts across England. From Wimbledon-standard grass courts to historic country estates. Championship facilities in London, Cotswolds, Devon, Yorkshire & more.',
    url: 'https://findhotelswith.com/tennis-courts/england',
    type: 'website',
    images: [
      {
        url: '/images/england-tennis-hotels.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury tennis court at English country estate hotel'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'England Hotels with Tennis Courts | 67 Luxury Properties',
    description: 'Discover 67 luxury hotels with tennis courts across England. Championship facilities from London to Yorkshire.',
  },
  alternates: {
    canonical: 'https://findhotelswith.com/tennis-courts/england',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function EnglandTennisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}