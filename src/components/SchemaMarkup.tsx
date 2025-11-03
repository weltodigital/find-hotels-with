import { Hotel } from '@/types/hotel'

interface SchemaMarkupProps {
  type: 'website' | 'hotels'
  hotels?: Hotel[]
}

export default function SchemaMarkup({ type, hotels }: SchemaMarkupProps) {
  if (type === 'website') {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Find Hotels With",
      "description": "Discover unique hotels with extraordinary facilities like padel courts, hot tubs, private pools, tennis courts, spas, and more. Find your perfect luxury accommodation with special features.",
      "url": "https://findhotelswith.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://findhotelswith.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Find Hotels With",
        "description": "Curated collection of luxury hotels with unique facilities"
      }
    }

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Find Hotels With",
      "description": "Premium hotel directory specializing in accommodations with unique facilities and luxury features",
      "url": "https://findhotelswith.com",
      "logo": "https://findhotelswith.com/logo.png",
      "sameAs": [
        "https://twitter.com/findhotelswith",
        "https://facebook.com/findhotelswith"
      ]
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://findhotelswith.com"
        }
      ]
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      </>
    )
  }

  if (type === 'hotels' && hotels) {
    const hotelListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Luxury Hotels with Special Facilities",
      "description": "Curated collection of premium hotels featuring unique facilities",
      "numberOfItems": hotels.length,
      "itemListElement": hotels.slice(0, 10).map((hotel, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Hotel",
          "name": hotel.name,
          "description": hotel.description || `Luxury hotel in ${hotel.city}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": hotel.city,
            "addressCountry": hotel.country
          },
          "url": hotel.website_url,
          "priceRange": hotel.price_range,
          ...(hotel.rating && {
            "starRating": {
              "@type": "Rating",
              "ratingValue": hotel.rating,
              "bestRating": 5
            }
          }),
          ...(hotel.amenities && hotel.amenities.length > 0 && {
            "amenityFeature": hotel.amenities.map(amenity => ({
              "@type": "LocationFeatureSpecification",
              "name": amenity.replace('_', ' ')
            }))
          })
        }
      }))
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hotelListSchema)
        }}
      />
    )
  }

  return null
}