import Link from "next/link";
import { Github } from "@/lib/types";

import { Button } from "@/components/ui/Button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

import { BiCalendar, BiLogoGithub } from "react-icons/bi";

export default function GithubCard({ github }: { github: Github }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={github.href} target="_blank">
          <Button variant="link">
            <BiLogoGithub className="mr-2 h-4 w-4 opacity-70" />
            Github
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={github.iconSrc} />
            <AvatarFallback>
                {github.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{github.name}</h4>
            <p className="text-sm">{github.description}</p>
            <div className="flex items-center pt-2">
              <BiCalendar className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                {github.date}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
