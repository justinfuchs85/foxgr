import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center bg-[#0a2939] px-5 text-white md:px-10 lg:px-16">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto w-full max-w-[1440px]">
        <p className="section-label text-[#ff8b70]">404 / Off the map</p>
        <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[0.9] tracking-[-0.05em] md:text-8xl">
          This trail doesn’t go anywhere.
        </h1>
        <Link
          className="mt-10 inline-flex items-center gap-4 border border-white/35 px-6 py-3 text-sm font-bold transition hover:border-[#ff7657] hover:bg-[#ff7657] hover:text-[#0a2939]"
          href="/"
        >
          Back to the homepage
        </Link>
      </div>
    </main>
  )
}
