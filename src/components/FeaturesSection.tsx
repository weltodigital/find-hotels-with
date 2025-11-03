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
      title: "Tennis Courts",
      description: "Championship tennis facilities and professional courts for sports enthusiasts. Discover 76 luxury hotels across England, Scotland, and Wales featuring world-class tennis courts.",
      count: 76
    },
    {
      icon: "🎾",
      title: "Padel Courts",
      description: "Experience the fastest-growing racquet sport at luxury hotels featuring professional padel courts. Find exceptional hotels with glass-enclosed padel facilities across the UK.",
      count: 45
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Discover Extraordinary Hotel Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From professional sports facilities to luxury wellness experiences,
            find hotels that offer more than just accommodation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <a
              key={index}
              href={feature.title === "Tennis Courts" ? "/tennis-courts" : "/padel-courts"}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${feature.title === "Tennis Courts" ? "from-green-500 to-green-600" : "from-orange-500 to-orange-600"} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              <h3 className={`text-xl font-semibold text-gray-900 mb-3 group-hover:${feature.title === "Tennis Courts" ? "text-green-600" : "text-orange-600"} transition-colors`}>
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {feature.count && (
                <div className={`inline-flex items-center px-3 py-1 ${feature.title === "Tennis Courts" ? "bg-green-100 text-green-800 group-hover:bg-green-200" : "bg-orange-100 text-orange-800 group-hover:bg-orange-200"} rounded-full text-sm font-medium transition-colors`}>
                  {feature.count} Hotels Available
                </div>
              )}
            </a>
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