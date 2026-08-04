import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;

  let orderBy: Prisma.TaskOrderByWithRelationInput = {
    createdAt: "desc",
  };

  if (sort === "dueDate") {
    orderBy = { dueDate: "asc" };
  } else if (sort === "topic") {
    orderBy = { topic: "asc" };
  } else if (sort === "status") {
    orderBy = { status: "asc" };
  }

  const tasks = await prisma.task.findMany({
    where: {
      archivedAt: null,
    },
    orderBy,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold">Tasks</h1>

        <Link
          href="/tasks/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Create New Task
        </Link>
      </header>

      <section className="mb-6 flex items-center gap-3">
        <span className="font-semibold text-gray-700">Sort by:</span>

        <div className="flex gap-2">
          <Link
            href="/tasks?sort=dueDate"
            className={`rounded border px-3 py-1 text-sm ${
              sort === "dueDate"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Due Date
          </Link>

          <Link
            href="/tasks?sort=topic"
            className={`rounded border px-3 py-1 text-sm ${
              sort === "topic"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Topic
          </Link>

          <Link
            href="/tasks?sort=status"
            className={`rounded border px-3 py-1 text-sm ${
              sort === "status"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Status
          </Link>
        </div>
      </section>

      <hr className="mb-6" />

      {tasks.length === 0 ? (
        <div className="rounded border bg-gray-50 p-8 text-center text-gray-500">
          No tasks yet.
        </div>
      ) : (
        <section className="grid gap-4">
          {tasks.map((task) => {
            const taskDueDate = new Date(task.dueDate);
            taskDueDate.setHours(0, 0, 0, 0);

            const isOverdue =
              taskDueDate < today && task.status !== "COMPLETE";

            return (
              <article
                key={task.id}
                className={`flex items-center justify-between rounded border p-4 shadow-sm ${
                  isOverdue ? "border-red-300 bg-red-50" : "bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="text-xl font-semibold hover:text-blue-600"
                    >
                      {task.title}
                    </Link>

                    {isOverdue && (
                      <span className="rounded bg-red-200 px-2.5 py-0.5 text-xs font-bold text-red-800">
                        ⚠ Overdue
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>Topic:</strong> {task.topic}
                    </span>

                    <span>
                      <strong>Status:</strong>{" "}
                      {task.status.replace("_", " ")}
                    </span>

                    <span>
                      <strong>Due:</strong>{" "}
                      {task.dueDate.toLocaleDateString()}
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
            );
          })}
        </section>
      )}
    </main>
  );
}