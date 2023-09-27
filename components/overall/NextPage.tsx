"use client"

import Link from "next/link"
import { motion } from "framer-motion";

export default function NextPage({ href, name }: { href: string, name: string }) {
    const arrowVariants = {
        leftToRight: {
            x: ["10%", "100%", "10%"],
            transition: {
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
            },
        },
    };
    return (
        <div className="mt-10 mb-10 md:mb-0">
            <Link href={href} className="leading-6 text-lg font-normal dark:text-white">
                {name}
                <motion.span
                    aria-hidden="true"
                    className="inline-block"
                    variants={arrowVariants}
                    initial="leftToRight"
                    animate="leftToRight"
                >
                    →
                </motion.span>
            </Link>
        </div>
    )
}