export default function Header({ name }: { name: string }) {
  return (
    <h1 className="text-4xl font-bold text-left pb-2 bg-gradient-to-r from-cyan-950 via-cyan-800 to-cyan-700  dark:from-cyan-50 dark:via-cyan-200 dark:to-cyan-300 text-transparent bg-clip-text animate-gradient">
      {name}
    </h1>
  );
}
