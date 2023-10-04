import Image from "next/image";
import { Project } from "@/lib/types";

export default function SidebarContent({ project }: { project: Project }) {
  return (
    <div>
      {project.display && (
          <Image
            src={project.display.src}
            alt={project.display.alt}
            height={project.display.height}
            width={project.display.width * 2}
            className="rounded-3xl"
          />
      )}

      <div className="grid py-4 grid-rows-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            About
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {project.details.about}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Technologies
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            
          </p>
        </div>
      </div>
    </div>
  );
}
