import Link from "next/link"

interface Direct {
  href: string
  text: string
  icon?: React.ReactNode
}

interface SectionHeadingProps {
  title: string
  description?: string
  direct?: Direct
}

export function SectionHeading({
  title,
  description,
  direct,
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="mb-2 text-3xl font-bold">{title}</h2>
        {description && <p className="text-slate-300">{description}</p>}
      </div>
      {direct && (
        <Link
          href={direct.href}
          className="flex items-center gap-2 hover:underline"
        >
          {direct.icon}
          {direct.text}
        </Link>
      )}
    </div>
  )
}
