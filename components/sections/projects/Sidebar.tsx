import { HiMiniArrowLeftCircle } from "react-icons/hi2";

import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";

import { Project } from "@/lib/types";

export default function Sidebar({ project }: { project: Project }) {
  return (
    <div>
      <div className="px-4 sm:px-6">
        <div className="flex items-start justify-between">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Nos blog
          </h1>
          <div className="ml-3 flex h-7 items-center">
            <Button variant="ghost">
              <span className="sr-only">Close panel</span>
              <HiMiniArrowLeftCircle className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
      <div className="relative mt-6 px-4 sm:px-6">
        <Separator className="mb-6" orientation="horizontal" />
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
            {project.name}
          </h2>
          <p className="text-sm text-gray-500">{project.description}</p>
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
      </div>
    </div>
  );
}
