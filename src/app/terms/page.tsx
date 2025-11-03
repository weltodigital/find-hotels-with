import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function TermsOfService() {
  return (
    <>
      <Header />
      <Breadcrumbs />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using Find Hotels With ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-6">
                Find Hotels With is a website that helps users discover luxury hotels with specific facilities, particularly tennis courts and padel courts. We provide information and listings to help you find suitable accommodations.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Acceptable Use</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use the service only for lawful purposes</li>
                <li>Provide accurate information when making inquiries</li>
                <li>Respect intellectual property rights</li>
                <li>Do not attempt to compromise website security</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Prohibited Activities</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Automated data collection or scraping</li>
                <li>Transmission of malicious software</li>
                <li>Harassment or abuse of other users</li>
                <li>Misrepresentation of identity or affiliation</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Hotel Information and Bookings</h2>
              <p className="text-gray-700 mb-6">
                We provide information about hotels as a convenience. We are not responsible for the accuracy of hotel information, availability, pricing, or booking arrangements. All bookings are subject to the hotel's own terms and conditions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                All content on Find Hotels With, including text, graphics, logos, and software, is the property of Find Hotels With or its licensors and is protected by copyright and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimers</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Service Availability</h3>
              <p className="text-gray-700 mb-4">
                We strive to maintain service availability but cannot guarantee uninterrupted access. The service is provided "as is" without warranties of any kind.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Information Accuracy</h3>
              <p className="text-gray-700 mb-6">
                While we make efforts to provide accurate information, we cannot guarantee the completeness or accuracy of hotel listings, amenities, or availability.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                Find Hotels With shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid for using our service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
              <p className="text-gray-700 mb-6">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-700 mb-6">
                Our service may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to terminate or suspend access to our service at any time, with or without notice, for any reason including breach of these terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to conflict of law principles.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We may modify these terms at any time. Changes will be effective when posted on this page. Your continued use of the service constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-6">
                If you have questions about these Terms of Service, please contact us at:{' '}
                <a href="mailto:findhotelswith@weltodigital.com" className="text-blue-600 hover:text-blue-800">
                  findhotelswith@weltodigital.com
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