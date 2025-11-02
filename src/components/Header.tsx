'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">Find Hotels With</span>
                <span className="text-xs text-gray-600 -mt-1">Extraordinary Amenities</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Amenities
            </button>
            <button
              onClick={() => scrollToSection('featured-hotels')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Featured
            </button>
            <button
              onClick={() => scrollToSection('all-hotels')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              All Hotels
            </button>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => scrollToSection('all-hotels')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Browse Hotels
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <button
                onClick={() => scrollToSection('hero')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Amenities
              </button>
              <button
                onClick={() => scrollToSection('featured-hotels')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Featured
              </button>
              <button
                onClick={() => scrollToSection('all-hotels')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                All Hotels
              </button>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('all-hotels')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Browse Hotels
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}