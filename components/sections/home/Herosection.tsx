import Link from "next/link"
import Footer from "@/components/sections/footer/Footer"

export default function Herosection() {
  return (
    <>
      <h1 className="text-4xl font-semibold text-left text-white">I'm Malek.</h1>
      <p className="text-lg font-light pt-6 text-left text-white">
        Welcome to my digital domain! I'm a web developer who transforms ideas into immersive online experiences. With a keen eye for minimalistic design and a penchant for precision, I breathe life into websites that seamlessly blend form and function.
      </p>
      <p className="text-lg font-light pt-4 text-left text-white">
        My work is a testament to the power of simplicity, where user-centric design takes center stage. When I'm not crafting digital wonders, I'm constantly honing my skills through diligent research and reading <Link href="/about#my-reads" className="font-bold">BOOKS</Link>. And when the world fades away, you'll find me immersed in the emotive rhythms of Metal and Sad Music, drawing inspiration from their depths.
      </p>
      <p className="text-lg font-light pt-4 text-left text-white">
        Ready to turn your vision into a stunning online reality? Feel free to <Link href="/contact" className="font-bold">CONTACT ME</Link>. Let's create something extraordinary together.
      </p>
      <Footer name="See More About Me" href="/about" />
    </>
  );
}
