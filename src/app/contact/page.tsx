import { Mail, MapPin, Phone } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { getContactPageContent } from '@/services/cms'

export default function ContactPage() {
  const content = getContactPageContent()

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="border-neutral-200">
          <CardContent className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">{content.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-neutral-950">{content.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
              {content.paragraphs[0]}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2px] border border-neutral-200 p-4">
                <Mail className="h-5 w-5 text-[#0a8f07]" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">Email</p>
                <p className="text-sm text-neutral-600">{content.email}</p>
              </div>
              <div className="rounded-[2px] border border-neutral-200 p-4">
                <Phone className="h-5 w-5 text-[#0a8f07]" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">Phone</p>
                <p className="text-sm text-neutral-600">{content.phone}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[2px] border border-neutral-200 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#0a8f07]" />
                <div>
                  <p className="text-sm font-semibold text-neutral-950">Office</p>
                  <p className="text-sm leading-7 text-neutral-600">{content.office}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="overflow-hidden border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-3">
              <h2 className="section-title text-sm font-semibold uppercase text-neutral-950">Location Map</h2>
            </div>
            <div className="relative aspect-[4/4.2] bg-neutral-100">
              <iframe
                title="MyNigeriaNews office map"
                src={content.mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <Card className="border-neutral-200">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">Hours</p>
              <p className="mt-2 text-sm leading-7 text-neutral-600">{content.hours}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
