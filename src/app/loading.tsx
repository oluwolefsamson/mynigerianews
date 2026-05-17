export default function Loading() {
  return (
    <main
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-12 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex flex-col items-center gap-5">
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.16),_transparent_70%)] blur-3xl" />
        <img
          src="/logo.png"
          alt="MyNigeria News"
          className="h-auto w-[180px] animate-pulse object-contain opacity-95 sm:w-[220px]"
        />
        <span className="sr-only">Loading content</span>
      </div>
    </main>
  )
}
