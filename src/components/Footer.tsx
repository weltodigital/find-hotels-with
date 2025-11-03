import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Find Hotels With</span>
                <span className="text-sm text-gray-400 -mt-1">Extraordinary Facilities</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Discover luxury hotels with extraordinary facilities like tennis courts and padel courts
              across the United Kingdom and beyond.
            </p>
            <p className="text-gray-300 mb-6">
              <span className="text-gray-400">Contact us:</span>{' '}
              <a href="mailto:findhotelswith@weltodigital.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                findhotelswith@weltodigital.com
              </a>
            </p>
          </div>

          {/* Court Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Find Hotels With Courts</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tennis-courts" className="text-gray-300 hover:text-white transition-colors">
                  🎾 Tennis Court Hotels
                </Link>
              </li>
              <li>
                <Link href="/padel-courts" className="text-gray-300 hover:text-white transition-colors">
                  🎾 Padel Court Hotels
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Find Hotels With. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>for luxury travel</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}