export default function Header({ name }: { name: string }) {
	return (
		<h1 className="text-3xl md:text-5xl font-bold text-left pb-2 bg-gradient-to-r from-cyan-950 via-cyan-700 to-cyan-500  dark:from-cyan-100 dark:via-cyan-200 dark:to-cyan-500 text-transparent bg-clip-text animate-gradient">
			{name}
		</h1>
	);
}
