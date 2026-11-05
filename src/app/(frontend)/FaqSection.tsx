import { Container, Label, serif } from './ui'

export type FaqItem = { question: string; answer: string; id?: string | null }

/**
 * Questions as native <details> disclosures: keyboard and screen-reader friendly with no JS,
 * and every answer stays in the HTML for search engines and AI crawlers.
 */
export function FaqSection({
  items,
  label = 'FAQ',
  heading = 'Common questions.',
  className = 'py-24 md:py-32',
}: {
  items: FaqItem[]
  label?: string
  heading?: string
  className?: string
}) {
  if (!items.length) return null
  return (
    <section id="faq" className={`border-t border-[#0a2939]/10 bg-[#f8f5ee] ${className}`}>
      <Container className="flex flex-wrap items-start gap-x-16 gap-y-10">
        <div className="min-w-0 flex-[1_1_320px] lg:sticky lg:top-28" data-reveal>
          <Label>{label}</Label>
          <h2 className={`${serif} text-5xl leading-[1.02] md:text-[56px]`}>{heading}</h2>
        </div>
        <div className="min-w-0 flex-[1_1_560px] border-b border-[#0a2939]/20" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          {items.map((item) => (
            <details className="group border-t border-[#0a2939]/20" data-faq key={item.id ?? item.question}>
              <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-6 text-left text-xl leading-[1.35] font-bold text-[#0a2939] marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 size-5 shrink-0 text-[#b74730] transition group-open:rotate-45"
                >
                  <span className="absolute top-1/2 left-0 h-0.5 w-5 -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-5 w-0.5 -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <p className="faq-answer max-w-[640px] pb-7 text-lg leading-[1.65] whitespace-pre-line text-[#49636e]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
