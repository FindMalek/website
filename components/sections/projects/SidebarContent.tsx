import Image from "next/image";

import { Project } from "@/lib/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";

export default function SidebarContent({ project }: { project: Project }) {
  return (
    <div className="px-0 md:px-8">
      {project.display && (
        <Image
          src={project.display.src}
          alt={project.display.alt}
          height={project.display.height}
          width={project.display.width * 2}
          className="rounded-3xl"
        />
      )}

      <div className="py-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          About.
        </h3>
        <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
          {project.details.about}
        </p>
      </div>

      <div className="py-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Technologies.
        </h3>
        <div className="mt-1 text-base">
          {project.details.tech.map((tech) => (
            <Badge key={tech.name} variant="outline" className="py-1 pr-4 m-2">
              <tech.icon className="m-1 h-4 w-4" />
              {tech.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="py-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Frequently Asked Questions.
        </h3>
        <div>
          <Accordion type="single" collapsible className="w-full mt-1">
            {project.accordion.map((item) => (
              <AccordionItem key={item.question} value={item.answer}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
