import Link from "next/link";
import {
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoFacebook,
  BiLogoGithub,
  BiLogoBehance,
} from "react-icons/bi";

export default function CloudLogos() {
  return (
    <>
      <div className="hidden md:flex space-x-5 pt-2">
        <Link
          href="https://www.instagram.com/findmalek"
          target="_blank"
          aria-label="Instagram"
        >
          <BiLogoInstagram className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/malek-gara-hellal-a2936221a/"
          target="_blank"
          aria-label="LinkedIn"
        >
          <BiLogoLinkedin className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.facebook.com/malekgh.py/"
          target="_blank"
          aria-label="Facebook"
        >
          <BiLogoFacebook className="h-5 w-5" />
        </Link>
        <Link
          href="https://github.com/FindMalek"
          target="_blank"
          aria-label="GitHub"
        >
          <BiLogoGithub className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.behance.net/malekpy"
          target="_blank"
          aria-label="Behance"
        >
          <BiLogoBehance className="h-5 w-5" />
        </Link>
      </div>

      <div className="md:hidden fixed z-50 bottom-0 left-0 right-0 bg-cyan-100/80 dark:bg-cyan-800/80 p-3 flex space-x-16 justify-center">
        <Link
          href="https://www.instagram.com/findmalek"
          target="_blank"
          aria-label="Instagram"
        >
          <BiLogoInstagram className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/malek-gara-hellal-a2936221a/"
          target="_blank"
          aria-label="LinkedIn"
        >
          <BiLogoLinkedin className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.facebook.com/malekgh.py/"
          target="_blank"
          aria-label="Facebook"
        >
          <BiLogoFacebook className="h-5 w-5" />
        </Link>
        <Link
          href="https://github.com/FindMalek"
          target="_blank"
          aria-label="GitHub"
        >
          <BiLogoGithub className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.behance.net/malekpy"
          target="_blank"
          aria-label="Behance"
        >
          <BiLogoBehance className="h-5 w-5" />
        </Link>
      </div>
    </>
  );
}
