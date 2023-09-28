import Link from "next/link";
import { useMotionValue } from "framer-motion";
import { projects } from "@/lib/types";

import ProjectPattern from "@/components/sections/projects/ProjectPattern";

export default function Project({ project }: { project: projects }) {
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
      key={project.href}
      onMouseMove={onMouseMove}
      className="group relative flex rounded-2xl bg-zinc-50 dark:bg-gray-950/70 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <ProjectPattern mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-700/20 group-hover:ring-cyan-600/90 dark:ring-white/10" />
      <div className="relative rounded-2xl px-4 pb-4 pt-16">
        <project.icon className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-cyan-900 group-hover:fill-cyan-200/30 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-cyan-300/20 dark:group-hover:stroke-cyan-400" />
        <h3 className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
          <Link href={project.href}>
            <span className="absolute inset-0 rounded-2xl" />
            {project.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
      </div>
    </div>
  );
}
