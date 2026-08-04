import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    notFound();
  }

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    notFound();
  }

  const now = new Date();
  const isOverdue =
    task.dueDate < now && task.status !== "COMPLETE";

  return (
    <main className="mx-auto max-w-2xl p-8">
      {isOverdue && (
        <div className="mb-6 rounded border border-red-300 bg-red-100 p-4 font-semibold text-red-700">
          Warning: This task is overdue.
        </div>
      )}

      <header className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold">{task.title}</h1>

        <Link
          href={`/tasks/${task.id}/edit`}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Edit Task
        </Link>
      </header>

      <section className="space-y-4">
        <p>
          <strong>Topic:</strong> {task.topic}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {task.status.replace("_", " ")}
        </p>

        <p>
          <strong>Due Date:</strong>{" "}
          {task.dueDate.toLocaleDateString()}
        </p>

        <div>
          <p className="mb-2 font-semibold">Description:</p>

          <p className="whitespace-pre-wrap rounded bg-gray-100 p-4">
            {task.description}
          </p>
        </div>
      </section>

      <div className="mt-8">
        <Link href="/tasks" className="hover:text-blue-600">
          ← Back to Tasks
        </Link>
      </div>
    </main>
  );
}