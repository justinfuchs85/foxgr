import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer, Header } from '../../HomepageView'
import { getServicePageBySlug, getServicePageNavigation } from '@/lib/service-pages'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
)

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

  const currentIndex = navigation.findIndex((item) => item.slug === service.slug)
  const nextService = navigation[(currentIndex + 1) % navigation.length]
  const number = String(Math.max(currentIndex + 1, 1)).padStart(2, '0')

  return (
    <main className="overflow-hidden bg-[#f4efe5] text-[#0a2939]">
      <Header servicePages={navigation} />

      <section className="relative min-h-[780px] overflow-hidden bg-[#0a2939] pt-44 text-white md:pt-52">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-45" />
        <div className="absolute right-[-8rem] bottom-[-10rem] size-[34rem] border border-white/15 bg-[#ff7657]" />
        <div className="absolute right-[20%] bottom-0 hidden h-[32rem] w-px bg-white/15 lg:block" />
        <div className="absolute right-0 bottom-[15rem] hidden h-px w-[34rem] bg-white/15 lg:block" />

        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
          <div className="grid gap-14 lg:grid-cols-[1.45fr_0.55fr] lg:items-end">
            <div>
              <p className="mb-8 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#ff967e] uppercase">
                <span className="h-px w-10 bg-current" />
                {service.eyebrow}
              </p>
              <h1 className="max-w-5xl font-serif text-[clamp(4.2rem,9vw,8.5rem)] leading-[0.86] tracking-[-0.055em]">
                {service.title}
              </h1>
            </div>
            <div className="relative z-10 border-t border-white/25 pt-6 lg:mb-4">
              <p className="text-lg leading-8 text-white/70">{service.heroSummary}</p>
              <a
                className="mt-8 inline-flex items-center gap-4 border border-white/35 px-5 py-3 text-sm font-bold transition hover:border-[#ff7657] hover:bg-[#ff7657] hover:text-[#0a2939]"
                href="#capabilities"
              >
                Explore the work <Arrow className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/15">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
            <p className="text-[11px] tracking-[0.18em] text-white/50 uppercase">
              What we do / {service.navigationLabel}
            </p>
            <p className="font-serif text-5xl text-[#ff8467]">{number}</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[0.55fr_1.45fr]">
          <div>
            <p className="section-label">The challenge</p>
            <div className="relative mt-10 hidden h-64 max-w-xs border border-[#0a2939]/20 bg-[#dce8e3] lg:block">
              <div className="absolute top-0 right-0 h-20 w-px bg-[#0a2939]/20" />
              <div className="absolute top-20 right-0 h-px w-20 bg-[#0a2939]/20" />
              <Image
                alt="The Fox Consultant"
                className="object-contain object-bottom"
                fill
                sizes="320px"
                src="/brand/fox-consultant.webp"
              />
            </div>
          </div>
          <div>
            <h2 className="max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] md:text-7xl">
              {service.problem.heading}
            </h2>
            <p className="mt-10 max-w-3xl border-t border-[#0a2939]/20 pt-8 text-lg leading-8 text-[#49636e] md:text-xl">
              {service.problem.body}
            </p>
          </div>
        </div>
      </section>

      <section
        id="capabilities"
        className="border-y border-[#0a2939]/15 bg-[#f8f5ee] px-5 py-24 md:px-10 md:py-36 lg:px-16"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.55fr_1.45fr]">
            <p className="section-label">How we can help</p>
            <h2 className="max-w-4xl font-serif text-5xl leading-none tracking-[-0.04em] md:text-7xl">
              Connected expertise, applied where it matters.
            </h2>
          </div>
          <div className="grid border-t border-l border-[#0a2939]/15 md:grid-cols-2">
            {service.capabilities?.map((capability, index) => (
              <article
                className="min-h-80 border-r border-b border-[#0a2939]/15 p-7 md:p-10"
                key={capability.id ?? capability.title}
              >
                <p className="text-xs font-bold tracking-[0.18em] text-[#b74730] uppercase">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-14 max-w-md font-serif text-4xl leading-none tracking-[-0.03em]">
                  {capability.title}
                </h3>
                <p className="mt-6 max-w-lg text-base leading-7 text-[#58707a]">{capability.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#092433] px-5 py-24 text-white md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="section-label text-[#ff8b70]">How we work</p>
              <p className="mt-8 max-w-md text-base leading-7 text-white/60">{service.approach.body}</p>
            </div>
            <h2 className="max-w-4xl font-serif text-5xl leading-none tracking-[-0.04em] md:text-7xl">
              {service.approach.heading}
            </h2>
          </div>

          {!!service.approach.steps?.length && (
            <div className="mt-16 divide-y divide-white/15 border-y border-white/15">
              {service.approach.steps.map((step, index) => (
                <article
                  className="grid gap-6 py-9 md:grid-cols-[0.25fr_0.7fr_1fr] md:items-start"
                  key={step.id ?? step.title}
                >
                  <p className="font-serif text-3xl text-[#ff8b70]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif text-3xl tracking-[-0.02em]">{step.title}</h3>
                  <p className="max-w-2xl text-base leading-7 text-white/60">{step.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#ff7657] px-5 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.55fr_1.45fr]">
          <p className="section-label">What changes</p>
          <div>
            <h2 className="font-serif text-5xl leading-none tracking-[-0.04em] md:text-7xl">
              A stronger foundation for what comes next.
            </h2>
            {!!service.outcomes?.length && (
              <ul className="mt-12 grid border-t border-[#0a2939]/20 md:grid-cols-2">
                {service.outcomes.map((outcome, index) => (
                  <li
                    className="grid min-h-36 grid-cols-[2.5rem_1fr] items-start border-r border-b border-[#0a2939]/20 py-6 pr-6 text-base leading-7"
                    key={outcome.id ?? outcome.text}
                  >
                    <span className="text-xs font-bold">0{index + 1}</span>
                    {outcome.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0a2939] px-5 py-24 text-white md:px-10 md:py-36 lg:px-16">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="absolute -right-32 -bottom-52 size-[32rem] border border-white/20 bg-[#ff7657]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="section-label text-[#ff8b70]">Ready when you are</p>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <h2 className="max-w-5xl font-serif text-6xl leading-[0.9] tracking-[-0.05em] md:text-8xl">
              {service.cta.heading}
            </h2>
            <div>
              <p className="mb-8 text-lg leading-8 text-white/65">{service.cta.body}</p>
              <a
                className="inline-flex items-center gap-5 border border-white bg-white px-7 py-4 font-bold text-[#0a2939] transition hover:border-[#ff7657] hover:bg-[#ff7657]"
                href="mailto:hello@foxgr.com"
              >
                {service.cta.buttonLabel} <Arrow className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {nextService && (
        <Link
          className="group block border-b border-[#0a2939]/15 bg-[#dce8e3] px-5 py-12 transition hover:bg-[#f8f5ee] md:px-10 lg:px-16"
          href={`/what-we-do/${nextService.slug}`}
        >
          <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-8">
            <div>
              <p className="section-label text-[#58707a]">Next service</p>
              <p className="mt-3 font-serif text-4xl tracking-[-0.03em] md:text-6xl">
                {nextService.navigationLabel}
              </p>
            </div>
            <span className="grid size-16 place-items-center border border-[#0a2939]/25 transition group-hover:bg-[#ff7657]">
              <Arrow className="size-6 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      )}

      <Footer />
    </main>
  )
}
