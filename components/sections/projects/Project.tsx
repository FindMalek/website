import Image from "next/image";

import { useMotionValue } from "framer-motion";
import { Project } from "@/lib/types";

import ProjectPattern from "@/components/sections/projects/ProjectPattern";

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
    <div
      key={project.name}
      onMouseMove={onMouseMove}
      className="group relative mt-4 rounded-2xl bg-zinc-50 dark:bg-gray-950/70 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5">
      {project.display ? (
        project.display && (
          <div
            style={{
              paddingBottom: `${project.display?.height}%`,
            }}>
            <ProjectPattern mouseX={mouseX} mouseY={mouseY} />
            <Image
              {...project.display}
              className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(black,transparent)] dark:[mask-image:linear-gradient(white,transparent)] group-hover:opacity-20"
            />
          </div>
        )
      ) : (
        <ProjectPattern mouseX={mouseX} mouseY={mouseY} />
      )}
      <Sheet key="left">
        <SheetTrigger
          className="text-left rounded-2xl px-4 pb-4 pt-16"
          style={{
            paddingBottom: project.display?.height,
          }}>
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
          className="bg-gray-950/80 w-full md:min-w-[500px] lg:min-w-[800px]">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              <project.icon className="h-6 w-6 fill-zinc-600/40 stroke-zinc-700  dark:fill-white dark:stroke-zinc-400" />
              {project.name}
            </SheetTitle>
            <SheetDescription className="text-sm text-left  text-gray-500">
              {project.description}
            </SheetDescription>
          </SheetHeader>
          <Separator orientation="horizontal" />
          <div className="max-w-2xl mx-auto space-y-8">
            {project.display && (
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={project.display.src}
                  alt={project.display.alt}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
