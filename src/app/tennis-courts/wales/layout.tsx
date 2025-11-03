import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wales Hotels with Tennis Courts | 3 Luxury Properties | Celtic Manor & Championship Venues',
  description: 'Discover 3 luxury hotels with tennis courts across Wales. Featuring Celtic Manor Resort, mountain retreats, and coastal tennis venues. Championship facilities with stunning Welsh landscapes.',
  keywords: 'Wales hotels tennis courts, Celtic Manor tennis, Welsh tennis holidays, Newport tennis hotels, Gwynedd tennis resorts, Wales luxury tennis, championship tennis Wales, mountain tennis courts Wales',
  openGraph: {
    title: 'Wales Hotels with Tennis Courts | 3 Luxury Properties | Celtic Manor & Championship Venues',
    description: 'Discover 3 luxury hotels with tennis courts across Wales. Featuring Celtic Manor Resort, mountain retreats, and coastal tennis venues. Championship facilities with stunning Welsh landscapes.',
    url: 'https://findhotelswith.com/tennis-courts/wales',
    type: 'website',
    images: [
      {
        url: '/images/wales-tennis-hotels.jpg',
        width: 1200,
        height: 630,
        alt: 'Tennis court at Welsh mountain resort with valley views'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wales Hotels with Tennis Courts | 3 Luxury Properties',
    description: 'Discover 3 luxury hotels with tennis courts across Wales. Championship facilities with Welsh mountain and coastal views.',
  },
  alternates: {
    canonical: 'https://findhotelswith.com/tennis-courts/wales',
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

export default function WalesTennisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}