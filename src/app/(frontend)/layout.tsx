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
// Google Tag Manager loads when NEXT_PUBLIC_GTM_ID is set (GTM-XXXXXXX). GA4 and any other
// tags are managed inside the container. The direct GA4 tag below is only a fallback for
// a site with no container, so the two never double-count.
// Fox Consulting Group's container. NEXT_PUBLIC_GTM_ID overrides it (e.g. a test container).
const gtmCandidate = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T2HW8Z'
const gtmId = /^GTM-[A-Z0-9]+$/.test(gtmCandidate) ? gtmCandidate : null
  : null
const gaId = gtmId ? null : process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title,
  description,
  openGraph: { title, description },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint, so reveal animations can
            start hidden without hiding content from no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`}
          </Script>
        )}
      </head>
      <body
        className={`${sans.variable} ${serif.variable} min-h-screen bg-white text-zinc-950 antialiased`}
      >
        {gtmId && (
          <noscript>
            <iframe
              height="0"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
              width="0"
            />
          </noscript>
        )}
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
