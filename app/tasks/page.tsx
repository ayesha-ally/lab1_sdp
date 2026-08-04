import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>

        <Link href="/archive" className="hover:text-blue-600">
          Archive
        </Link>
      </header>

      {tasks.length === 0 ? (
        <p className="mb-6">No tasks yet.</p>
      ) : (
        <section className="mb-6 space-y-4">
          {tasks.map((task) => (
            <article key={task.id} className="rounded border p-4">
              <Link
                href={`/tasks/${task.id}`}
                className="text-xl font-semibold hover:text-blue-600"
              >
                {task.title}
              </Link>

              <p>Topic: {task.topic}</p>
              <p>Status: {task.status.replace("_", " ")}</p>
              <p>Due: {task.dueDate.toLocaleDateString()}</p>
            </article>
          ))}
        </section>
      )}

      <Link
        href="/tasks/new"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Create New Task
      </Link>
    </main>
  );
}