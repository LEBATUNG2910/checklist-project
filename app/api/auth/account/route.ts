import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/session.server";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Xóa user khỏi cơ sở dữ liệu dựa trên email
    await prisma.user.delete({
      where: { email: session.email },
    });

    // Trả về kết quả thành công
    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ message: "Lỗi hệ thống khi xóa tài khoản" }, { status: 500 });
  }
}