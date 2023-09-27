import Link from "next/link";
import {
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoFacebook,
  BiLogoGithub,
  BiLogoBehance,
} from "react-icons/bi";

const overall = [
  {
    name: "Engineering",
    description:
      "The power of first impressions cannot be underestimated, and the gateway to capitalizing on them lies in exceptional website design. An outstanding website transcends mere aesthetics and extends its influence to encompass seamless functionality and user-friendly navigation. Drawing upon my expertise as a seasoned programmer, I possess the unique ability to tackle intricate technical challenges while crafting websites that exude sleekness and visual allure. Moreover, my extensive knowledge of recognized technical standards is complemented by my proficiency in modern building practices, ensuring that every aspect of your website is finely tuned to perfection.",
    linkText: "View GitHub",
    href: "#",
    icon: BiLogoGithub,
  },
];

export default function HorizentalContent({ name }: { name: string }) {
  return (
    <ul className="mx-auto mt-8 grid gap-8">
      {overall.map((item) => (
        <li key={item.name} className="relative flex gap-6">
          <div className="before:absolute before:left-[8.5px] before:h-full before:w-[2px] before:bg-white">
            <svg height="20" width="20">
              <circle
                cx="10"
                cy="10"
                r="6"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-md font-semibold text-black dark:text-white">
              {item.name}
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

{
  /*
          <div className="flex items-center text-base font-semibold leading-6 text-black dark:text-white">
            <svg
              viewBox="0 0 4 4"
              className= "mr-4 h-1 w-1 flex-none"
              aria-hidden="true"
            >
              <circle cx={5} cy={5} r={10} fill="currentColor" />
            </svg>
            {item.name}
            <div
              className="absolute w-[0.75px] h-[2rem] translate-w-full bg-white -ml-4"
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 text-sm leading-7 text-gray-600 dark:text-gray-300">
            {item.description}
          </p>
*/
}
