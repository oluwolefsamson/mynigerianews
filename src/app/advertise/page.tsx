import { Briefcase, CarFront, Megaphone, Search } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { getAdvertisePageContent } from '@/services/cms'

export default function AdvertisePage() {
  const content = getAdvertisePageContent()

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
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

        <Card className="border-neutral-200 bg-neutral-950 text-white">
          <CardContent className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fe67a]">Available placements</p>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Choose the audience and context that fits your campaign. These banner options can be adapted for news,
              hiring and travel businesses.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { icon: Search, title: 'News platform', description: 'Homepage, category and article banners.' },
                { icon: Briefcase, title: 'Job platform', description: 'Recruitment and career promotion ads.' },
                { icon: CarFront, title: 'Car rental platform', description: 'Travel and mobility booking banners.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-[2px] border border-white/10 bg-white/5 p-4">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#7fe67a]" />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">More banner options</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-neutral-950">
              Other ad banners we can place for you
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {content.placements.map((placement, index) => {
            const icons = [Search, Briefcase, CarFront] as const
            const Icon = icons[index] ?? Search

            return (
              <Card key={placement.title} className="border-neutral-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                        {placement.label}
                      </span>
                      <div>
                        <p className="text-base font-semibold tracking-[-0.02em] text-neutral-950">{placement.title}</p>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">{placement.description}</p>
                      </div>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0a8f07]/10">
                      <Icon className="h-5 w-5 text-[#0a8f07]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
