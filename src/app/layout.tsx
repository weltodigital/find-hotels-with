import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://findhotelswith.com'),
  title: "Find Hotels With Extraordinary Facilities | Luxury Hotels with Unique Features",
  description: "Discover luxury hotels with extraordinary facilities like padel courts, in-room hot tubs, private pools, tennis courts, spas, and exclusive amenities. Find your perfect accommodation with unique features.",
  keywords: "luxury hotels, unique facilities, padel courts hotels, hot tub hotels, private pool hotels, tennis court hotels, spa hotels, exclusive hotels, premium accommodations",
  authors: [{ name: "Find Hotels With" }],
  creator: "Find Hotels With",
  publisher: "Find Hotels With",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://findhotelswith.com',
    siteName: 'Find Hotels With',
    title: 'Find Hotels With Extraordinary Facilities',
    description: 'Discover luxury hotels with extraordinary facilities like padel courts, in-room hot tubs, private pools, tennis courts, spas, and exclusive amenities.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Find Hotels With - Luxury Hotels with Unique Facilities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Hotels With Extraordinary Facilities',
    description: 'Discover luxury hotels with extraordinary facilities like padel courts, in-room hot tubs, private pools, and more.',
    images: ['/og-image.jpg'],
    creator: '@findhotelswith',
  },
  alternates: {
    canonical: 'https://findhotelswith.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
