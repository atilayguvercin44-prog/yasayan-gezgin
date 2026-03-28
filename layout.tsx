import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Yaşayan Gezgin — Gezmek Bir Yaşam Biçimi',
    template: '%s | Yaşayan Gezgin',
  },
  description:
    'Dünyanın dört bir yanından seyahat hikayeleri, şehir rehberleri ve keşif notları. @yasayangezgin ile gez, gör, yaşa.',
  keywords: ['seyahat', 'gezi', 'travel', 'blog', 'şehir', 'ülke', 'keşif', 'aile gezisi'],
  authors: [{ name: 'Yaşayan Gezgin', url: 'https://instagram.com/yasayangezgin' }],
  creator: 'Yaşayan Gezgin',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Yaşayan Gezgin',
    title: 'Yaşayan Gezgin — Gezmek Bir Yaşam Biçimi',
    description: 'Dünyanın dört bir yanından seyahat hikayeleri, şehir rehberleri ve keşif notları.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Yaşayan Gezgin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yaşayan Gezgin',
    description: 'Dünyanın dört bir yanından seyahat hikayeleri.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
