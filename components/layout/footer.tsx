import { ModeToggle } from "@/components/shared/mode-toggle"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-secondary-foreground/20 px-2 py-4">
      <div className="container flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          © {currentYear} Malek Gara-Hellal. All rights reserved.
        </p>
        <ModeToggle />
      </div>
    </footer>
  )
}
