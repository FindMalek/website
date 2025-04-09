import { ModeToggle } from "@/components/shared/mode-toggle"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto w-full border-t py-8 px-2">
      <div className="container flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          © {currentYear} Malek Gara-Hellal. All rights reserved.
        </p>
        <ModeToggle />
      </div>
    </footer>
  )
}
