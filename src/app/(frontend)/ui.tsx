// Shared building blocks for every frontend page: one label style, one container,
// one arrow, one display type setting.

export const Arrow = ({ className = '' }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
)

export const Label = ({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) => (
  <p
    className={`mb-6 text-[13px] font-bold tracking-[0.18em] uppercase ${
      inverse ? 'text-[#ff8b70]' : 'text-[#b74730]'
    }`}
  >
    {children}
  </p>
)

export const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1200px] px-5 md:px-8 ${className}`}>{children}</div>
)

export const serif = 'font-serif font-medium tracking-[-0.03em]'
