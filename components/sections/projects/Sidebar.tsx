import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";

import { Project } from "@/lib/types";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
}

export default function Sidebar({ open, setOpen, project }: SidebarProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <div className="fixed inset-0 backdrop-blur-[4px] bg-black bg-opacity-40" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Nos blog
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <Button
                            variant="ghost"
                            onClick={() => setOpen(false)}>
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
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
                        <p className="text-sm text-gray-500">
                          {project.description}
                        </p>
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
