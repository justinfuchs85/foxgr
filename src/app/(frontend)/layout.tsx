import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { SmoothScroll } from './SmoothScroll'
import './styles.css'

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['500', '600'],
})

const title = 'Fox Consulting Group'
const description = 'Strategy, analytics, and operations consulting for modern marketing teams.'
const gaId = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title,
  description,
  openGraph: { title, description },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} min-h-screen bg-white text-zinc-950 antialiased`}
      >
        <SmoothScroll />
        <a className="skip-link" href="#root">
          Skip to content
        </a>
        <div id="root" tabIndex={-1}>
          {children}
        </div>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
