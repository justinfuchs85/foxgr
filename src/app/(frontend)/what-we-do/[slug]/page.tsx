import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer, Header } from '../../HomepageView'
import { Arrow, Container, Label, serif } from '../../ui'
import { getServicePageBySlug, getServicePageNavigation } from '@/lib/service-pages'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  // Tolerate a missing/empty database at build time; pages render on demand instead.
  try {
    const services = await getServicePageNavigation()
    return services.filter(({ slug }) => slug).map(({ slug }) => ({ slug: slug as string }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServicePageBySlug(slug)

  if (!service) return {}

  return {
    title: `${service.title} | Fox Consulting Group`,
    description: service.heroSummary,
    alternates: {
      canonical: `/what-we-do/${service.slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.heroSummary,
      type: 'website',
    },
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const [service, navigation] = await Promise.all([
    getServicePageBySlug(slug),
    getServicePageNavigation(),
  ])

  if (!service) notFound()

  // "Next" walks the practice areas; a page outside them (On-Demand, For Developers) points to the first.
  const practiceAreas = navigation.filter((item) => item.featured !== false)
  const position = practiceAreas.findIndex((item) => item.slug === service.slug)
  const nextService = practiceAreas.length
    ? practiceAreas[(position + 1) % practiceAreas.length]
    : undefined
  const showNext = nextService && nextService.slug !== service.slug

  return (
    <main className="overflow-hidden bg-[#f4efe5] text-[#0a2939]">
      <Header servicePages={navigation} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a2939] pt-24 text-white">
        <div
          aria-hidden="true"
          className="absolute -right-32 -bottom-40 hidden size-[26rem] bg-[#ff7657]/90 xl:block"
        />
        <Container className="relative pt-20 pb-28 md:pt-28 md:pb-32">
          <p className="mb-8 text-[13px] text-white/60">
            <Link className="hover:text-white" href="/#services">
              What we do
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="text-white/85">{service.navigationLabel}</span>
          </p>
          <Label inverse>{service.eyebrow}</Label>
          <h1 className={`max-w-3xl ${serif} text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.04em]`}>
            {service.title}
          </h1>
          <p className="mt-10 max-w-[620px] text-lg leading-[1.6] text-white/80 md:text-xl">{service.heroSummary}</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              className="inline-flex min-h-11 items-center bg-white px-7 py-4 font-bold text-[#0a2939] transition hover:bg-[#ff7657]"
              href="#contact"
            >
              Start a conversation
            </a>
            <a
              className="font-medium text-white underline underline-offset-[6px] transition hover:text-[#ff8b70]"
              href="#capabilities"
            >
              See how we help
            </a>
          </div>
        </Container>
      </section>

      {/* The challenge */}
      <section className="py-24 md:py-32">
        <Container className="flex flex-wrap items-start gap-x-16 gap-y-10">
          <div className="min-w-0 flex-[1_1_440px]">
            <Label>The challenge</Label>
            <h2 className={`${serif} text-5xl leading-none md:text-[56px]`}>{service.problem.heading}</h2>
          </div>
          <p className="min-w-0 flex-[1_1_400px] text-lg leading-[1.7] text-[#31505e] md:pt-[52px]">
            {service.problem.body}
          </p>
        </Container>
      </section>

      {/* How we can help */}
      {!!service.capabilities?.length && (
        <section id="capabilities" className="border-t border-[#0a2939]/10 bg-white py-24 md:py-32">
          <Container>
            <Label>How we can help</Label>
            <h2 className={`mb-14 max-w-3xl ${serif} text-5xl leading-[1.02] md:text-[56px]`}>
              Where the work focuses.
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {service.capabilities.map((capability) => (
                <article
                  className="flex flex-col gap-4 border border-[#0a2939]/15 p-8 md:p-10"
                  key={capability.id ?? capability.title}
                >
                  <h3 className="font-serif text-[30px] leading-[1.05] font-semibold">{capability.title}</h3>
                  <p className="text-base leading-[1.6] text-[#49636e]">{capability.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* How we work */}
      <section className="bg-[#0a2939] py-24 text-white md:py-32">
        <Container>
          <Label inverse>How we work</Label>
          <h2 className={`max-w-3xl ${serif} text-5xl leading-[1.02] md:text-[56px]`}>{service.approach.heading}</h2>
          <p className="mt-5 max-w-[620px] text-lg leading-[1.65] text-white/75">{service.approach.body}</p>
          {!!service.approach.steps?.length && (
            <ol className="mt-16 flex flex-wrap gap-8">
              {service.approach.steps.map((step, index) => (
                <li
                  className="flex min-w-0 flex-[1_1_220px] flex-col gap-3 border-t-2 border-[#ff7657] pt-6"
                  key={step.id ?? step.title}
                >
                  <span className="font-serif text-[28px] text-[#ff8b70]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-[15px] leading-[1.6] text-white/75">{step.body}</p>
                </li>
              ))}
            </ol>
          )}
        </Container>
      </section>

      {/* What changes */}
      {!!service.outcomes?.length && (
        <section className="py-24 md:py-32">
          <Container className="flex flex-wrap items-start gap-x-16 gap-y-10">
            <div className="min-w-0 flex-[1_1_360px]">
              <Label>What changes</Label>
              <h2 className={`${serif} text-5xl leading-[1.02] md:text-[56px]`}>What you’re left with.</h2>
            </div>
            <ul className="grid min-w-0 flex-[1_1_480px] gap-x-8 sm:grid-cols-2">
              {service.outcomes.map((outcome) => (
                <li
                  className="flex gap-4 border-t border-[#0a2939]/20 py-6 text-lg leading-[1.5]"
                  key={outcome.id ?? outcome.text}
                >
                  <span aria-hidden="true" className="mt-2.5 block h-0.5 w-4 shrink-0 bg-[#ff7657]" />
                  {outcome.text}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section id="contact" className="relative overflow-hidden bg-[#0a2939] py-24 text-white md:py-32">
        <div aria-hidden="true" className="absolute -top-60 -left-36 size-72 bg-[#ff7657]/90 md:size-[20rem]" />
        <Container className="relative flex flex-col items-start gap-8">
          <h2 className={`max-w-4xl ${serif} text-6xl leading-[0.92] tracking-[-0.04em] md:text-8xl`}>
            {service.cta.heading}
          </h2>
          <p className="max-w-[560px] text-lg leading-[1.65] text-white/75 md:text-[19px]">{service.cta.body}</p>
          <a
            className="inline-flex min-h-11 items-center gap-4 bg-white px-7 py-4 text-[17px] font-bold text-[#0a2939] transition hover:bg-[#ff7657]"
            href="mailto:hello@foxgr.com"
          >
            {service.cta.buttonLabel} <Arrow className="size-5" />
          </a>
        </Container>
      </section>

      {showNext && (
        <Link className="group block bg-white transition hover:bg-[#f8f5ee]" href={`/what-we-do/${nextService.slug}`}>
          <Container className="flex items-center justify-between gap-8 py-12">
            <div>
              <p className="text-[13px] font-bold tracking-[0.18em] text-[#49636e] uppercase">Next practice area</p>
              <p className={`mt-3 ${serif} text-4xl md:text-5xl`}>{nextService.navigationLabel}</p>
            </div>
            <span className="grid size-14 shrink-0 place-items-center border border-[#0a2939]/25 transition group-hover:bg-[#ff7657]">
              <Arrow className="size-6 transition group-hover:translate-x-1" />
            </span>
          </Container>
        </Link>
      )}

      <Footer />
    </main>
  )
}
