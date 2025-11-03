import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UK Hotels with Tennis Courts | 76 Luxury Properties | Championship Facilities',
  description: 'Discover 76 luxury UK hotels with professional tennis courts. From Wimbledon-standard facilities to clifftop courts in Cornwall. Book championship tennis holidays across England, Scotland & Wales.',
  keywords: 'UK hotels tennis courts, luxury tennis hotels England, tennis holidays Scotland Wales, championship tennis facilities, tennis resorts Britain, hotels with tennis courts UK',
  openGraph: {
    title: 'UK Hotels with Tennis Courts | 76 Luxury Properties | Championship Facilities',
    description: 'Discover 76 luxury UK hotels with professional tennis courts. From Wimbledon-standard facilities to clifftop courts in Cornwall. Book championship tennis holidays across England, Scotland & Wales.',
    url: 'https://findhotelswith.com/tennis-courts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Hotels with Tennis Courts | 76 Luxury Properties',
    description: 'Discover 76 luxury UK hotels with professional tennis courts. Championship facilities across England, Scotland & Wales.',
  },
  alternates: {
    canonical: 'https://findhotelswith.com/tennis-courts',
  },
}

export default function TennisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}