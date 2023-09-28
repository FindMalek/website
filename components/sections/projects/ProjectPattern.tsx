import { motion, useMotionTemplate, MotionValue } from "framer-motion";
import { GridPattern } from "@/components/sections/projects/GridPattern";

export default function ResourcePattern({
  mouseX,
  mouseY,
  ...gridProps
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(black,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 dark:fill-white/90 dark:stroke-white/90"
          {...gridProps}
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#adf5d7] to-[#95fafa] opacity-0 transition duration-300 group-hover:opacity-50 dark:from-[#171c55] dark:to-[#154a4e]"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  );
}
