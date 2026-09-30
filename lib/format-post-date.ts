import { format, parseISO } from "date-fns"

// Kept apart from lib/blog.ts so client components can use it without
// pulling every post's compiled body into the browser bundle.
export function formatPostDate(date: string) {
  return format(parseISO(date), "MMM d, yyyy")
}
