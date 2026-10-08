'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar, Shield } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: '24/7 Helpline',
      details: ['7812824061'],
      description: 'Available round the clock for emergencies'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: ['support@apollocares.com', 'info@apollocares.com'],
      description: 'Response within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Main Office',
      details: ['123 Healthcare Avenue', 'Medical District, CA 90210'],
      description: 'Mon-Fri: 9AM-6PM, Sat: 10AM-2PM'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon-Fri: 9AM-6PM', 'Sat: 10AM-2PM', 'Sun: Emergency Only'],
      description: '24/7 Emergency Services Available'
    }
  ]

  const faqItems = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment through our website, mobile app, or by calling our helpline. Simply choose your preferred doctor, select a time slot, and confirm your booking.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, insurance plans, and digital payment methods like PayPal and Apple Pay.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time through your account or by calling our support team.'
    },
    {
      question: 'Do you offer online consultations?',
      answer: 'Yes, we offer video consultations for many specialties. You can choose between in-person or online appointments when booking.'
    }
  ]

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We're here to help you with your healthcare needs. Get in touch with our team for any questions or support.</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <info.icon className="contact-icon" />
                <h3>{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
                <span>{info.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-main-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="7812824061"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="appointment">Appointment Booking</option>
                      <option value="billing">Billing & Payment</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
              
              {submitMessage && (
                <div className="success-message">
                  <Shield size={20} />
                  {submitMessage}
                </div>
              )}
            </div>

            {/* Map & Quick Contact */}
            <div className="contact-aside">
              {/* Map Placeholder */}
              <div className="map-container">
                <div className="map-placeholder">
                  <MapPin className="map-icon" />
                  <h3>Our Location</h3>
                  <p>123 Healthcare Avenue, Medical District, CA 90210</p>
                  <button className="directions-btn">Get Directions</button>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="quick-contact">
                <h3>Need Immediate Help?</h3>
                <div className="quick-contact-options">
                  <a href="tel:7812824061" className="quick-contact-item">
                    <Phone size={20} />
                    <div>
                      <h4>Emergency Hotline</h4>
                      <p>7812824061</p>
                    </div>
                  </a>
                  <a href="mailto:support@apollocares.com" className="quick-contact-item">
                    <MessageCircle size={20} />
                    <div>
                      <h4>Live Chat</h4>
                      <p>Available 24/7</p>
                    </div>
                  </a>
                  <a href="/doctors" className="quick-contact-item">
                    <Calendar size={20} />
                    <div>
                      <h4>Book Appointment</h4>
                      <p>Schedule online</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          <div className="faq-grid">
            {faqItems.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
        }

        .contact-hero {
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-content p {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .contact-info-section {
          padding: 4rem 0;
          background: var(--neutral-50);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .contact-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .contact-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-blue);
          margin-bottom: 1.5rem;
        }

        .contact-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }

        .contact-card p {
          color: var(--neutral-600);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .contact-card span {
          color: var(--neutral-500);
          font-size: 0.9rem;
        }

        .contact-main-section {
          padding: 4rem 0;
          background: white;
        }

        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .contact-form-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }

        .contact-form-section > p {
          color: var(--neutral-600);
          margin-bottom: 2rem;
        }

        .contact-form {
          background: var(--neutral-50);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--neutral-200);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--neutral-700);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--neutral-300);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--primary-blue-dark);
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--success);
          color: white;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .contact-aside {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .map-container {
          background: var(--neutral-50);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--neutral-200);
        }

        .map-placeholder {
          height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-200) 100%);
        }

        .map-icon {
          width: 64px;
          height: 64px;
          color: var(--primary-blue);
        }

        .map-placeholder h3 {
          font-size: 1.25rem;
          color: var(--neutral-800);
        }

        .map-placeholder p {
          color: var(--neutral-600);
        }

        .directions-btn {
          padding: 0.75rem 1.5rem;
          background: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .directions-btn:hover {
          background: var(--primary-blue-dark);
        }

        .quick-contact {
          background: var(--neutral-50);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--neutral-200);
        }

        .quick-contact h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: var(--neutral-800);
        }

        .quick-contact-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quick-contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          text-decoration: none;
          color: var(--neutral-700);
          border: 1px solid var(--neutral-200);
          transition: all 0.3s ease;
        }

        .quick-contact-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          color: var(--primary-blue);
        }

        .quick-contact-item h4 {
          margin: 0;
          font-size: 1rem;
        }

        .quick-contact-item p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--neutral-500);
        }

        .faq-section {
          padding: 4rem 0;
          background: var(--neutral-50);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }

        .section-header p {
          color: var(--neutral-600);
          font-size: 1.1rem;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .faq-item {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--neutral-200);
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .faq-item h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--primary-blue);
        }

        .faq-item p {
          color: var(--neutral-600);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .contact-main-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .contact-grid,
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
