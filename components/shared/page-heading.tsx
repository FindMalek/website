import { cn } from "@/lib/utils"

interface PageHeadingProps {
  title?: string
  heading: string
  className?: string
  headingClassName?: string
  titleClassName?: string
  bgClassName?: string
}

export function PageHeading({
  title,
  heading,
  className,
  headingClassName,
  titleClassName,
  bgClassName,
}: PageHeadingProps) {
  return (
    <section className={cn("w-full py-16 md:py-24", bgClassName)}>
      <div className={cn("container mx-auto", className)}>
        <div className="max-w-4xl">
          {title && (
            <h2 className={cn("mb-1 text-base font-medium", titleClassName)}>
              {title}
            </h2>
          )}
          <h1
            className={cn(
              "text-2xl font-bold leading-tight sm:text-3xl md:leading-snug xl:text-4xl",
              headingClassName
            )}
          >
            {heading}
          </h1>
        </div>
      </div>
    </section>
  )
}
