import { isValidElement } from "react"
import Image from "next/image"

import { CodeBlock } from "@/components/blog/code-block"

function getText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(getText).join("")
  if (isValidElement<{ children?: React.ReactNode }>(node)) {
    return getText(node.props.children)
  }
  return ""
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function createHeading(Tag: "h2" | "h3") {
  function Heading({ children, ...props }: React.ComponentProps<"h2">) {
    const id = slugify(getText(children))
    return (
      <Tag id={id} className="group/heading" {...props}>
        {children}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="heading-anchor text-muted-foreground hover:text-foreground ml-2 font-normal no-underline opacity-0 transition-opacity focus-visible:opacity-100 group-hover/heading:opacity-100"
        >
          #
        </a>
      </Tag>
    )
  }
  return Heading
}

// Markdown images sit inside a <p>, so the caption (the image's markdown
// title, `![alt](src "caption")`) uses spans rather than figure/figcaption.
function PostImage({ src, alt, title }: React.ComponentProps<"img">) {
  if (typeof src !== "string") return null

  const imageClassName = "border-line m-0 h-auto w-full rounded-lg border"

  return (
    <span className="my-8 block">
      {src.startsWith("/") ? (
        <Image
          src={src}
          alt={alt ?? ""}
          width={1200}
          height={630}
          sizes="(min-width: 1280px) 736px, (min-width: 768px) 640px, 100vw"
          className={imageClassName}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- remote hosts aren't in images.remotePatterns
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className={imageClassName}
        />
      )}
      {title && (
        <span className="text-muted-foreground mt-3 block text-center text-sm">
          {title}
        </span>
      )}
    </span>
  )
}

function Table(props: React.ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="my-0" {...props} />
    </div>
  )
}

export const POST_MDX_COMPONENTS = {
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  pre: CodeBlock,
  img: PostImage,
  table: Table,
}
