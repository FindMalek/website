import Image from "next/image";

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
              className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(black,transparent)] dark:[mask-image:linear-gradient(white,transparent)] group-hover:opacity-20"
            />
          </div>
        )
      ) : (
        <ProjectPattern mouseX={mouseX} mouseY={mouseY} />
      )}

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-700/20 group-hover:ring-cyan-600/90 dark:ring-white/10" />
      <div className="relative rounded-2xl px-4 pb-4 pt-16">
        <project.icon className="h-5 w-5 fill-zinc-600/40 stroke-zinc-700 transition-colors duration-300 group-hover:fill-zinc-900 dark:group-hover:stroke-1 dark:fill-white/80 dark:stroke-zinc-400 dark:group-hover:fill-cyan-300 dark:group-hover:stroke-gray-50/20" />
        <h3 className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
          <span className="absolute inset-0 rounded-2xl" />
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {project.description}
        </p>
      </div>
    </div>
  );
}
