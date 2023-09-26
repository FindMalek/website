import Link from "next/link"
import Footer from "@/components/sections/footer/Footer"

export default function Herosection() {
  return (
    <>
      <h1 className="text-4xl font-bold text-left dark:text-white">I'm Malek.</h1>
      <p className="text-lg font-light pt-6 text-left dark:text-white">
        Welcome to my digital domain! I'm a web developer who transforms ideas into immersive online experiences. With a keen eye for minimalistic design and a penchant for precision, I breathe life into websites that seamlessly blend form and function.
      </p>
      <p className="text-lg font-light pt-4 text-left dark:text-white">
        My work is a testament to the power of simplicity, where user-centric design takes center stage. When I'm not crafting digital wonders, I'm constantly honing my skills through diligent research and reading{" "}
        <Link href="/about#my-reads" className="font-medium hover:text-cyan-600 hover:underline hover:underline-offset-1">BOOKS</Link>.
        And when the world fades away, you'll find me immersed in the emotive rhythms of Metal and Sad Music, drawing inspiration from their depths.
      </p>
      <p className="text-lg font-light pt-4 text-left dark:text-white">
        Ready to turn your vision into a stunning online reality? Feel free to{" "}
        <Link href="/contact" className="font-medium hover:text-cyan-600 hover:underline hover:underline-offset-1">CONTACT ME</Link>.
        Let's create something extraordinary together.
      </p>
      <Footer name="See More About Me" href="/about" />
    </>
  );
}
