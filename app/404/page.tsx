'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Home, Search, ArrowLeft, Heart, Phone, Mail, HelpCircle } from 'lucide-react'

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const commonPages = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Doctors', href: '/doctors', icon: Heart },
    { name: 'Book Appointment', href: '/doctors', icon: Search },
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Contact', href: '/contact', icon: Phone },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'About Us', href: '/about', icon: Heart }
  ]

  const errorTypes = [
    { code: '404', message: 'Page Not Found' },
    { code: '500', message: 'Server Error' },
    { code: '403', message: 'Access Denied' },
    { code: '401', message: 'Unauthorized' }
  ]

  useEffect(() => {
    // Generate suggestions based on common misspellings
    if (searchQuery.length > 2) {
      const allSuggestions = [
        'doctor', 'doctors', 'appointment', 'appointments', 'book', 'booking',
        'login', 'register', 'dashboard', 'profile', 'contact', 'about', 'faq',
        'home', 'history', 'admin', 'patient', 'clinic', 'hospital'
      ]
      
      const filtered = allSuggestions.filter(page =>
        page.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  return (
    <div className="not-found-page">
      {/* 404 Hero Section */}
      <section className="error-hero">
        <div className="error-content">
          <div className="error-number">404</div>
          <h1>Oops! Page Not Found</h1>
          <p>The page you're looking for seems to have vanished into the digital ether. Don't worry, we'll help you get back on track.</p>
          
          <div className="error-actions">
            <Link href="/">
              <button className="primary-btn">
                <Home size={20} />
                Go Home
              </button>
            </Link>
            <button onClick={() => window.history.back()} className="secondary-btn">
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-container">
            <h2>What are you looking for?</h2>
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search for pages, services, or information..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {suggestions.length > 0 && (
              <div className="suggestions">
                <h3>Did you mean?</h3>
                {suggestions.map((suggestion, index) => (
                  <Link key={index} href={`/${suggestion}`} className="suggestion-item">
                    {suggestion}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links-section">
        <div className="container">
          <h2>Popular Pages</h2>
          <div className="links-grid">
            {commonPages.map((page, index) => (
              <Link key={index} href={page.href} className="link-card">
                <page.icon className="link-icon" />
                <h3>{page.name}</h3>
                <p>Go to {page.name.toLowerCase()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="help-section">
        <div className="container">
          <h2>Need Help?</h2>
          <p>Our support team is here to assist you in finding what you need</p>
          
          <div className="help-options">
            <a href="tel:+15551234567" className="help-option">
              <Phone className="help-icon" />
              <div>
                <h3>Call Support</h3>
                <p>+1 (555) 123-4567</p>
                <span>24/7 Available</span>
              </div>
            </a>
            
            <a href="mailto:support@apollocares.com" className="help-option">
              <Mail className="help-icon" />
              <div>
                <h3>Email Support</h3>
                <p>support@apollocares.com</p>
                <span>Quick response</span>
              </div>
            </a>
            
            <Link href="/faq" className="help-option">
              <HelpCircle className="help-icon" />
              <div>
                <h3>FAQ Section</h3>
                <p>Browse common questions</p>
                <span>Self-service</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Error Information */}
      <section className="error-info-section">
        <div className="container">
          <h2>Understanding Error Codes</h2>
          <div className="error-codes">
            {errorTypes.map((error, index) => (
              <div key={index} className="error-code-card">
                <div className="code-number">{error.code}</div>
                <h3>{error.message}</h3>
                <p>
                  {error.code === '404' && 'The requested page doesn\'t exist or has been moved.'}
                  {error.code === '500' && 'Our servers are experiencing technical difficulties.'}
                  {error.code === '403' && 'You don\'t have permission to access this page.'}
                  {error.code === '401' && 'You need to log in to access this page.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Issue */}
      <section className="report-section">
        <div className="container">
          <div className="report-content">
            <h2>Still Can't Find What You Need?</h2>
            <p>If you believe this is an error on our part, please let us know so we can fix it.</p>
            
            <Link href="/contact" className="report-btn">
              Report This Issue
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
        }

        .error-hero {
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%);
          color: white;
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .error-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .error-number {
          font-size: 12rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 1rem;
          opacity: 0.3;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .error-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .error-hero p {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .primary-btn, .secondary-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          border: none;
          font-size: 1rem;
        }

        .primary-btn {
          background: white;
          color: var(--primary-blue);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          backdrop-filter: blur(10px);
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .search-section {
          padding: 4rem 0;
          background: var(--neutral-50);
        }

        .search-container {
          text-align: center;
        }

        .search-container h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: var(--neutral-800);
        }

        .search-bar {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neutral-400);
          width: 20px;
          height: 20px;
        }

        .search-bar input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid var(--neutral-300);
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .suggestions {
          margin-top: 1rem;
          text-align: left;
          background: white;
          border-radius: 8px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .suggestions h3 {
          padding: 1rem;
          margin: 0;
          font-size: 0.9rem;
          color: var(--neutral-600);
          background: var(--neutral-50);
        }

        .suggestion-item {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--neutral-700);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .suggestion-item:hover {
          background: var(--neutral-50);
          color: var(--primary-blue);
        }

        .quick-links-section {
          padding: 4rem 0;
          background: white;
        }

        .quick-links-section h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 3rem;
          color: var(--neutral-800);
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .link-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          background: var(--neutral-50);
          border-radius: 16px;
          text-decoration: none;
          color: var(--neutral-700);
          border: 1px solid var(--neutral-200);
          transition: all 0.3s ease;
        }

        .link-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          color: var(--primary-blue);
          border-color: var(--primary-blue);
        }

        .link-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 1rem;
          color: var(--primary-blue);
        }

        .link-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .link-card p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--neutral-500);
        }

        .help-section {
          padding: 4rem 0;
          background: var(--neutral-50);
        }

        .help-section h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }

        .help-section > p {
          text-align: center;
          color: var(--neutral-600);
          margin-bottom: 3rem;
        }

        .help-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .help-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          text-decoration: none;
          color: var(--neutral-700);
          border: 1px solid var(--neutral-200);
          transition: all 0.3s ease;
        }

        .help-option:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          color: var(--primary-blue);
        }

        .help-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-blue);
          flex-shrink: 0;
        }

        .help-option h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .help-option p {
          margin: 0.25rem 0;
          font-weight: 600;
        }

        .help-option span {
          font-size: 0.9rem;
          color: var(--neutral-500);
        }

        .error-info-section {
          padding: 4rem 0;
          background: white;
        }

        .error-info-section h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 3rem;
          color: var(--neutral-800);
        }

        .error-codes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .error-code-card {
          background: var(--neutral-50);
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          border: 1px solid var(--neutral-200);
          transition: all 0.3s ease;
        }

        .error-code-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .code-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-blue);
          margin-bottom: 1rem;
        }

        .error-code-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }

        .error-code-card p {
          color: var(--neutral-600);
          line-height: 1.6;
        }

        .report-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-blue) 100%);
          color: white;
          text-align: center;
        }

        .report-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .report-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .report-btn {
          display: inline-block;
          padding: 1rem 2rem;
          background: white;
          color: var(--primary-blue);
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .report-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .error-number {
            font-size: 8rem;
          }

          .error-hero h1 {
            font-size: 2rem;
          }

          .error-hero p {
            font-size: 1rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .links-grid,
          .help-options,
          .error-codes {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
