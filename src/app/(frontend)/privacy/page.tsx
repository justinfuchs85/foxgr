import type { Metadata } from 'next'
import { Footer, Header } from '../HomepageView'
import { Container, Label, serif } from '../ui'
import { getServicePageNavigation } from '@/lib/service-pages'
import { SITE, pageMetadata } from '@/lib/site'

export const revalidate = 3600

const EFFECTIVE = 'November 5, 2026'

export const metadata: Metadata = {
  title: 'Privacy policy',
  ...pageMetadata({
    title: `Privacy policy | ${SITE.name}`,
    description: 'What foxgr.com collects, why, who processes it, and the choices you have.',
    path: '/privacy',
  }),
}

const sections: { id: string; heading: string; body: React.ReactNode }[] = [
  {
    id: 'summary',
    heading: 'The short version',
    body: (
      <ul>
        <li>We collect what you send us through the contact form, and only use it to reply.</li>
        <li>Analytics cookies are off until you allow them. We don’t run advertising or sell personal information.</li>
        <li>You can ask us to see or delete anything we hold about you by emailing {SITE.email}.</li>
      </ul>
    ),
  },
  {
    id: 'collect',
    heading: 'What we collect',
    body: (
      <>
        <p>
          <strong>Contact form.</strong> Your name, email address, and anything else you choose to include: company,
          role, the topic you pick and your message. We also note which page you sent it from.
        </p>
        <p>
          <strong>Analytics, with your permission.</strong> If you allow analytics cookies, Google Analytics records
          how the site is used: pages viewed, links and buttons clicked, approximate location (city level), device and
          browser type, and how you arrived. We use this in aggregate to improve the site, not to identify you.
        </p>
        <p>
          <strong>Server logs.</strong> Like any website, our hosting provider automatically processes technical
          information such as IP address, browser and the time of a request, to deliver pages and keep the site secure.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and analytics',
    body: (
      <>
        <p>
          The site uses Google Tag Manager to load Google Analytics, with Google Consent Mode. Until you choose
          “Allow analytics”, analytics cookies are not set. If you decline, Google’s tags may still send limited
          signals without cookies (for example, that a page was viewed), which Google uses to model overall traffic and
          which can’t be used to recognize you on later visits.
        </p>
        <p>
          We honor the Global Privacy Control browser signal as a “no”. We store your choice in your browser so we
          don’t ask on every visit, and you can change it any time with “Cookie settings” at the bottom of every page.
        </p>
        <p>We don’t use advertising cookies, remarketing tags or cross-site tracking.</p>
      </>
    ),
  },
  {
    id: 'use',
    heading: 'How we use it',
    body: (
      <ul>
        <li>To reply to your inquiry and, if we work together, to run the engagement.</li>
        <li>To understand which content is useful and improve the site.</li>
        <li>To keep the site secure and working.</li>
      </ul>
    ),
  },
  {
    id: 'processors',
    heading: 'Who processes it for us',
    body: (
      <>
        <p>We use a small number of service providers, who process data on our behalf under their own terms:</p>
        <ul>
          <li>
            <strong>Vercel</strong>: website hosting.
          </li>
          <li>
            <strong>Supabase</strong>: the database and file storage behind the site, where contact form messages are
            kept.
          </li>
          <li>
            <strong>Google</strong>: Google Tag Manager and Google Analytics, only as described above.
          </li>
          {process.env.RESEND_API_KEY && (
            <li>
              <strong>Resend</strong>: email delivery for notifications when a contact form message arrives.
            </li>
          )}
        </ul>
        <p>We don’t sell or rent personal information, or share it for advertising.</p>
      </>
    ),
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    body: (
      <p>
        Contact form messages are kept for as long as they’re useful for the conversation or working relationship, and
        deleted on request. Google Analytics data is kept according to the retention setting on our analytics account.
      </p>
    ),
  },
  {
    id: 'rights',
    heading: 'Your choices',
    body: (
      <p>
        You can ask what we hold about you, ask us to correct or delete it, or withdraw consent for analytics at any
        time. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we’ll respond promptly. Depending on where you
        live, you may have additional rights under local law; we’ll honor them.
      </p>
    ),
  },
  {
    id: 'other',
    heading: 'Everything else',
    body: (
      <>
        <p>
          This site is meant for business audiences and isn’t directed at children. Links to other sites, such as
          LinkedIn, are covered by those sites’ own policies.
        </p>
        <p>
          If this policy changes, we’ll update it here and change the date below. Questions:{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, {SITE.name}, {SITE.locality}, Michigan.
        </p>
      </>
    ),
  },
]

export default async function PrivacyPage() {
  const navigation = await getServicePageNavigation().catch(() => [])
  return (
    <main className="bg-white text-[#0a2939]">
      <Header servicePages={navigation} />
      <section className="bg-[#0a2939] pt-24 text-white">
        <Container className="pt-20 pb-16 md:pt-28 md:pb-20">
          <Label inverse>Privacy</Label>
          <h1 className={`${serif} text-6xl leading-[0.95] md:text-7xl`}>Privacy policy</h1>
          <p className="mt-6 text-white/70">Effective {EFFECTIVE}</p>
        </Container>
      </section>
      <Container className="py-16 md:py-24">
        <div className="prose-policy max-w-[720px]">
          {sections.map((s) => (
            <section id={s.id} key={s.id}>
              <h2 className={`${serif} mt-12 mb-4 text-4xl leading-tight first:mt-0`}>{s.heading}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </Container>
      <Footer servicePages={navigation} />
    </main>
  )
}
