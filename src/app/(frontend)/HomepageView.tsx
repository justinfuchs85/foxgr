'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import Image from 'next/image'
import Link from 'next/link'
import type {
  About,
  Approach,
  CaseStudies,
  Cta,
  Hero,
  ImageBreak,
  Insights,
  Intro,
  Media,
  Services,
  Testimonial,
  Testimonial1,
} from '@/payload-types'
import type { HomepageContent } from '@/lib/homepage-content'
import type { ServiceNavItem } from '@/lib/service-pages'
import { AnimatedStats } from './AnimatedStats'

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
)

const spacingClasses = {
  compact: 'py-16 md:py-20',
  standard: 'py-24 md:py-32',
  generous: 'py-32 md:py-44',
}

const spacing = (value?: 'compact' | 'standard' | 'generous' | null) =>
  spacingClasses[value ?? 'standard']

const isMedia = (value: number | string | Media | null | undefined): value is Media =>
  typeof value === 'object' && value !== null

const isTestimonial = (
  value: number | string | Testimonial | null | undefined,
): value is Testimonial => typeof value === 'object' && value !== null

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))

// One consistent section label, one container: the two pieces every section shares.
const Label = ({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) => (
  <p
    className={`mb-6 text-[13px] font-bold tracking-[0.18em] uppercase ${
      inverse ? 'text-[#ff8b70]' : 'text-[#b74730]'
    }`}
  >
    {children}
  </p>
)

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1200px] px-5 md:px-8 ${className}`}>{children}</div>
)

const serif = 'font-serif font-medium tracking-[-0.03em]'

export function Header({ servicePages = [] }: { servicePages?: ServiceNavItem[] }) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/12 text-white">
      <div className="mx-auto flex h-24 max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8">
        <Link className="relative h-16 w-16 shrink-0" href="/" aria-label="Fox Consulting Group home">
          <Image
            alt="Fox Consulting Group"
            className="object-contain"
            fill
            priority
            sizes="64px"
            src="/brand/fox-logo-white.webp"
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <Link className="nav-link flex items-center gap-2" href="/#services">
              What we do
              <span aria-hidden="true" className="text-[10px] transition group-hover:rotate-180">
                ↓
              </span>
            </Link>
            {!!servicePages.length && (
              <div className="invisible absolute top-full left-0 w-80 translate-y-2 border border-white/20 bg-[#071d29] p-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {servicePages.map((service) => (
                  <Link
                    className="block border-b border-white/10 px-3 py-3 text-sm text-white/75 transition last:border-b-0 hover:bg-white/5 hover:text-white"
                    href={`/what-we-do/${service.slug}`}
                    key={service.slug}
                  >
                    {service.navigationLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link className="nav-link" href="/#work">
            Work
          </Link>
          <Link className="nav-link" href="/#approach">
            How we work
          </Link>
          <Link className="nav-link" href="/#about">
            About
          </Link>
        </nav>

        <Link
          className="hidden min-h-11 items-center gap-3 bg-[#ff7657] px-6 py-3 text-sm font-bold text-[#0a2939] transition hover:bg-white md:flex"
          href="/#contact"
        >
          Start a conversation
        </Link>

        <details className="group relative lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Menu
            <span className="grid gap-1">
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
            </span>
          </summary>
          <nav className="absolute top-12 right-0 grid w-64 gap-1 border border-white/20 bg-[#0a2939] p-3 shadow-2xl">
            <details className="border-b border-white/10">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
                What we do
              </summary>
              <div className="grid border-t border-white/10 pl-3">
                {servicePages.map((service) => (
                  <Link
                    className="border-l border-white/10 px-4 py-2.5 text-xs text-white/70 hover:border-[#ff7657] hover:text-white"
                    href={`/what-we-do/${service.slug}`}
                    key={service.slug}
                  >
                    {service.navigationLabel}
                  </Link>
                ))}
              </div>
            </details>
            {[
              ['Work', '/#work'],
              ['How we work', '/#approach'],
              ['About', '/#about'],
              ['Contact', '/#contact'],
            ].map(([label, href]) => (
              <Link
                className="border-l border-transparent px-4 py-3 text-sm hover:border-[#ff7657] hover:bg-white/10"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}

function HeroSection({ block }: { block: Hero }) {
  return (
    <section className="relative overflow-hidden bg-[#0a2939] pt-24 text-white">
      <div
        aria-hidden="true"
        className="absolute -right-32 -bottom-40 hidden size-72 bg-[#ff7657]/90 md:block md:size-[26rem]"
      />
      <Container className="relative pt-24 pb-32 md:pt-32 md:pb-40">
        {block.eyebrow && (
          <p className="mb-8 text-[13px] font-bold tracking-[0.18em] text-[#ff8b70] uppercase">
            {block.eyebrow}
          </p>
        )}
        <h1 className={`max-w-4xl ${serif} text-[clamp(3.6rem,9vw,7rem)] leading-[0.9] tracking-[-0.04em]`}>
          {block.heading}
          <span className="mt-3 block text-[#ff7657] italic">{block.accent}</span>
        </h1>
        <p className="mt-12 max-w-[620px] text-lg leading-[1.6] text-white/80 md:text-xl">{block.body}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            className="inline-flex min-h-11 items-center bg-white px-7 py-4 font-bold text-[#0a2939] transition hover:bg-[#ff7657]"
            href="/#contact"
          >
            Start a conversation
          </Link>
          <Link
            className="font-medium text-white underline underline-offset-[6px] transition hover:text-[#ff8b70]"
            href={block.buttonHref}
          >
            {block.buttonLabel}
          </Link>
        </div>
      </Container>
    </section>
  )
}

function IntroSection({ block }: { block: Intro }) {
  return (
    <section className={spacing(block.spacing)}>
      <Container className="flex flex-wrap items-start gap-x-16 gap-y-10">
        <div className="min-w-0 flex-[1_1_440px]">
          <Label>{block.label}</Label>
          <h2 className={`${serif} text-5xl leading-none md:text-[64px]`}>{block.heading}</h2>
        </div>
        {!!block.columns?.length && (
          <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-5 text-lg leading-[1.7] text-[#31505e] md:pt-[52px]">
            {block.columns.map((column, index) => (
              <p key={column.id ?? index}>{column.body}</p>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

function ServicesSection({ block, content }: { block: Services; content: HomepageContent }) {
  const cards = content.servicePages
  if (!cards.length) return null

  return (
    <section
      id="services"
      className={`border-t border-[#0a2939]/10 bg-white ${spacing(block.spacing)}`}
    >
      <Container>
        <Label>{block.label}</Label>
        <h2 className={`mb-14 max-w-3xl ${serif} text-5xl leading-[1.02] md:text-[56px]`}>{block.heading}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              className="group flex min-h-[260px] flex-col gap-4 border border-[#0a2939]/15 p-8 transition hover:border-[#0a2939]/40 hover:bg-[#f8f5ee]"
              href={`/what-we-do/${card.slug}`}
              key={card.slug}
            >
              <h3 className="font-serif text-[32px] leading-[1.05] font-semibold">{card.navigationLabel}</h3>
              <p className="flex-grow text-base leading-[1.6] text-[#49636e]">{card.heroSummary}</p>
              <span className="flex items-center gap-2 text-sm font-bold text-[#b74730]">
                Learn more <Arrow className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
          <Link
            className="group flex min-h-[260px] flex-col gap-4 bg-[#0a2939] p-8 text-white transition hover:bg-[#071d29]"
            href="/#contact"
          >
            <h3 className="font-serif text-[32px] leading-[1.05] font-semibold">Not sure which fits?</h3>
            <p className="flex-grow text-base leading-[1.6] text-white/75">
              Tell us where things feel stuck. We’ll point you to the right starting place.
            </p>
            <span className="flex items-center gap-2 text-sm font-bold text-[#ff7657]">
              Start a conversation <Arrow className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  )
}

function CaseStudiesSection({ block, content }: { block: CaseStudies; content: HomepageContent }) {
  const studies = content.caseStudies.slice(0, block.limit ?? 2)
  if (!studies.length) return null

  return (
    <section id="work" className="pt-24 md:pt-32">
      <Container>
        <Label>{block.label}</Label>
        <h2 className={`max-w-3xl ${serif} text-5xl leading-[1.02] md:text-[56px]`}>{block.heading}</h2>
        {block.body && <p className="mt-6 max-w-2xl text-lg leading-[1.65] text-[#49636e]">{block.body}</p>}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {studies.map((study) => (
            <article className="flex flex-col gap-5" key={study.id}>
              {isMedia(study.artifact) && study.artifact.url ? (
                <div className="relative h-[300px] overflow-hidden bg-[#dce8e3]">
                  <Image
                    alt={study.artifact.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    src={study.artifact.url}
                  />
                </div>
              ) : (
                <div className="flex h-[300px] flex-col justify-end bg-[#dce8e3] p-8">
                  <p className="font-serif text-7xl leading-none">{study.metric.value}</p>
                  <p className="mt-2 text-xs tracking-[0.12em] text-[#31505e] uppercase">{study.metric.label}</p>
                </div>
              )}
              <p className="text-[13px] font-bold tracking-[0.14em] text-[#49636e] uppercase">{study.client}</p>
              <h3 className="font-serif text-4xl leading-[1.05] font-semibold">{study.title}</h3>
              <p className="text-[17px] leading-[1.65] text-[#31505e]">{study.result}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function TestimonialSection({ block }: { block: Testimonial1 }) {
  const testimonial = isTestimonial(block.testimonial) ? block.testimonial : null
  if (!testimonial) return null

  return (
    <section className="pt-16 pb-24 md:pt-[72px] md:pb-32">
      <Container>
        <figure className={`flex flex-col gap-6 px-8 py-12 md:px-16 md:py-14 ${block.theme === 'blue' ? 'bg-[#dce8e3]' : 'bg-[#ff7657]'}`}>
          <blockquote className={`${serif} text-3xl leading-[1.12] tracking-[-0.02em] md:text-[44px]`}>
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="text-sm font-bold tracking-[0.1em] uppercase">
            {testimonial.attribution}, {testimonial.role}
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}

function ApproachSection({ block }: { block: Approach }) {
  return (
    <section id="approach" className={`bg-[#0a2939] text-white ${spacing(block.spacing)}`}>
      <Container>
        <Label inverse>{block.label}</Label>
        <h2 className={`max-w-3xl ${serif} text-5xl leading-[1.02] md:text-[56px]`}>{block.heading}</h2>
        {block.body && <p className="mt-5 max-w-[620px] text-lg leading-[1.65] text-white/75">{block.body}</p>}
        {!!block.steps?.length && (
          <ol className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {block.steps.map((step, index) => (
              <li className="flex flex-col gap-3 border-t-2 border-[#ff7657] pt-6" key={step.id ?? step.title}>
                <span className="font-serif text-[28px] text-[#ff8b70]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-[15px] leading-[1.6] text-white/75">{step.body}</p>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </section>
  )
}

function AboutSection({ block }: { block: About }) {
  const image = isMedia(block.image) ? block.image : null
  const src = image?.url ?? '/brand/fox-consultant.webp'

  return (
    <section id="about" className={spacing(block.spacing)}>
      <Container className="flex flex-wrap items-center gap-x-16 gap-y-10">
        <div className="relative flex h-[340px] min-w-0 flex-[0_1_340px] items-end justify-center bg-[#dce8e3]">
          <div className="relative h-[267px] w-[300px]">
            <Image
              alt={image?.alt ?? 'The Fox Consultant illustration'}
              className="object-contain object-bottom"
              fill
              sizes="300px"
              src={src}
            />
          </div>
        </div>
        <div className="min-w-0 flex-[1_1_480px]">
          <Label>{block.label}</Label>
          <h2 className={`mb-6 ${serif} text-[44px] leading-[1.04] md:text-[52px]`}>{block.heading}</h2>
          <p className="mb-10 max-w-[560px] text-lg leading-[1.7] whitespace-pre-line text-[#31505e]">{block.body}</p>
          {!!block.stats?.length && <AnimatedStats stats={block.stats} tone="light" />}
        </div>
      </Container>
    </section>
  )
}

function CtaSection({ block }: { block: Cta }) {
  return (
    <section id="contact" className={`relative overflow-hidden bg-[#0a2939] text-white ${spacing(block.spacing)}`}>
      <div aria-hidden="true" className="absolute -top-60 -left-36 size-72 bg-[#ff7657]/90 md:size-[20rem]" />
      <Container className="relative flex flex-col items-start gap-8">
        <h2 className={`max-w-4xl ${serif} text-6xl leading-[0.92] tracking-[-0.04em] md:text-8xl`}>{block.heading}</h2>
        <p className="max-w-[560px] text-lg leading-[1.65] text-white/75 md:text-[19px]">{block.body}</p>
        <a
          className="inline-flex min-h-11 items-center gap-4 bg-white px-7 py-4 text-[17px] font-bold text-[#0a2939] transition hover:bg-[#ff7657]"
          href={block.buttonHref}
        >
          {block.buttonLabel} <Arrow className="size-5" />
        </a>
      </Container>
    </section>
  )
}

// Still available in the Homepage Builder, though the redesigned page doesn't use them.
function ImageBreakSection({ block }: { block: ImageBreak }) {
  const media = isMedia(block.image) ? block.image : null
  if (!media?.url) return null
  return (
    <section className="relative h-[22rem] overflow-hidden md:h-[30rem]">
      <Image alt={media.alt} className="object-cover" fill sizes="100vw" src={media.url} />
      {block.overlay !== 'none' && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#071d29]/60 via-transparent to-transparent" />
      )}
      <Container className="absolute inset-0 flex items-center text-white">
        <div>
          <Label inverse>{block.label}</Label>
          <p className={`max-w-lg ${serif} text-4xl leading-none md:text-6xl`}>{block.heading}</p>
        </div>
      </Container>
    </section>
  )
}

function InsightsSection({ block, content }: { block: Insights; content: HomepageContent }) {
  const insights = content.insights.slice(0, block.limit ?? 3)
  if (!insights.length) return null
  return (
    <section className={`bg-[#f8f5ee] ${spacing(block.spacing)}`}>
      <Container>
        <Label>{block.label}</Label>
        <h2 className={`mb-12 ${serif} text-5xl md:text-[56px]`}>{block.heading}</h2>
        <div className="divide-y divide-[#0a2939]/15 border-y border-[#0a2939]/15">
          {insights.map((insight) => (
            <article className="grid gap-4 py-8 md:grid-cols-[0.4fr_1.2fr_1fr]" key={insight.id}>
              <p className="text-xs font-bold tracking-[0.12em] text-[#49636e] uppercase">
                <time dateTime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time> · {insight.readingTime}
              </p>
              <h3 className="font-serif text-3xl leading-[1.05]">{insight.title}</h3>
              <p className="text-sm leading-6 text-[#49636e]">{insight.excerpt}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#071d29] text-white/70">
      <Container className="flex flex-col gap-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
        <Link className="relative h-14 w-14 shrink-0" href="/" aria-label="Fox Consulting Group home">
          <Image alt="Fox Consulting Group" className="object-contain" fill sizes="56px" src="/brand/fox-logo-white.webp" />
        </Link>
        <div className="flex flex-wrap gap-6">
          <a className="hover:text-white" href="https://www.linkedin.com/company/fox-digital-consulting-group">
            LinkedIn
          </a>
          <a className="hover:text-white" href="https://www.instagram.com/foxconsultinggroup/">
            Instagram
          </a>
        </div>
        <p>© {new Date().getFullYear()} Fox Consulting Group</p>
      </Container>
    </footer>
  )
}

export function HomepageView({
  initialContent,
  serverURL,
}: {
  initialContent: HomepageContent
  serverURL: string
}) {
  const { data: homepage } = useLivePreview({
    initialData: initialContent.homepage,
    serverURL,
    depth: 2,
  })

  return (
    <main className="overflow-hidden bg-[#f4efe5] text-[#0a2939]">
      <Header servicePages={initialContent.servicePages} />
      {homepage.sections?.length ? (
        homepage.sections.map((block, index) => {
          const key = block.id ?? `${block.blockType}-${index}`

          switch (block.blockType) {
            case 'hero':
              return <HeroSection block={block} key={key} />
            case 'intro':
              return <IntroSection block={block} key={key} />
            case 'services':
              return <ServicesSection block={block} content={initialContent} key={key} />
            case 'caseStudies':
              return <CaseStudiesSection block={block} content={initialContent} key={key} />
            case 'testimonial':
              return <TestimonialSection block={block} key={key} />
            case 'approach':
              return <ApproachSection block={block} key={key} />
            case 'about':
              return <AboutSection block={block} key={key} />
            case 'cta':
              return <CtaSection block={block} key={key} />
            case 'imageBreak':
              return <ImageBreakSection block={block} key={key} />
            case 'insights':
              return <InsightsSection block={block} content={initialContent} key={key} />
            default:
              return null
          }
        })
      ) : (
        <section className="min-h-screen bg-[#0a2939] pt-48 text-white">
          <Container>
            <Label inverse>Homepage Builder</Label>
            <h1 className="font-serif text-5xl">
              Add your first section in Payload, or run <code>pnpm seed</code>.
            </h1>
          </Container>
        </section>
      )}
      <Footer />
    </main>
  )
}
