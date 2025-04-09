import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"

export function AboutOverview() {
  return (
    <section className="mb-32" id="overview">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="space-y-6 lg:w-3/5">
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eleifend tincidunt magna quis efficitur. Curabitur blandit mauris at
            lacinia pulvinar, quam neque efficitur risus, id rutrum metus sem
            quis dui. Duis lorem mi, vulputate sit amet laoreet ut, fringilla ac
            sapien. Cras egestas est sed pulvinar dapibus. Aenean non sapien
            eros. Sed dapibus rhoncus lacinia. Pellentesque vel maximus ante.
            Nulla bibendum tristique finibus. Phasellus commodo sit amet neque
            vitae consequat. Aliquam vel urna in mauris consequat hendrerit.
            Quisque tempus sit amet lorem sit amet ullamcorper. In gravida
            fermentum porttitor. Etiam vitae sodales nulla. Nullam molestie enim
            quis accumsan pharetra.
          </p>

          <p className="text-lg">
            Cras porttitor, elit quis laoreet porta, ipsum velit blandit ipsum,
            hendrerit mollis lacus nibh ut massa. Suspendisse at lobortis magna.
            Nam ut augue augue. Quisque lacinia justo at mauris posuere varius a
            at quam. Sed vel lacus non ipsum commodo cursus. Integer faucibus
            est a erat congue aliquet. Vivamus tincidunt placerat leo. Ut
            finibus eleifend dapibus. Sed facilisis tincidunt finibus. Quisque
            dictum, purus sed ornare ultricies, urna ante bibendum id, venenatis
            felis dui eget quam. Ut mattis gravida tortor et faucibus. Donec et
            lorem in nisi facilisis varius id non nulla. Quisque elementum
            feugiat sapien, et volutpat nunc cursus ac. Suspendisse eu pharetra
            lorem. Aliquam facilisis nunc a quam accumsan hendrerit.
          </p>
        </div>

        <div className="relative lg:w-2/5">
          <div className="lg:sticky lg:top-8">
            <div className="mb-6 overflow-hidden rounded-3xl">
              <Image
                src="/author.jpg"
                alt="Profile"
                width={500}
                height={500}
                className="aspect-square h-auto w-full object-cover grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>

            <div className="space-y-2">
              <Link href={siteConfig.links.instagram} className="flex gap-2">
                <Icons.instagram className="size-4" />
                <span className="text-sm ">follow me on Instagram</span>
              </Link>
              <Link href={siteConfig.links.linkedin} className="flex gap-2">
                <Icons.linkedin className="size-4" />
                <span className="text-sm ">follow me on LinkedIn</span>
              </Link>
              <Link href={siteConfig.links.github} className="flex gap-2">
                <Icons.github className="size-4" />
                <span className="text-sm ">follow me on Github</span>
              </Link>
              <Link href={siteConfig.links.twitter} className="flex gap-2">
                <Icons.x className="size-4" />
                <span className="text-sm ">follow me on X</span>
              </Link>
              <Link href={siteConfig.links.facebook} className="flex gap-2">
                <Icons.facebook className="size-4" />
                <span className="text-sm ">follow me on Facebook</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
