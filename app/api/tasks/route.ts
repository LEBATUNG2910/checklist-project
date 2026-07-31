// app/api/tasks/route.ts
// POST /api/tasks — tạo task mới

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/session.server";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, platformName, columnId, imageUrl } = body;

    if (!title?.trim() || !columnId) {
      return NextResponse.json({ error: "title and columnId are required" }, { status: 400 });
    }

    // Tìm hoặc tạo user trong DB từ session
    const dbUser = await prisma.user.upsert({
      where: { email: session.email },
      update: { name: session.name, avatar: session.avatar },
      create: {
        id: session.id,
        name: session.name,
        email: session.email,
        avatar: session.avatar,
      },
    });

    // Tính order — thêm lên đầu
    const maxOrder = await prisma.kanbanTask.count({ where: { columnId } });

    const task = await prisma.kanbanTask.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        platformName: platformName ?? "Gmail",
        columnId,
        authorId: dbUser.id,
        order: maxOrder,
        assignees: {
          create: [{ userId: dbUser.id }],
        },
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        assignees: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    return NextResponse.json({
      id: task.id,
      title: task.title ?? undefined,
      description: task.description ?? undefined,
      imageUrl: task.imageUrl ?? undefined,
      platformName: task.platformName,
      priority: task.priority ?? null,
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
    });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}