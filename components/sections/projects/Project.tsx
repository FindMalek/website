import Image from "next/image";
import Link from "next/link";

import { useMotionValue } from "framer-motion";
import { Project } from "@/lib/types";

import ProjectPattern from "@/components/sections/projects/ProjectPattern";
import SidebarContent from "@/components/sections/projects/SidebarContent";
import GithubCard from "@/components/sections/projects/GithubCard";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";

export default function Project({ project }: { project: Project }) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: {
    currentTarget: any;
    clientX: number;
    clientY: number;
  }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      id={project.name}
      key={project.name}
      onMouseMove={onMouseMove}
      className="group relative mt-4 rounded-2xl bg-zinc-50 dark:bg-gray-950/70 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      {project.display ? (
        project.display && (
          <div
            style={{
              paddingBottom: `${project.display?.height}%`,
            }}
          >
            <ProjectPattern mouseX={mouseX} mouseY={mouseY} />
            <Image
              {...project.display}
              className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] dark:[mask-image:linear-gradient(black,transparent)] group-hover:opacity-30"
            />
          </div>
        )
      ) : (
        <ProjectPattern mouseX={mouseX} mouseY={mouseY} />
      )}
      <Sheet key="left">
        <SheetTrigger
          className="text-left rounded-2xl px-4 pb-4 pt-10"
          style={{
            paddingBottom: project.display?.height,
          }}
        >
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-700/20 group-hover:ring-cyan-600/90 dark:ring-white/10" />
          <project.icon className="h-5 w-5 fill-zinc-600/40 stroke-zinc-700 transition-colors duration-300 group-hover:fill-zinc-900 dark:group-hover:stroke-1 dark:fill-white/80 dark:stroke-zinc-400 dark:group-hover:fill-cyan-300 dark:group-hover:stroke-gray-50/20" />
          <h4 className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
            <span className="absolute inset-0 rounded-2xl" />
            {project.name}
          </h4>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
            {project.description}
          </p>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="overflow-auto bg-gray-100/70 dark:bg-gray-950/70 w-full md:min-w-[500px] lg:min-w-[800px]"
        >
          <SheetHeader className="pb-4">
            <SheetClose className="text-left text-sm font-semibold text-black/70 hover:text-black hover:underline hover:underline-offset-1 dark:text-white/70 dark:hover:text-white">
              Back To Projects.
            </SheetClose>
          </SheetHeader>
          <Separator orientation="horizontal" />

          <SheetTitle className="mt-4 flex items-cente px-0 md:px-8">
            <div className="flex items-center text-3xl font-semibold leading-7 text-gray-900 dark:text-white">
              <project.icon className="h-8 w-8 mr-2 fill-current dark:text-white" />
              {project.name}
            </div>
            <div className="ml-auto font-normal">
              {project.github && <GithubCard github={project.github} />}
            </div>
          </SheetTitle>
          <SheetDescription className="py-2 px-0 md:px-8 pb-8 text-sm text-left text-gray-500">
            {project.description}
          </SheetDescription>

          <SidebarContent project={project} />

          <SheetFooter>
            <Button className="w-full mt-4 py-6 text-sm font-semibold text-gray-50 transition-colors duration-300 bg-cyan-800/70 rounded-lg hover:bg-cyan-950/70 dark:bg-cyan-950/70 dark:text-white dark:hover:bg-cyan-800/70">
              <Link
                target="_blank"
                href={project.details.href || project.github?.href || "/404"}
                className="w-full px-4 py-2"
              >
                Open Project
              </Link>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
}
