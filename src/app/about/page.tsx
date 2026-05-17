import { Card, CardContent } from '@/components/ui/card'
import { getAboutPageContent } from '@/services/cms'

export default function AboutPage() {
  const content = getAboutPageContent()

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="border-neutral-200">
        <CardContent className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a8f07]">{content.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-neutral-950">{content.title}</h1>
          <div className="mt-5 space-y-4 text-sm leading-7 text-neutral-600">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
