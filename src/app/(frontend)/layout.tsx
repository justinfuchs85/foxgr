import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { SmoothScroll } from './SmoothScroll'
import { ConsentBanner } from './ConsentBanner'
import { Reveal } from './Reveal'
import { consentDefaultScript } from '@/lib/consent'
import { getConsentSettings } from '@/lib/consent-settings'
import { Tracking } from './Tracking'
import { SITE } from '@/lib/site'
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

// Google Tag Manager: Fox Consulting Group's container, overridable with NEXT_PUBLIC_GTM_ID
// (e.g. a test container). GA4 and other tags are managed inside GTM; the direct GA4 tag
// below is only a fallback when no container is set, so the two never double-count.
const gtmCandidate = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T2HW8Z'
const gtmId = /^GTM-[A-Z0-9]+$/.test(gtmCandidate) ? gtmCandidate : null
const gaId = gtmId ? null : process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.defaultTitle, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  // Standard platform marker read by tech detectors. No version number on purpose.
  generator: 'Payload CMS',
  authors: [{ name: SITE.founder.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_US',
    title: SITE.defaultTitle,
    description: SITE.description,
    images: [{ url: '/brand/og-default.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.defaultTitle,
    description: SITE.description,
    images: ['/brand/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const consent = await getConsentSettings()
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint, so reveal animations can
            start hidden without hiding content from no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Consent defaults must be set before Google Tag Manager loads. */}
        <script dangerouslySetInnerHTML={{ __html: consentDefaultScript(consent.config) }} />
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
        <Tracking />
        <Reveal />
        <ConsentBanner config={consent.config} copy={consent.copy} />
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
