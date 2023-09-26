import { Button } from "@/components/ui/Button";
import { MoonIcon, SunIcon } from "@/components/overall/Icons";

function disableTransitionsTemporarily() {
  document.documentElement.classList.add("[&_*]:!transition-none");
  window.setTimeout(() => {
    document.documentElement.classList.remove("[&_*]:!transition-none");
  }, 0);
}

function toggleMode() {
  disableTransitionsTemporarily();

  let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let isSystemDarkMode = darkModeMediaQuery.matches;
  let isDarkMode = document.documentElement.classList.toggle("dark");

  if (isDarkMode === isSystemDarkMode) {
    delete window.localStorage.isDarkMode;
  } else {
    window.localStorage.isDarkMode = isDarkMode;
  }
}

export default function ModeToggle() {
  return (
    <Button
      variant="toggleMode"
      aria-label="Toggle dark mode"
      onClick={toggleMode}>
      <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-cyan-50 [@media(prefers-color-scheme:dark)]:stroke-cyan-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-cyan-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-cyan-600" />
      <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-cyan-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-cyan-500" />
    </Button>
  );
}
