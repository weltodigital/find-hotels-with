import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scotland Hotels with Tennis Courts | 5 Luxury Properties | Highland Tennis Excellence',
  description: 'Discover 5 luxury hotels with tennis courts across Scotland. From Gleneagles championship facilities to Highland castle estates. World-class tennis with breathtaking Scottish landscapes.',
  keywords: 'Scotland hotels tennis courts, Gleneagles tennis, Highland tennis hotels, Scottish castle tennis, luxury tennis Scotland, Perth tennis resorts, Scottish tennis holidays, championship tennis Scotland',
  openGraph: {
    title: 'Scotland Hotels with Tennis Courts | 5 Luxury Properties | Highland Tennis Excellence',
    description: 'Discover 5 luxury hotels with tennis courts across Scotland. From Gleneagles championship facilities to Highland castle estates. World-class tennis with breathtaking Scottish landscapes.',
    url: 'https://findhotelswith.com/tennis-courts/scotland',
    type: 'website',
    images: [
      {
        url: '/images/scotland-tennis-hotels.jpg',
        width: 1200,
        height: 630,
        alt: 'Tennis court at Scottish Highland castle hotel with mountain views'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scotland Hotels with Tennis Courts | 5 Luxury Properties',
    description: 'Discover 5 luxury hotels with tennis courts across Scotland. Championship facilities with Highland views.',
  },
  alternates: {
    canonical: 'https://findhotelswith.com/tennis-courts/scotland',
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

export default function ScotlandTennisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}