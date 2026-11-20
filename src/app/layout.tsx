import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'A Little Place for Us ♡',
  description: 'A cozy, peaceful digital sanctuary for two.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col selection:bg-cottage-sage selection:text-cottage-bark">
        <Navigation />
        <main className="flex-1 pb-24 md:pb-12 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          {children}
        </main>
        <footer className="py-6 border-t border-cottage-border/60 text-center text-xs text-cottage-brown">
          <p className="flex items-center justify-center gap-1.5 font-serif text-sm">
            <span>A Little Place for Us</span>
            <span>♡</span>
            <span>A quiet sanctuary made with love</span>
          </p>
        </footer>
      </body>
    </html>
  )
}
