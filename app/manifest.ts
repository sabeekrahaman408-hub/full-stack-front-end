import type { MetadataRoute } from 'next'

// Makes the site installable on phones ("Add to Home Screen") and gives it an app-like full-screen look.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Apollo Care – Online Appointments',
    short_name: 'Apollo Care',
    description: 'Find trusted doctors and book appointments online.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#0f766e',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
