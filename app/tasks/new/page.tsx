import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export default function NewTaskPage() {
  async function createTask(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const topic = formData.get("topic")?.toString().trim();
    const dueDate = formData.get("dueDate")?.toString();
    const status = formData.get("status")?.toString();

    if (!title || !description || !topic || !dueDate || !status) {
      throw new Error("All fields are required.");
    }

    await prisma.task.create({
      data: {
        title,
        description,
        topic,
        dueDate: new Date(dueDate),
        status: status as "TODO" | "IN_PROGRESS" | "COMPLETE",
      },
    });

    revalidatePath("/tasks");
    redirect("/tasks");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Create New Task</h1>

      <form action={createTask} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-1 block font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
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
            required
            rows={5}
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
            required
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1 block font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
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
            defaultValue="TODO"
            required
            className="w-full rounded border border-gray-300 p-2"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETE">Complete</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Link
            href="/tasks"
            className="rounded border border-gray-300 px-4 py-2"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Task
          </button>
        </div>
      </form>
    </main>
  );
}