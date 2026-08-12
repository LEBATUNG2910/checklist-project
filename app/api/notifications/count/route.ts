// app/api/notifications/count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/session.server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Đếm số lượng task/thông báo thực tế theo platform của user này từ DB
    // (Ở đây giả định bạn đếm theo platformName của Task hoặc bảng Notification riêng nếu có)
    const tasks = await prisma.kanbanTask.findMany({
      where: {
        OR: [
          { authorId: dbUser.id },
          { assignees: { some: { userId: dbUser.id } } }
        ]
      },
      select: { platformName: true }
    });

    // Gom nhóm đếm số lượng theo platform
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const platform = t.platformName || "Gmail";
      counts[platform] = (counts[platform] || 0) + 1;
    });

    return NextResponse.json(counts);
  } catch (err) {
    console.error("GET /api/notifications/count error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}