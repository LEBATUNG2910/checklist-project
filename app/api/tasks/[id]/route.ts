// app/api/tasks/[id]/route.ts
// PUT /api/tasks/:id — update task
// DELETE /api/tasks/:id — xóa task

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/session.server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, description, priority } = body;

    const task = await prisma.kanbanTask.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title || null }),
        ...(description !== undefined && { description: description || null }),
        ...(priority !== undefined && { priority: priority || null }),
      },
    });

    return NextResponse.json({ success: true, id: task.id });
  } catch (err) {
    console.error("PUT /api/tasks/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await prisma.kanbanTask.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tasks/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}