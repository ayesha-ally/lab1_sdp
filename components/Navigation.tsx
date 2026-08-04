import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="flex items-center gap-6 border-b border-gray-300 p-4 mb-6">
      <Link href="/" className="text-xl font-bold hover:text-blue-600">
        ToDo App
      </Link>

      <Link href="/" className="hover:text-blue-600">
        Home
      </Link>

      <Link href="/tasks" className="hover:text-blue-600">
        Tasks
      </Link>

      <Link href="/archive" className="hover:text-blue-600">
        Archive
      </Link>
    </nav>
  );
}