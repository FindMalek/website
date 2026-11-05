import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { RAMPS } from "@/lib/dither/glyphs"
import { BRAND_STOPS } from "@/lib/wordmark-canvas"

import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/app/panel"
import { AsciiText } from "@/components/dither/ascii-text"
import { BayerGrid } from "@/components/dither/lab/bayer-grid"
import { GradientStrip, type StripMode } from "@/components/dither/lab/gradient-strip"
import { ImageLab } from "@/components/dither/lab/image-lab"
import {
  AsciiPreview,
  FieldPreview,
  GalaxyPreview,
  IconPreview,
  ImagePreview,
} from "@/components/dither/lab/component-previews"
import { CopySnippet } from "@/components/dither/lab/copy-snippet"
import { OceanLab } from "@/components/dither/lab/ocean-lab"
import { Playground } from "@/components/dither/lab/playground"

const DESCRIPTION =
  "The dither design system behind this site: ordered dithering, glyph ramps and a brand gradient, with live controls."

export const metadata: Metadata = {
  title: "System",
  description: DESCRIPTION,
  alternates: { canonical: "/system" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/system`,
    title: "System | Malek Gara-Hellal",
    description: DESCRIPTION,
    images: [{ url: siteConfig.images.default, alt: siteConfig.name }],
  },
}

const INDEX = [
  { id: "principles", label: "principles" },
  { id: "foundations", label: "foundations" },
  { id: "playground", label: "playground" },
  { id: "image-lab", label: "image lab" },
  { id: "ocean", label: "ocean" },
  { id: "components", label: "components" },
  { id: "sources", label: "sources" },
  { id: "tokens", label: "tokens" },
] as const

const SOURCES = [
  {
    name: "Profile README generator",
    href: "https://github.com/FindMalek/FindMalek",
    took: "The aurora, exactly: four noise curtains, a 4x4 Bayer threshold, six palette steps, 4px cells, a 9 second ping-pong loop.",
  },
  {
    name: "ascii-sharks",
    href: "https://github.com/stackedlol/ascii-sharks",
    took: "The behaviour model (MIT): boid schools whose alarm spreads fish to fish, sharks that hunt and bend a spine, a wake field that diffuses like ripples, single-glyph fish, skin that is sparse where lit and dense in shadow.",
  },
  {
    name: "ascii-magic",
    href: "https://www.ascii-magic.com/ascii",
    took: "The idea of a look (MIT): one scene redrawn in another character set, shaded by how much ink a glyph covers, plus the halftone and Bayer dither treatments behind the image lab.",
  },
] as const

const PRINCIPLES = [
  {
    name: "Tone is a threshold",
    body: "Every gradient is quantized against a Bayer matrix. No smooth fills, no banding, just stipple that holds its shape at any size.",
  },
  {
    name: "Motion has a tempo",
    body: "Canvases tick at 10 to 30 fps on purpose. One shared frame loop drives all of them, and anything off screen sleeps.",
  },
  {
    name: "Colour is a ramp",
    body: "The brand gradient is sampled by position and level. Dark mode glows, light mode inks, from the same four stops.",
  },
  {
    name: "Reduced motion is a still",
    body: "The same frame, frozen. People who opt out get the picture, not an empty box.",
  },
] as const

const STRIPS: { mode: StripMode; label: string; note: string }[] = [
  { mode: "threshold", label: "threshold", note: "one cut at 50%, hard banding" },
  { mode: "noise", label: "white noise", note: "random, clumps and gaps" },
  { mode: "bayer2", label: "bayer 2×2", note: "coarse and regular" },
  { mode: "bayer4", label: "bayer 4×4", note: "the workhorse" },
  { mode: "bayer8", label: "bayer 8×8", note: "finest, least visible grid" },
]

const COMPONENTS = [
  {
    name: "DitherField",
    body: "A live aurora on a low-resolution canvas, scaled up pixelated. The pointer lights it, a click sends a ripple.",
    preview: <FieldPreview />,
    code: `<DitherField\n  cell={4} levels={5} fade="bottom"\n  className="absolute inset-0 size-full"\n/>`,
  },
  {
    name: "AsciiText",
    body: "Text rasterized into a glyph grid, shaded through a Bayer threshold. Letters scatter from the pointer and spring back.",
    preview: <AsciiPreview />,
    code: `<AsciiText text="Malek" ramp="ascii" className="h-72" />`,
  },
  {
    name: "DitherGalaxy",
    body: "The home hero: a spiral galaxy as a density field. Drag to spin it, tap to send a shockwave, move the pointer through it to bend the light.",
    preview: <GalaxyPreview />,
    code: `<DitherGalaxy className="absolute inset-0" />`,
  },
  {
    name: "SoundIcon",
    body: "Pixel icons are drawn on a grid and their soft parts are dithered with the same Bayer matrix as the scenes.",
    preview: <IconPreview />,
    code: `<SoundIcon playing />`,
  },
  {
    name: "DitherOcean",
    body: "The home banner: the README aurora with a school and sharks swimming through it. Pass look to redraw it in another character set.",
    preview: null,
    code: `<DitherOcean look="ascii" className="absolute inset-0" />`,
  },
  {
    name: "DitherImage",
    body: "A duotone dither veil over an image. Hover the host, or any parent marked data-dither-group, and the veil dissolves in stepped Bayer density. Pass reveal to dissolve once on load.",
    preview: <ImagePreview />,
    code: `<DitherImage src="/cover.png">\n  <Image src="/cover.png" alt="" fill />\n</DitherImage>`,
  },
] as const

const TOKENS = [
  { name: "--dither-px", value: "2px", note: "size of one dither dot in the CSS veil and ground" },
  { name: ".dither-veil", value: "mask", note: "Bayer mask that steps down on hover" },
  { name: ".dither-hover", value: "fill", note: "hover and focus: the element's own colour stipples in, density stepping up" },
  { name: ".dither-active", value: "fill", note: "the selected state: a fixed 50% stipple (used by the nav)" },
  { name: ".scene-text / .scene-halo", value: "halo", note: "text over a scene: a halo in the page colour, no box" },
  { name: "--radius", value: "0", note: "every corner is square; shadows are flat, set at the theme level" },
  { name: ".stripe-divider", value: "rule", note: "the section divider: a static 1px Bayer stipple, no canvas" },
  { name: ".pixelated", value: "utility", note: "image-rendering: pixelated for scaled canvases" },
] as const

function Section({
  id,
  title,
  count,
  description,
  children,
}: {
  id: string
  title: string
  count?: number
  description: string
  children: React.ReactNode
}) {
  return (
    <>
      <div className="stripe-divider" />
      <Panel id={id}>
        <PanelHeader>
          <PanelTitle>
            {title}
            {count !== undefined && <PanelTitleSup>({count})</PanelTitleSup>}
          </PanelTitle>
          <PanelDescription>{description}</PanelDescription>
        </PanelHeader>
        <PanelContent className="space-y-6 p-4">{children}</PanelContent>
      </Panel>
    </>
  )
}

export default function SystemPage() {
  return (
    <div className="w-full pt-20 md:pt-12">
      <Panel>
        <div className="px-4 pb-6 pt-16">
          <h1 className="sr-only">Dither</h1>
          <AsciiText text="Dither" decorative className="h-48 w-full sm:h-64" />
          <p className="text-muted-foreground mt-4 max-w-xl text-pretty">
            The visual system behind this site. Ordered dithering, glyph ramps
            and one brand gradient, drawn on a shared frame loop. Everything
            below is live.
          </p>
          <nav aria-label="On this page" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            {INDEX.map((item, i) => (
              <a key={item.id} href={`#${item.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {item.label}
              </a>
            ))}
          </nav>
        </div>
      </Panel>

      <Section
        id="principles"
        title="Principles"
        count={PRINCIPLES.length}
        description="Four rules every surface follows."
      >
        <ol className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <li key={p.name} className="border-line rounded-lg border p-4">
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-semibold">{p.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm text-pretty">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="foundations"
        title="Foundations"
        description="The three raw materials: threshold matrices, a colour ramp, glyph ramps."
      >
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider">bayer matrices</h3>
          <p className="text-muted-foreground text-sm text-pretty">
            A cell turns on when its tone beats the number in the matrix. Bigger
            matrices have more steps, so the pattern gets finer.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {([2, 4, 8] as const).map((size) => (
              <figure key={size} className="space-y-2">
                <BayerGrid size={size} />
                <figcaption className="text-muted-foreground font-mono text-xs">
                  {size}×{size}, {size * size} steps
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider">one gradient, five strategies</h3>
          <div className="space-y-3">
            {STRIPS.map((s) => (
              <div key={s.mode} className="space-y-1">
                <GradientStrip mode={s.mode} />
                <p className="text-muted-foreground font-mono text-xs">
                  {s.label}, {s.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider">brand ramp</h3>
          <div className="grid grid-cols-4 overflow-hidden rounded-lg">
            {BRAND_STOPS.map((stop) => (
              <div key={stop} className="flex h-16 items-end p-2" style={{ background: stop }}>
                <span className="bg-background/80 rounded-sm px-1 font-mono text-xs">{stop}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider">glyph ramps</h3>
          <ul className="space-y-2">
            {Object.entries(RAMPS).map(([name, chars]) => (
              <li key={name} className="flex items-baseline gap-4">
                <span className="text-muted-foreground w-14 shrink-0 font-mono text-xs">{name}</span>
                <span className="whitespace-pre font-mono text-lg tracking-widest">{chars}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        id="playground"
        title="Playground"
        description="Change the system and watch it re-render. Move the pointer over the canvas, click it."
      >
        <Playground />
      </Section>

      <Section
        id="image-lab"
        title="Image lab"
        description="Drop an image on the canvas or upload one. It never leaves your browser."
      >
        <ImageLab />
      </Section>

      <Section
        id="ocean"
        title="Ocean"
        description="The banner on the home page. The README aurora is the water; the school and sharks swim through it and their wakes brighten the dither. Scare the fish with the pointer, click to splash."
      >
        <OceanLab />
      </Section>

      <Section
        id="components"
        title="Components"
        count={COMPONENTS.length}
        description="The canvas pieces behind the lab. Each respects reduced motion and pauses off screen."
      >
        <div className="grid gap-4">
          {COMPONENTS.map((c) => (
            <article key={c.name} className="space-y-2">
              <h3 className="font-mono text-sm font-semibold">{c.name}</h3>
              <p className="text-muted-foreground text-sm text-pretty">{c.body}</p>
              {c.preview}
              <CopySnippet>{c.code}</CopySnippet>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="sources"
        title="Sources"
        count={SOURCES.length}
        description="What each reference contributed. The code here is a fresh implementation, with their techniques credited."
      >
        <ul className="divide-line divide-y">
          {SOURCES.map((s) => (
            <li key={s.name} className="space-y-1 py-3">
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-sm font-semibold underline underline-offset-4"
              >
                {s.name}
              </a>
              <p className="text-muted-foreground text-sm text-pretty">{s.took}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="tokens"
        title="Tokens"
        count={TOKENS.length}
        description="CSS-side hooks, for when a canvas is overkill."
      >
        <dl className="divide-line divide-y">
          {TOKENS.map((t) => (
            <div key={t.name} className="grid gap-1 py-2 sm:grid-cols-6 sm:gap-4">
              <dt className="font-mono text-sm sm:col-span-2">{t.name}</dt>
              <dd className="text-muted-foreground font-mono text-xs sm:pt-0.5">{t.value}</dd>
              <dd className="text-muted-foreground text-sm sm:col-span-3">{t.note}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  )
}
