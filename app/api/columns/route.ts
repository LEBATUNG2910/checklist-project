// app/api/columns/route.ts
// GET /api/columns — trả về tất cả columns + tasks

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/session.server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const columns = await prisma.kanbanColumn.findMany({
      orderBy: { order: "asc" },
      include: {
        tasks: {
          orderBy: { order: "asc" },
          include: {
            author: {
              select: { id: true, name: true, avatar: true },
            },
            assignees: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
          },
        },
      },
    });

    // Transform để match KanbanColumn type ở frontend
    const result = columns.map((col) => ({
      id: col.id,
      title: col.title,
      colorClass: col.colorClass,
      tasks: col.tasks.map((task) => ({
        id: task.id,
        title: task.title ?? undefined,
        description: task.description ?? undefined,
        imageUrl: task.imageUrl ?? undefined,
        platformName: task.platformName,
        priority: task.priority ?? null,
        dueDate: task.dueDate ?? undefined, // <-- Đã thêm dueDate để trả về cho Client
        timestamp: task.createdAt.toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        author: task.author
          ? { id: task.author.id, name: task.author.name, avatar: task.author.avatar }
          : undefined,
        assignees: task.assignees.map((a) => ({
          id: a.user.id,
          name: a.user.name,
          avatar: a.user.avatar,
        })),
      })),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/columns error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}