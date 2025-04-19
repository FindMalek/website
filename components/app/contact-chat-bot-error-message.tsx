import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  message?: string
}

export function ContactChatBotErrorMessage({
  message = "Something went wrong",
}: ErrorMessageProps) {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <Badge variant={"destructive"}>
      <Icons.alertCircle className="h-3 w-3" />
      <span>{message}</span>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-destructive/20 h-5 w-5 rounded-full"
        onClick={handleReload}
      >
        <Icons.refresh className="hover:text-secondary-foreground h-3 w-3" />
        <span className="sr-only">Reload</span>
      </Button>
    </Badge>
  )
}
