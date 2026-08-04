import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export default async function EditTaskPage({
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

  const formattedDueDate = task.dueDate.toISOString().slice(0, 10);

  async function updateTask(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString().trim();
    const topic = formData.get("topic")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const status = formData.get("status")?.toString();
    const dueDate = formData.get("dueDate")?.toString();

    if (!title || !topic || !description || !status || !dueDate) {
      throw new Error("All fields are required.");
    }

    if (
      status !== "TODO" &&
      status !== "IN_PROGRESS" &&
      status !== "COMPLETE"
    ) {
      throw new Error("Invalid task status.");
    }

    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        topic,
        description,
        status,
        dueDate: new Date(dueDate),
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${taskId}`);
    redirect(`/tasks/${taskId}`);
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Task #{task.id}
      </h1>

      <form action={updateTask} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-1 block font-medium">
            Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            defaultValue={task.title}
            required
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="topic" className="mb-1 block font-medium">
            Topic
          </label>

          <input
            id="topic"
            name="topic"
            type="text"
            defaultValue={task.topic}
            required
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block font-medium">
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue={task.status}
            required
            className="w-full rounded border border-gray-300 p-2"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETE">Complete</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1 block font-medium">
            Due Date
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={formattedDueDate}
            required
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block font-medium">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={task.description}
            required
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

          <Link
            href={`/tasks/${task.id}`}
            className="rounded border border-gray-300 px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}