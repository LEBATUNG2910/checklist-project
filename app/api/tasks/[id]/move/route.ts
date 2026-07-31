// app/api/tasks/[id]/move/route.ts
// PUT /api/tasks/:id/move — chuyển task sang column khác

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
    const { targetColumnId } = await req.json();

    if (!targetColumnId) {
      return NextResponse.json({ error: "targetColumnId is required" }, { status: 400 });
    }

    await prisma.kanbanTask.update({
      where: { id },
      data: { columnId: targetColumnId, order: 0 },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/tasks/:id/move error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}