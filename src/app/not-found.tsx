import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-4 py-16 text-center sm:px-6">
      <div className="w-full rounded-[2px] border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-neutral-950">Story not found</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          The article or category you requested does not exist in this edition.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  )
}
