import { Megaphone } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { getAdvertisePageContent } from '@/services/cms'

export default function AdvertisePage() {
  const content = getAdvertisePageContent()

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="border-neutral-200">
        <CardContent className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">{content.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-neutral-950">{content.title}</h1>
          <div className="mt-5 flex items-start gap-3 rounded-[2px] border border-neutral-200 bg-neutral-50 p-4 text-sm leading-7 text-neutral-600">
            <Megaphone className="mt-1 h-5 w-5 shrink-0 text-[#0a8f07]" />
            <p>{content.paragraphs[0]}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
