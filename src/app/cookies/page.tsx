import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function CookiePolicy() {
  return (
    <>
      <Header />
      <Breadcrumbs />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-700 mb-6">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">Find Hotels With uses cookies for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>To remember your search preferences and settings</li>
                <li>To analyze website traffic and user behavior</li>
                <li>To improve our website functionality and user experience</li>
                <li>To provide relevant content and advertisements</li>
                <li>To ensure website security and prevent fraud</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as page navigation and access to secure areas of the website.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Analytics Cookies</h3>
              <p className="text-gray-700 mb-4">
                We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Functional Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies allow the website to remember choices you make and provide enhanced, personalized features.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Advertising Cookies</h3>
              <p className="text-gray-700 mb-6">
                These cookies may be used to show you relevant advertisements based on your interests and browsing behavior.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">We may use third-party services that place cookies on your device, including:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Google Analytics:</strong> For website traffic analysis</li>
                <li><strong>Google Maps:</strong> For displaying hotel locations</li>
                <li><strong>Social Media Platforms:</strong> For social sharing features</li>
                <li><strong>Hotel Booking Partners:</strong> For booking functionality</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Cookies</h2>
              <p className="text-gray-700 mb-4">You can control and manage cookies in several ways:</p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most browsers allow you to refuse or accept cookies, delete existing cookies, or set preferences for certain websites. Check your browser's help section for instructions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Opt-Out Links</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                <li><a href="https://www.allaboutcookies.org/manage-cookies" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">General Cookie Management Guide</a></li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie Duration</h2>
              <p className="text-gray-700 mb-4">We use both session and persistent cookies:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-gray-700 mb-6">
                While you can browse our website with cookies disabled, some features may not work properly. Essential cookies are necessary for basic website functionality.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Updates to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. Changes will be posted on this page with an updated date.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have questions about our use of cookies, please contact us at:{' '}
                <a href="mailto:findhotelswith@weltodigital.com" className="text-blue-600 hover:text-blue-800">
                  findhotelswith@weltodigital.com
                </a>
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. More Information</h2>
              <p className="text-gray-700 mb-6">
                For more information about cookies and how they work, visit:{' '}
                <a href="https://www.allaboutcookies.org" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  www.allaboutcookies.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}