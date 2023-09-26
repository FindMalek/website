"use client"

import Link from "next/link"
import { motion } from "framer-motion";

export default function NextPage({ href, name }: { href: string, name: string }) {
    const arrowVariants = {
        leftToRight: {
            x: ["10%", "100%", "10%"], // Bounce from 0% to 100% to 0% on the x-axis
            transition: {
                duration: 1, // Duration of each bounce
                ease: "easeInOut", // Easing function for smooth animation
                repeat: Infinity, // Repeat the animation infinitely
            },
        },
    };
    return (
        <div className="mt-10">
            <Link href={href} className="leading-6 text-lg font-normal text-white">
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