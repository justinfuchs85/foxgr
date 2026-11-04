'use client'

import { useEffect, useRef, useState } from 'react'

type Stat = { id?: string | null; value: string; label: string }

// "15+" → { prefix: '', target: 15, suffix: '+' }. Values with a second number
// in them ("1:1") don't count; they just reveal.
const parse = (value: string) => {
  const m = value.match(/^(\D*?)(\d+(?:\.\d+)?)(\D*)$/)
  if (!m) return null
  return {
    prefix: m[1],
    target: Number(m[2]),
    suffix: m[3],
    decimals: (m[2].split('.')[1] ?? '').length,
  }
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function CountUp({ value, start, delay }: { value: string; start: boolean; delay: number }) {
  // Server render and no-JS visitors get the real value.
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const parsed = parse(value)
    if (!start || !parsed || prefersReducedMotion()) {
      setDisplay(value)
      return
    }

    const { prefix, target, suffix, decimals } = parsed
    // A zero counts *down* to nothing, which is the whole point of that stat.
    const from = target === 0 ? 9 : 0
    const duration = target === 0 ? 1500 : 1900
    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`

    let frame = 0
    let t0 = 0
    const tick = (now: number) => {
      if (!t0) t0 = now
      const t = Math.min(1, Math.max(0, (now - t0 - delay) / duration))
      setDisplay(format(from + (target - from) * easeOutExpo(t)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    setDisplay(format(from))
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, value, delay])

  return <>{display}</>
}

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={inView ? 'in' : 'out'}
      className="stats mx-auto grid max-w-[1440px] grid-cols-2 px-5 md:grid-cols-4 md:px-10 lg:px-16"
    >
      {stats.map((stat, index) => (
        <div
          className="stat py-6 pr-4 pl-4 first:pl-0 md:py-8 md:pl-8"
          key={stat.id ?? `${stat.label}-${index}`}
          style={{ '--i': index } as React.CSSProperties}
        >
          <span aria-hidden="true" className="stat-rule" />
          <p className="font-serif text-3xl text-[#ff8467] tabular-nums md:text-4xl">
            <span className="sr-only">{stat.value}</span>
            <span aria-hidden="true">
              <CountUp value={stat.value} start={inView} delay={320 + index * 140} />
            </span>
          </p>
          <p className="mt-1 text-[11px] leading-4 tracking-[0.12em] text-white/55 uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
