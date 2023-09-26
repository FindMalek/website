import Link from "next/link"

export default function NextPage({ href, name }: { href: string, name: string }) {
    return (
        <div className="mt-14">
            <Link href={href} className="leading-6 text-lg font-normal dark:text-white">
                {name} <span aria-hidden="true">→</span>
            </Link>
        </div>
    )
}