import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXContent } from "@content-collections/mdx/react"
import { allRecommendations } from "content-collections"

import {
  convertRecommendationRelationship,
  convertRecommendationSource,
} from "@/config/converter"
import { link as linkStyle } from "@/config/styles"
import { cn, getInitials } from "@/lib/utils"

import { ArticleContent } from "@/components/app/article-content"
import { RecommendationPrintButton } from "@/components/app/recommendation-print-button"
import { Icons } from "@/components/shared/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

interface RecommendationPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allRecommendations.map((recommendation) => ({
    slug: recommendation.href.split("/").pop(),
  }))
}

export async function generateMetadata({ params }: RecommendationPageProps) {
  const { slug } = await params
  const recommendation = allRecommendations.find(
    (recommendation) => recommendation.href === `/recommendations/${slug}`
  )

  if (!recommendation) {
    notFound()
  }

  const { recommenderName, role, company, excerpt } = recommendation

  return {
    title: `Recommendation from ${recommenderName}`,
    description: excerpt || `${role} at ${company} on working with Malek.`,
  }
}

export default async function RecommendationPage({
  params,
}: RecommendationPageProps) {
  const { slug } = await params

  const recommendation = allRecommendations.find(
    (recommendation) => recommendation.href === `/recommendations/${slug}`
  )

  if (!recommendation) {
    notFound()
  }

  const {
    recommenderName,
    role,
    company,
    companyLogo,
    photo,
    date,
    relationship,
    source,
    linkedinUrl,
    otherLinks,
    signatureImage,
    html,
    isPlaceholder,
  } = recommendation

  return (
    <div className="container max-w-3xl px-4 py-16 md:py-24 print:max-w-none print:py-8">
      <div className="relative mx-auto">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "absolute -top-8 left-0 print:hidden"
          )}
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Back to site
        </Link>

        {isPlaceholder && (
          <div className="border-destructive/40 bg-destructive/5 text-destructive mb-8 rounded-lg border px-4 py-3 text-sm print:hidden">
            This is a structural placeholder used to demonstrate the
            recommendations system. It is not a real recommendation from a real
            person -- see{" "}
            <a
              href="https://github.com/findmalek/website/issues/65"
              target="_blank"
              rel="noopener"
              className={linkStyle}
            >
              issue #65
            </a>
            .
          </div>
        )}

        <header className="mb-10 flex flex-col items-center gap-4 text-center">
          <Avatar className="size-20">
            {photo && <AvatarImage src={photo} alt={recommenderName} />}
            <AvatarFallback className="text-xl font-medium">
              {getInitials(recommenderName)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold">{recommenderName}</h1>
            <p className="text-muted-foreground mt-1 text-base">
              {role} at {company}
            </p>
          </div>

          {companyLogo && (
            <div className="border-border relative size-8 overflow-hidden rounded-md border">
              <Image
                src={companyLogo}
                alt={`${company} logo`}
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-2 text-sm">
            <Badge variant="secondary">
              {convertRecommendationRelationship(relationship)}
            </Badge>
            <span>•</span>
            <span>via {convertRecommendationSource(source)}</span>
            <span>•</span>
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            {linkedinUrl && (
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener"
                aria-label={`${recommenderName} on LinkedIn`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icons.linkedin className="size-4" />
              </Link>
            )}

            {otherLinks?.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener"
                className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <RecommendationPrintButton />
          </div>
        </header>

        <ArticleContent className="prose prose-gray dark:prose-invert print:prose-sm mx-auto max-w-none">
          <MDXContent code={html} />
        </ArticleContent>

        {signatureImage && (
          <div className="mt-12 flex flex-col items-center gap-2">
            <div className="relative h-16 w-40">
              <Image
                src={signatureImage}
                alt={`${recommenderName}'s signature`}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-muted-foreground text-xs">
              Signature provided and approved by {recommenderName}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
