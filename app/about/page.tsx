'use client'

import { Heart, Users, Award, Clock, MapPin, Phone, Mail, CheckCircle, Target, Lightbulb, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Apollo Care</h1>
          <p>Leading the future of healthcare with compassion, innovation, and excellence</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <Target className="card-icon" />
              <h2>Our Mission</h2>
              <p>To provide accessible, affordable, and quality healthcare services to every individual through innovative technology and compassionate care, ensuring better health outcomes for all communities.</p>
            </div>
            <div className="vision-card">
              <Lightbulb className="card-icon" />
              <h2>Our Vision</h2>
              <p>To become the most trusted healthcare platform globally, revolutionizing how people access medical care by bridging the gap between patients and healthcare providers through cutting-edge technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Content */}
      <section className="about-content-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>Who We Are</h2>
              <p>Apollo Care is a pioneering digital healthcare platform dedicated to making quality medical services accessible to everyone. Founded in 2014, we have grown from a small startup to serving over 10,000 patients across multiple specialties.</p>

              <p>Our platform connects patients with verified, experienced healthcare professionals, enabling seamless appointment booking, online consultations, and comprehensive health management - all from the comfort of your home.</p>

              <p>We believe that healthcare should be convenient, affordable, and patient-centered. That's why we've built a system that puts your health needs first, providing 24/7 access to medical care when you need it most.</p>
            </div>
            <div className="content-image">
              <div className="image-placeholder">
                <Heart className="placeholder-icon" />
                <span>Healthcare Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <Heart className="value-icon" />
              <h3>Compassion</h3>
              <p>We treat every patient with empathy, dignity, and respect, understanding that healthcare is deeply personal.</p>
            </div>
            <div className="value-card">
              <Shield className="value-icon" />
              <h3>Integrity</h3>
              <p>We maintain the highest ethical standards in all our interactions, ensuring trust and transparency.</p>
            </div>
            <div className="value-card">
              <Lightbulb className="value-icon" />
              <h3>Innovation</h3>
              <p>We continuously evolve our technology and processes to deliver better healthcare experiences.</p>
            </div>
            <div className="value-card">
              <Users className="value-icon" />
              <h3>Collaboration</h3>
              <p>We work together with patients, doctors, and healthcare providers to achieve optimal health outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Appointments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Years of Trust</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Leadership Team</h2>
            <p>Meet the experts behind Apollo Care</p>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <span>JD</span>
              </div>
              <h3>Dr. John Davidson</h3>
              <p className="member-role">Chief Medical Officer</p>
              <p className="member-bio">20+ years of experience in internal medicine and healthcare management.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <span>SJ</span>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="member-role">CEO & Founder</p>
              <p className="member-bio">Visionary leader with expertise in healthcare technology and patient care innovation.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <span>MC</span>
              </div>
              <h3>Michael Chen</h3>
              <p className="member-role">CTO</p>
              <p className="member-bio">Technology expert focused on building secure and user-friendly healthcare platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get in Touch</h2>
            <p>We're here to help you with your healthcare needs</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <Phone className="contact-icon" />
              <h3>24/7 Helpline</h3>
              <p> 7812824061</p>
              <span>Available round the clock for emergencies</span>
            </div>
            <div className="contact-card">
              <Mail className="contact-icon" />
              <h3>Email Support</h3>
              <p>sabeekrahaman408@gmail.com</p>
              <span>Response within 24 hours</span>
            </div>
            <div className="contact-card">
              <MapPin className="contact-icon" />
              <h3>Main Office</h3>
              <p>123 Healthcare Avenue, Medical District, CA 90210</p>
              <span>Mon-Fri: 9AM-6PM</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
        }

        .about-hero {
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%);
          color: white;
          padding: 6rem 2rem;
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

        .mission-vision-section {
          padding: 4rem 0;
          background: var(--neutral-50);
        }

        .mission-vision-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .mission-card, .vision-card {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .mission-card:hover, .vision-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .card-icon {
          width: 64px;
          height: 64px;
          color: var(--primary-blue);
          margin-bottom: 1.5rem;
        }

        .mission-card h2, .vision-card h2 {
          font-size: 1.75rem;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }

        .mission-card p, .vision-card p {
          color: var(--neutral-600);
          line-height: 1.6;
        }

        .about-content-section {
          padding: 4rem 0;
          background: white;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .content-text h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: var(--neutral-800);
        }

        .content-text p {
          color: var(--neutral-600);
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .content-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-placeholder {
          width: 100%;
          max-width: 400px;
          height: 400px;
          background: linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-200) 100%);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          border: 2px dashed var(--neutral-300);
        }

        .placeholder-icon {
          width: 80px;
          height: 80px;
          color: var(--primary-blue);
        }

        .image-placeholder span {
          color: var(--neutral-600);
          font-weight: 600;
        }

        .values-section {
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

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
          text-align: center;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-blue);
        }

        .value-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-blue);
          margin-bottom: 1.5rem;
        }

        .value-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }

        .value-card p {
          color: var(--neutral-600);
          line-height: 1.6;
        }

        .stats-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%);
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .stat-item {
          padding: 2rem;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .team-section {
          padding: 4rem 0;
          background: white;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .team-member {
          background: var(--neutral-50);
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          border: 1px solid var(--neutral-200);
          transition: all 0.3s ease;
        }

        .team-member:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .member-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-blue);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          margin: 0 auto 1.5rem;
        }

        .team-member h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--neutral-800);
        }

        .member-role {
          color: var(--primary-blue);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .member-bio {
          color: var(--neutral-600);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .contact-section {
          padding: 4rem 0;
          background: var(--neutral-50);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
          margin-bottom: 0.5rem;
          color: var(--neutral-800);
        }

        .contact-card p {
          color: var(--neutral-600);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .contact-card span {
          color: var(--neutral-500);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .mission-vision-grid,
          .content-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .content-text {
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .team-grid,
          .contact-grid,
          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
