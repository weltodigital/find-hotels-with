interface Feature {
  icon: string
  title: string
  description: string
  count?: number
}

interface FeaturesSectionProps {
  hotelCount: number
}

export default function FeaturesSection({ hotelCount }: FeaturesSectionProps) {
  const features: Feature[] = [
    {
      icon: "🎾",
      title: "Padel Courts",
      description: "Find hotels with professional padel courts for the ultimate racquet sports experience.",
      count: Math.floor(hotelCount * 0.15) // Estimated
    },
    {
      icon: "🛁",
      title: "In-Room Hot Tubs",
      description: "Luxury suites featuring private hot tubs and jacuzzis for ultimate relaxation.",
      count: Math.floor(hotelCount * 0.25)
    },
    {
      icon: "🏊",
      title: "Private Pools",
      description: "Exclusive accommodations with private swimming pools and water features.",
      count: Math.floor(hotelCount * 0.20)
    },
    {
      icon: "🎾",
      title: "Tennis Courts",
      description: "Championship tennis facilities and professional courts for sports enthusiasts.",
      count: Math.floor(hotelCount * 0.30)
    },
    {
      icon: "💆",
      title: "World-Class Spas",
      description: "Rejuvenating spa treatments and wellness centers for mind and body restoration.",
      count: Math.floor(hotelCount * 0.60)
    },
    {
      icon: "🍷",
      title: "Wine Cellars",
      description: "Curated wine collections and exclusive cellar experiences for connoisseurs.",
      count: Math.floor(hotelCount * 0.10)
    },
    {
      icon: "⛳",
      title: "Golf Courses",
      description: "Championship golf courses and putting greens on hotel grounds.",
      count: Math.floor(hotelCount * 0.25)
    },
    {
      icon: "🏖️",
      title: "Private Beaches",
      description: "Exclusive beach access and pristine coastline for ultimate privacy.",
      count: Math.floor(hotelCount * 0.12)
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Discover Extraordinary Hotel Amenities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From professional sports facilities to luxury wellness experiences,
            find hotels that offer more than just accommodation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg">
                <span className="text-3xl">{feature.icon}</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {feature.count && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {feature.count}+ Hotels Available
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Find Hotels With?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex items-center justify-center flex-col">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-xl">✓</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Curated Selection</h4>
                <p className="text-gray-600 text-sm">Hand-picked hotels with verified unique amenities</p>
              </div>

              <div className="flex items-center justify-center flex-col">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Instant Search</h4>
                <p className="text-gray-600 text-sm">Find exactly what you're looking for in seconds</p>
              </div>

              <div className="flex items-center justify-center flex-col">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-xl">★</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
                <p className="text-gray-600 text-sm">Only the finest hotels with exceptional standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}