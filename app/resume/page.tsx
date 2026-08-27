import Link from "next/link"

import { getResumeData } from "@/lib/get-resume-data"
import { cn } from "@/lib/utils"

import { ArticleContent } from "@/components/app/article-content"
import { ResumeActions } from "@/components/app/resume-actions"
import { Icons } from "@/components/shared/icons"

const NETWORK_ICONS: Record<string, keyof typeof Icons> = {
  github: "github",
  linkedin: "linkedin",
  twitter: "x",
  x: "x",
  instagram: "instagram",
  facebook: "facebook",
  spotify: "spotify",
}

function networkIcon(network: string) {
  const Icon = Icons[NETWORK_ICONS[network.toLowerCase()] ?? "globe"]
  return <Icon className="size-4 shrink-0" aria-hidden />
}

function Html({ html, className }: { html: string; className?: string }) {
  // Trusted content: authored by the site owner via their own Reactive
  // Resume account, same trust boundary as the MDX case-study content
  // rendered elsewhere -- not user-submitted input.
  return (
    <div
      className={cn(
        "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-border mb-4 border-b pb-1.5 text-base font-bold tracking-tight sm:text-lg">
      {children}
    </h2>
  )
}

/** Title (bold) + date (muted, smaller) -- stacked on mobile, side by side from sm: up. */
function ItemHeader({
  title,
  date,
}: {
  title: React.ReactNode
  date?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
      <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
      {date && (
        <span className="text-muted-foreground shrink-0 text-xs print:text-black sm:text-sm">
          {date}
        </span>
      )}
    </div>
  )
}

export async function generateMetadata() {
  const resumeData = await getResumeData()

  return {
    title: "Resume",
    description: `${resumeData.basics.name} — ${resumeData.basics.headline}`,
  }
}

export default async function ResumePage() {
  const resumeData = await getResumeData()
  const { basics, summary, sections } = resumeData

  return (
    <div className="container max-w-3xl px-4 py-10 sm:py-16 md:py-24 print:max-w-none print:py-0">
      <ResumeActions />

      <ArticleContent className="print:text-black">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {basics.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-base print:text-black sm:text-lg">
            {basics.headline}
          </p>

          <div className="text-muted-foreground mt-4 flex flex-col gap-1.5 text-sm print:text-black sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
            {basics.location && (
              <span className="inline-flex items-center gap-1.5">
                <Icons.location className="size-4 shrink-0" aria-hidden />
                {basics.location}
              </span>
            )}
            {basics.email && (
              <a
                href={`mailto:${basics.email}`}
                className="hover:text-foreground inline-flex items-center gap-1.5"
              >
                <Icons.mail className="size-4 shrink-0" aria-hidden />
                {basics.email}
              </a>
            )}
            {basics.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Icons.phone className="size-4 shrink-0" aria-hidden />
                {basics.phone}
              </span>
            )}
            {basics.website?.url && (
              <a
                href={basics.website.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground inline-flex items-center gap-1.5"
              >
                <Icons.globe className="size-4 shrink-0" aria-hidden />
                {basics.website.label || basics.website.url}
              </a>
            )}
            {sections.profiles.items
              .filter((item) => !item.hidden)
              .map((item) => (
                <a
                  key={item.id}
                  href={item.website.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground inline-flex items-center gap-1.5"
                >
                  {networkIcon(item.network)}
                  {item.username}
                </a>
              ))}
          </div>
        </header>

        {summary?.content && (
          <section className="mb-8 sm:mb-10">
            <Html html={summary.content} className="text-sm sm:text-base" />
          </section>
        )}

        {sections.experience.items.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-5 sm:space-y-6">
              {sections.experience.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <div key={item.id}>
                    <ItemHeader
                      title={`${item.position} · ${item.company}`}
                      date={item.period}
                    />
                    {item.location && (
                      <p className="text-muted-foreground text-xs print:text-black sm:text-sm">
                        {item.location}
                      </p>
                    )}
                    {item.description && (
                      <Html
                        html={item.description}
                        className="text-muted-foreground mt-1.5 text-sm print:text-black"
                      />
                    )}
                    {item.roles && item.roles.length > 0 && (
                      <div className="mt-3 space-y-3 border-l pl-3 sm:pl-4">
                        {item.roles.map((role) => (
                          <div key={role.id}>
                            <ItemHeader
                              title={
                                <span className="font-medium">
                                  {role.position}
                                </span>
                              }
                              date={role.period}
                            />
                            {role.description && (
                              <Html
                                html={role.description}
                                className="text-muted-foreground mt-1 text-sm print:text-black"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {sections.education.items.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-4">
              {sections.education.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <div key={item.id}>
                    <ItemHeader
                      title={
                        <>
                          {item.degree}
                          {item.area ? `, ${item.area}` : ""} · {item.school}
                        </>
                      }
                      date={item.period}
                    />
                    {item.grade && (
                      <p className="text-muted-foreground text-xs print:text-black sm:text-sm">
                        {item.grade}
                      </p>
                    )}
                    {item.description && (
                      <Html
                        html={item.description}
                        className="text-muted-foreground mt-1.5 text-sm print:text-black"
                      />
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {sections.projects.items.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-4">
              {sections.projects.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <div key={item.id}>
                    <ItemHeader
                      title={
                        item.website?.url ? (
                          <Link
                            href={item.website.url}
                            target="_blank"
                            className="hover:underline"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )
                      }
                      date={item.period}
                    />
                    {item.description && (
                      <Html
                        html={item.description}
                        className="text-muted-foreground mt-1.5 text-sm print:text-black"
                      />
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {sections.skills.items.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <SectionTitle>Skills</SectionTitle>
            <div className="space-y-2">
              {sections.skills.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <p key={item.id} className="text-sm">
                    <span className="font-semibold">{item.name}:</span>{" "}
                    <span className="text-muted-foreground print:text-black">
                      {(item.keywords ?? []).join(", ")}
                    </span>
                  </p>
                ))}
            </div>
          </section>
        )}

        {sections.awards.items.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <SectionTitle>Awards</SectionTitle>
            <div className="space-y-3">
              {sections.awards.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <div key={item.id}>
                    <ItemHeader
                      title={`${item.title} · ${item.awarder}`}
                      date={item.date}
                    />
                    {item.description && (
                      <Html
                        html={item.description}
                        className="text-muted-foreground mt-1.5 text-sm print:text-black"
                      />
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {sections.certifications.items.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <SectionTitle>Certifications</SectionTitle>
            <div className="space-y-3">
              {sections.certifications.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <div key={item.id}>
                    <ItemHeader
                      title={`${item.title} · ${item.issuer}`}
                      date={item.date}
                    />
                    {item.description && (
                      <Html
                        html={item.description}
                        className="text-muted-foreground mt-1.5 text-sm print:text-black"
                      />
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}
      </ArticleContent>
    </div>
  )
}
