import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to ToDo App
      </h1>

      <Link
        href="/tasks"
        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        View To-Do List
      </Link>
    </main>
  );
}