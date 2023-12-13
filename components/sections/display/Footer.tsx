import NextPage from "@/components/sections/navigation/NextPage";
import CloudLogos from "@/components/sections/display/CloudLogos";

export default function Footer({ href, name }: { href: string; name: string }) {
	return (
		<footer>
			<NextPage
				name={name}
				href={href}
			/>
			<CloudLogos />
		</footer>
	);
}
