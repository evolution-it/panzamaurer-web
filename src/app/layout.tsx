import type { Metadata } from 'next'
import { Hanken_Grotesk, Noto_Sans, Inter } from 'next/font/google'
import './globals.css'
import { draftMode } from 'next/headers'
import VisualEditingWrapper from '@/components/VisualEditingWrapper'

const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

const notoSans = Noto_Sans({
  variable: '--font-noto',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['600'],
})

export const metadata: Metadata = {
  title: 'Panza Maurer | Attorneys at Law',
  description:
    'Representing Business, Regulated Industries, and Institutions for more than 50 years in Florida.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isEnabled } = await draftMode()

  return (
    <html lang='en'>
      <body
        className={`${hankenGrotesk.variable} ${notoSans.variable} ${inter.variable} antialiased`}
      >
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-dark focus:shadow-lg focus:outline-2 focus:outline-primary-red'
        >
          Skip to main content
        </a>
        {children}
        {isEnabled && <VisualEditingWrapper />}
      </body>
    </html>
  )
}
