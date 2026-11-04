'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import Image from 'next/image'
import Link from 'next/link'
import type {
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
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
)

const spacingClasses = {
  compact: 'py-16 md:py-20',
  standard: 'py-24 md:py-36',
  generous: 'py-32 md:py-44',
}

const spacing = (value?: 'compact' | 'standard' | 'generous' | null) =>
  spacingClasses[value ?? 'standard']

const isMedia = (value: number | string | Media | null | undefined): value is Media =>
  typeof value === 'object' && value !== null

const isTestimonial = (
  value: number | string | Testimonial | null | undefined,
): value is Testimonial => typeof value === 'object' && value !== null

function FoxGuide({
  media,
  note,
  inverse = false,
}: {
  media?: Media | null
  note: string
  inverse?: boolean
}) {
  const src = media?.url ?? '/brand/fox-consultant.webp'

  return (
    <aside
      className={`flex items-end gap-3 text-[10px] leading-4 tracking-[0.12em] uppercase ${
        inverse ? 'text-white/55' : 'text-[#58707a]'
      }`}
    >
      <div className="relative h-20 w-20 shrink-0">
        <Image
          alt={media?.alt ?? 'The Fox Consultant'}
          className="object-contain object-bottom"
          fill
          sizes="80px"
          src={src}
        />
      </div>
      <p className={`max-w-36 border-t pt-2 ${inverse ? 'border-white/25' : 'border-[#0a2939]/20'}`}>
        {note}
      </p>
    </aside>
  )
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))

export function Header({ servicePages = [] }: { servicePages?: ServiceNavItem[] }) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/15 text-white">
      <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">
        <Link
          className="relative h-20 w-44 shrink-0"
          href="/"
          aria-label="Fox Consulting Group home"
        >
          <Image
            alt="Fox Consulting Group"
            className="object-contain"
            fill
            priority
            sizes="176px"
            src="/brand/fox-logo-white.webp"
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-9 lg:flex">
          <div className="group relative">
            <Link className="nav-link flex items-center gap-2" href="/#services">
              What we do
              <span aria-hidden="true" className="text-[10px] transition group-hover:rotate-180">
                ↓
              </span>
            </Link>
            {!!servicePages.length && (
              <div className="invisible absolute top-full left-0 w-80 translate-y-2 border border-white/20 bg-[#071d29] p-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {servicePages.map((service, index) => (
                  <Link
                    className="grid grid-cols-[2rem_1fr] border-b border-white/10 px-3 py-3 text-sm text-white/70 transition last:border-b-0 hover:border-[#ff7657] hover:bg-white/5 hover:text-white"
                    href={`/what-we-do/${service.slug}`}
                    key={service.slug}
                  >
                    <span className="text-[10px] tracking-[0.12em] text-[#ff8b70]">0{index + 1}</span>
                    {service.navigationLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link className="nav-link" href="/#work">
            Work
          </Link>
          <Link className="nav-link" href="/#insights">
            Insights
          </Link>
          <Link className="nav-link" href="/#about">
            About
          </Link>
        </nav>

        <Link
          className="hidden items-center gap-3 border border-[#ff7657] bg-[#ff7657] px-6 py-3 text-sm font-semibold text-[#0a2939] transition hover:border-white hover:bg-white md:flex"
          href="/#contact"
        >
          Start a conversation <Arrow className="size-4" />
        </Link>

        <details className="group relative lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Menu
            <span className="grid gap-1">
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
            </span>
          </summary>
          <nav className="absolute top-10 right-0 grid w-56 gap-1 border border-white/20 bg-[#0a2939] p-3 shadow-2xl">
            <details className="border-b border-white/10">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
                What we do
              </summary>
              <div className="grid border-t border-white/10 pl-3">
                {servicePages.map((service) => (
                  <Link
                    className="border-l border-white/10 px-4 py-2.5 text-xs text-white/65 hover:border-[#ff7657] hover:text-white"
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
              ['Insights', '/#insights'],
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

function HeroSection({ block, guide }: { block: Hero; guide?: Media | null }) {
  return (
    <section className="relative min-h-[900px] bg-[#0a2939] pt-48 text-white md:min-h-[860px] md:pt-56">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="absolute right-12 bottom-12 size-44 bg-[#ff7657] md:right-[14%] md:bottom-[-5rem] md:size-72" />
      <div className="absolute right-[26%] bottom-24 hidden h-[34rem] w-px bg-white/20 lg:block" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="max-w-5xl">
          <p className="mb-8 flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-[#ff967e] uppercase">
            <span className="h-px w-10 bg-current" />
            {block.eyebrow}
          </p>
          <h1 className="max-w-5xl font-serif text-[clamp(4.2rem,10vw,9.6rem)] leading-[0.82] tracking-[-0.055em]">
            {block.heading}
            <span className="mt-3 block italic text-[#ff7657]">{block.accent}</span>
          </h1>
          <div className="mt-14 grid max-w-4xl gap-8 border-t border-white/20 pt-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-lg leading-8 text-white/70 md:text-xl">{block.body}</p>
            <Link
              className="group flex size-24 items-center justify-center border border-white/35 transition hover:border-[#ff7657] hover:bg-[#ff7657] hover:text-[#0a2939]"
              href={block.buttonHref}
              aria-label={block.buttonLabel}
            >
              <Arrow className="size-7 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <div className="absolute right-16 bottom-36 hidden xl:block">
          <FoxGuide
            inverse
            media={guide}
            note="Start with the operating system, not the campaign."
          />
        </div>
      </div>

      {!!block.stats?.length && (
        <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-[#0a2939]/65 backdrop-blur-sm">
          <AnimatedStats stats={block.stats} />
        </div>
      )}
    </section>
  )
}

function IntroSection({ block }: { block: Intro }) {
  const character = isMedia(block.characterImage) ? block.characterImage : null

  return (
    <section id="about" className={`px-5 md:px-10 lg:px-16 ${spacing(block.spacing)}`}>
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="section-label">{block.label}</p>
          {character?.url && (
            <>
              <div className="relative mt-10 hidden h-72 max-w-xs border border-[#0a2939]/20 bg-[#dce8e3] lg:block">
                <div className="absolute top-0 right-0 h-20 w-px bg-[#0a2939]/20" />
                <div className="absolute top-20 right-0 h-px w-20 bg-[#0a2939]/20" />
                <Image
                  alt={character.alt}
                  className="object-contain object-bottom"
                  fill
                  sizes="320px"
                  src={character.url}
                />
              </div>
              <p className="mt-4 hidden max-w-xs border-t border-[#0a2939]/20 pt-4 text-xs font-bold tracking-[0.16em] uppercase lg:block">
                {block.characterTitle}
                <span className="mt-1 block font-normal tracking-normal text-[#49636e] normal-case">
                  {block.characterCaption}
                </span>
              </p>
            </>
          )}
        </div>
        <div>
          <h2 className="max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] md:text-7xl">
            {block.heading}
          </h2>
          {!!block.columns?.length && (
            <div className="mt-12 grid gap-8 border-t border-[#0a2939]/20 pt-8 md:grid-cols-2">
              {block.columns.map((column, index) => (
                <p className="text-lg leading-8 text-[#31505e]" key={column.id ?? index}>
                  {column.body}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ImageBreakSection({ block }: { block: ImageBreak }) {
  const media = isMedia(block.image) ? block.image : null
  if (!media?.url) return null

  return (
    <section className="relative h-[22rem] overflow-hidden border-y border-[#0a2939]/15 md:h-[30rem]">
      <Image alt={media.alt} className="object-cover" fill sizes="100vw" src={media.url} />
      {block.overlay !== 'none' && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#071d29]/55 via-transparent to-transparent" />
      )}
      <div className="absolute inset-0 mx-auto flex max-w-[1440px] items-center px-5 md:px-10 lg:px-16">
        <div className="border-l border-white/60 pl-6 text-white">
          <p className="text-xs font-bold tracking-[0.2em] uppercase">{block.label}</p>
          <p className="mt-3 max-w-lg font-serif text-4xl leading-none tracking-[-0.03em] md:text-6xl">
            {block.heading}
          </p>
        </div>
      </div>
    </section>
  )
}

function ServicesSection({ block, content }: { block: Services; content: HomepageContent }) {
  const isPaper = block.theme === 'paper'

  return (
    <section
      id="services"
      className={`px-5 md:px-10 lg:px-16 ${spacing(block.spacing)} ${
        isPaper ? 'bg-[#f4efe5] text-[#0a2939]' : 'bg-[#092433] text-white'
      }`}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <p className={`section-label ${isPaper ? 'text-[#b74730]' : 'text-[#ff8b70]'}`}>
            {block.label}
          </p>
          <h2 className="max-w-3xl font-serif text-5xl leading-none tracking-[-0.04em] md:text-7xl">
            {block.heading}
          </h2>
        </div>
        {content.services.length ? (
          <div className="relative">
            <div
              className={`absolute top-4 bottom-4 left-[1.15rem] hidden w-px md:block ${
                isPaper ? 'bg-[#0a2939]/15' : 'bg-white/15'
              }`}
            />
            {content.services.map((service, index) => (
              <article
                className="group relative grid gap-7 py-9 md:grid-cols-[0.28fr_0.78fr_1fr] md:py-12"
                key={service.id}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`relative z-10 grid size-9 place-items-center text-[10px] font-bold ${
                      isPaper ? 'bg-[#0a2939] text-white' : 'bg-[#ff7657] text-[#0a2939]'
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <p
                    className={`pt-2 text-[10px] font-bold tracking-[0.16em] uppercase md:hidden ${
                      isPaper ? 'text-[#b74730]' : 'text-[#ff8b70]'
                    }`}
                  >
                    {service.eyebrow}
                  </p>
                </div>
                <h3 className="font-serif text-4xl tracking-[-0.03em] transition group-hover:text-[#ff7657] md:text-5xl">
                  {service.title}
                </h3>
                <div>
                  <p
                    className={`max-w-xl text-base leading-7 ${isPaper ? 'text-[#49636e]' : 'text-white/65'}`}
                  >
                    {service.summary}
                  </p>
                  {!!service.capabilities?.length && (
                    <ul className="mt-7 flex flex-wrap gap-2">
                      {service.capabilities.map((capability) => (
                        <li
                          className={`border px-4 py-2 text-xs ${
                            isPaper
                              ? 'border-[#0a2939]/20 text-[#31505e]'
                              : 'border-white/20 text-white/75'
                          }`}
                          key={capability.id}
                        >
                          {capability.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
            <div className="mt-8 flex justify-end">
              <FoxGuide
                inverse={!isPaper}
                note="Trace the friction back to people, process, or technology."
              />
            </div>
          </div>
        ) : (
          <p className="border-y border-current/15 py-16 opacity-60">Services are being prepared.</p>
        )}
      </div>
    </section>
  )
}

function CaseStudiesSection({ block, content }: { block: CaseStudies; content: HomepageContent }) {
  const studies = content.caseStudies.slice(0, block.limit ?? 2)

  return (
    <section id="work" className={`px-5 md:px-10 lg:px-16 ${spacing(block.spacing)}`}>
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="section-label mb-6">{block.label}</p>
            <h2 className="font-serif text-5xl tracking-[-0.04em] md:text-7xl">{block.heading}</h2>
          </div>
          {block.body && <p className="max-w-md text-base leading-7 text-[#49636e]">{block.body}</p>}
        </div>
        {studies.length ? (
          <div className="grid gap-16">
            {studies.map((study, index) => (
              <article
                className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
                key={study.id}
              >
                {isMedia(study.artifact) && study.artifact.url && (
                  <figure
                    className={`relative min-h-[28rem] overflow-hidden bg-[#dce8e3] ${
                      index % 2 ? 'lg:order-2' : ''
                    }`}
                  >
                    <Image
                      alt={study.artifact.alt}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      src={study.artifact.url}
                    />
                    <figcaption className="absolute right-0 bottom-0 max-w-xs bg-[#071d29] px-4 py-3 text-[10px] leading-4 tracking-[0.1em] text-white/70 uppercase">
                      Artifact / {study.artifactCaption}
                    </figcaption>
                  </figure>
                )}
                <div className={`p-1 md:p-7 ${index % 2 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center justify-between gap-4 text-[11px] font-bold tracking-[0.18em] uppercase">
                    <span>Case note 0{index + 1}</span>
                    <span className="text-[#58707a]">{study.client}</span>
                  </div>
                  <p className="mt-10 text-[10px] font-bold tracking-[0.16em] text-[#b74730] uppercase">
                    {study.category}
                  </p>
                  <h3 className="mt-4 max-w-xl font-serif text-4xl leading-[1.02] tracking-[-0.03em] md:text-5xl">
                    {study.title}
                  </h3>
                  <p className="mt-6 max-w-xl text-base leading-7 text-[#49636e]">{study.result}</p>
                  {!!study.methodology?.length && (
                    <ol className="mt-8 space-y-4">
                      {study.methodology.map((note, noteIndex) => (
                        <li
                          className="grid grid-cols-[2rem_0.6fr_1fr] gap-3 text-xs leading-5"
                          key={note.id ?? note.label}
                        >
                          <span className="text-[#b74730]">0{noteIndex + 1}</span>
                          <strong className="uppercase tracking-[0.1em]">{note.label}</strong>
                          <span className="text-[#58707a]">{note.detail}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  <div className="mt-10 flex items-end gap-4">
                    <p className="font-serif text-5xl">{study.metric.value}</p>
                    <p className="max-w-40 pb-1 text-[10px] leading-4 tracking-[0.12em] uppercase">
                      {study.metric.label}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="border border-[#0a2939]/15 bg-white/40 p-12 text-[#49636e]">
            Case studies are being prepared.
          </p>
        )}
      </div>
    </section>
  )
}

function TestimonialSection({ block, guide }: { block: Testimonial1; guide?: Media | null }) {
  const testimonial = isTestimonial(block.testimonial) ? block.testimonial : null
  if (!testimonial) return null

  return (
    <section
      className={`px-5 md:px-10 lg:px-16 ${spacing(block.spacing)} ${
        block.theme === 'blue' ? 'bg-[#dce8e3]' : 'bg-[#ff7657]'
      }`}
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.55fr_1.45fr]">
        <div className="flex items-start gap-4">
          <div>
            <p className="section-label mb-6">{block.label}</p>
            <FoxGuide media={guide} note="Listen for what changed in the team’s daily work." />
          </div>
        </div>
        <figure>
          <blockquote className="font-serif text-4xl leading-[1.08] tracking-[-0.035em] md:text-6xl">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="mt-10 border-t border-[#0a2939]/20 pt-6 text-xs font-bold tracking-[0.16em] uppercase">
            {testimonial.attribution}
            <span className="ml-3 font-normal text-[#0a2939]/65">{testimonial.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function InsightsSection({ block, content }: { block: Insights; content: HomepageContent }) {
  const insights = content.insights.slice(0, block.limit ?? 3)

  return (
    <section
      id="insights"
      className={`bg-[#f8f5ee] px-5 md:px-10 lg:px-16 ${spacing(block.spacing)}`}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 flex items-end justify-between gap-8">
          <div>
            <p className="section-label mb-6">{block.label}</p>
            <h2 className="font-serif text-5xl tracking-[-0.04em] md:text-7xl">{block.heading}</h2>
          </div>
          <Link className="hidden items-center gap-3 text-sm font-bold md:flex" href="/#contact">
            Get updates <Arrow className="size-5" />
          </Link>
        </div>
        {insights.length ? (
          <div className="divide-y divide-[#0a2939]/15 border-t border-[#0a2939]/15">
            {insights.map((insight, index) => (
              <article
                className="group grid gap-6 py-8 transition hover:bg-white/70 md:grid-cols-[0.2fr_0.55fr_1.25fr_1fr_auto] md:items-start md:px-5"
                key={insight.id}
              >
                <span className="text-xs font-bold text-[#b74730]">0{index + 1}</span>
                <div className="text-[10px] font-bold tracking-[0.12em] text-[#58707a] uppercase">
                  <time dateTime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time>
                  <span className="mt-2 block">{insight.readingTime}</span>
                </div>
                <h3 className="font-serif text-3xl leading-[1.04] tracking-[-0.03em]">
                  {insight.title}
                </h3>
                <p className="text-sm leading-6 text-[#58707a]">{insight.excerpt}</p>
                <span className="grid size-10 place-items-center transition group-hover:bg-[#ff7657]">
                  <Arrow className="size-4" />
                </span>
              </article>
            ))}
          </div>
        ) : (
          <p className="border border-[#0a2939]/15 p-12 text-[#49636e]">Insights are being prepared.</p>
        )}
      </div>
    </section>
  )
}

function CtaSection({ block, guide }: { block: Cta; guide?: Media | null }) {
  return (
    <section
      id="contact"
      className={`relative overflow-hidden bg-[#0a2939] px-5 text-white md:px-10 lg:px-16 ${spacing(block.spacing)}`}
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="absolute -right-32 -bottom-52 size-[32rem] bg-[#ff7657]" />
      <div className="relative mx-auto max-w-[1440px]">
        <p className="section-label text-[#ff8b70]">{block.label}</p>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <h2 className="max-w-5xl font-serif text-6xl leading-[0.9] tracking-[-0.05em] md:text-8xl lg:text-[8rem]">
            {block.heading}
          </h2>
          <div className="relative z-10">
            <p className="mb-8 max-w-sm text-lg leading-8 text-white/65">{block.body}</p>
            <a
              className="inline-flex items-center gap-5 border border-white bg-white px-7 py-4 font-bold text-[#0a2939] transition hover:border-[#ff7657] hover:bg-[#ff7657]"
              href={block.buttonHref}
            >
              {block.buttonLabel} <Arrow className="size-5" />
            </a>
            <div className="mt-12">
              <FoxGuide
                inverse
                media={guide}
                note="Bring the messy version. That is usually where the useful work starts."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#071d29] px-5 py-10 text-white md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link className="relative h-20 w-44 shrink-0" href="/" aria-label="Fox Consulting Group home">
          <Image
            alt="Fox Consulting Group"
            className="object-contain"
            fill
            sizes="176px"
            src="/brand/fox-logo-white.webp"
          />
        </Link>
        <div className="flex flex-wrap gap-6 text-xs text-white/55">
          <a
            className="hover:text-white"
            href="https://www.linkedin.com/company/fox-digital-consulting-group"
          >
            LinkedIn
          </a>
          <a className="hover:text-white" href="https://www.instagram.com/foxconsultinggroup/">
            Instagram
          </a>
          <Link className="hover:text-white" href="/admin">
            CMS Admin
          </Link>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} Fox Consulting Group</p>
      </div>
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
  const guideBlock = homepage.sections?.find((block) => block.blockType === 'intro')
  const guide =
    guideBlock?.blockType === 'intro' && isMedia(guideBlock.characterImage)
      ? guideBlock.characterImage
      : null

  return (
    <main className="overflow-hidden bg-[#f4efe5] text-[#0a2939]">
      <Header servicePages={initialContent.servicePages} />
      {homepage.sections?.length ? (
        homepage.sections.map((block, index) => {
          const key = block.id ?? `${block.blockType}-${index}`

          switch (block.blockType) {
            case 'hero':
              return <HeroSection block={block} guide={guide} key={key} />
            case 'intro':
              return <IntroSection block={block} key={key} />
            case 'imageBreak':
              return <ImageBreakSection block={block} key={key} />
            case 'services':
              return <ServicesSection block={block} content={initialContent} key={key} />
            case 'caseStudies':
              return <CaseStudiesSection block={block} content={initialContent} key={key} />
            case 'testimonial':
              return <TestimonialSection block={block} guide={guide} key={key} />
            case 'insights':
              return <InsightsSection block={block} content={initialContent} key={key} />
            case 'cta':
              return <CtaSection block={block} guide={guide} key={key} />
            default:
              return null
          }
        })
      ) : (
        <section className="min-h-screen bg-[#0a2939] px-5 pt-48 text-white md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1440px] border border-white/20 p-10">
            <p className="section-label text-[#ff8b70]">Homepage Builder</p>
            <h1 className="mt-4 font-serif text-5xl">
              Add your first section in Payload — or run <code>pnpm seed</code>.
            </h1>
          </div>
        </section>
      )}
      <Footer />
    </main>
  )
}
