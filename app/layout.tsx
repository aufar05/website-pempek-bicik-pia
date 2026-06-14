import { Analytics } from '@vercel/analytics/next'
import { Nunito, Quicksand } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito',
})

const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: 'Warung Bicik Pia - Pempek & Makanan Khas Palembang',
  description: 'Warung online Bicik Pia. Pempek, Tekwan dan Kerupuk khas Palembang. Dibuat dengan cinta, diantar ke rumah!',
  generator: 'v0.app',
  keywords: ['warung', 'pempek', 'palembang', 'tekwan', 'kerupuk', 'makanan indonesia'],
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
  maximumScale: 1,
  themeColor: '#8B6914',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${nunito.variable} ${quicksand.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
