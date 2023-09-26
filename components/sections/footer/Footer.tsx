import NextPage from "@/components/overall/NextPage";
import CloudLogos from "@/components/sections/footer/CloudLogos";

export default function Footer({ href, name }: { href: string, name: string }) {
    return (
        <>
            <NextPage name={name} href={href} />
            <CloudLogos />
        </>
    )
}