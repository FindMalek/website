export default function Subtitle({
	name,
	sectionId,
}: {
	name: string;
	sectionId: string;
}) {
	return (
		<section id={sectionId || "NULL"}>
			<h3 className="py-4 -mb-10 text-2xl font-bold text-left">{name}</h3>
		</section>
	);
}
