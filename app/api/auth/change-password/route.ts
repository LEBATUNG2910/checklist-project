import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/session.server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPw, newPw } = await req.json();

    // 1. Tìm user trong Database
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    // SỬA Ở ĐÂY: Dùng passwordHash thay vì password
    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: "User not found or invalid password" }, { status: 400 });
    }

    // 2. So sánh mật khẩu cũ xem có khớp không
    // SỬA Ở ĐÂY: Dùng passwordHash
    const isPasswordValid = await bcrypt.compare(currentPw, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    // 3. Mã hóa mật khẩu mới và lưu vào DB
    const hashedNewPassword = await bcrypt.hash(newPw, 10);
    await prisma.user.update({
      where: { email: session.email },
      // SỬA Ở ĐÂY: Lưu vào trường passwordHash
      data: { passwordHash: hashedNewPassword },
    });

    return NextResponse.json({ message: "Đổi mật khẩu thành công" }, { status: 200 });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 });
  }
}