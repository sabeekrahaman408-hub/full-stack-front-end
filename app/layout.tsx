import './globals.css'
import type { Metadata, Viewport } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import Toaster from '@/components/Toaster'

export const metadata: Metadata = {
  title: { default: 'Apollo Care – Book Doctor Appointments Online', template: '%s · Apollo Care' },
  description: 'Find trusted doctors, compare fees and book appointments online with Apollo Care.',
  applicationName: 'Apollo Care',
  appleWebApp: { capable: true, title: 'Apollo Care', statusBarStyle: 'default' },
  icons: { icon: '/icon-192.png', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f766e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="main" className="site-main">{children}</main>
        <Footer />
        <BottomNav />
        <Toaster />
      </body>
    </html>
  )
}
