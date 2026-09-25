import { Analytics } from '@vercel/analytics/next'
import { Gloock, Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

// Display: serif tebal berkarakter untuk judul & teks melingkar
const gloock = Gloock({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gloock',
  display: 'swap',
})

// Body/UI: Plus Jakarta Sans, dirancang oleh Tokotype (Jakarta)
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Warung Bicik Pia - Pempek & Makanan Khas Palembang',
  description:
    'Pempek ikan kakap, gabus, dan tenggiri frozen, tekwan, dan kerupuk khas Palembang dari Warung Bicik Pia. Pesan lewat WhatsApp, tinggal goreng di rumah.',
  keywords: ['warung', 'pempek', 'palembang', 'tekwan', 'kerupuk', 'pempek frozen', 'makanan indonesia'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#231310',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${gloock.variable} ${jakarta.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
