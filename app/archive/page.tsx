import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ArchivePage() {
  const archivedTasks = await prisma.task.findMany({
    where: {
      archivedAt: {
        not: null,
      },
    },
    orderBy: {
      archivedAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-6 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Archived Tasks</h1>
          <p className="text-gray-600">
            Archived tasks remain viewable for record-keeping.
          </p>
        </div>

        <Link
          href="/tasks"
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          ← Back to Tasks
        </Link>
      </header>

      {archivedTasks.length === 0 ? (
        <div className="rounded border bg-gray-50 p-8 text-center text-gray-500">
          No archived tasks found.
        </div>
      ) : (
        <section className="grid gap-4">
          {archivedTasks.map((task) => (
            <article
              key={task.id}
              className="flex items-center justify-between rounded border bg-gray-50 p-4 shadow-sm"
            >
              <div>
                <Link
                  href={`/tasks/${task.id}`}
                  className="text-xl font-semibold text-gray-800 hover:text-blue-600"
                >
                  {task.title}
                </Link>

                <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <strong>Topic:</strong> {task.topic}
                  </span>

                  <span>
                    <strong>Status:</strong>{" "}
                    {task.status.replace("_", " ")}
                  </span>

                  <span>
                    <strong>Archived on:</strong>{" "}
                    {task.archivedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Link
                href={`/tasks/${task.id}`}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-100"
              >
                View
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}