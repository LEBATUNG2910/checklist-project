// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createSession } from "@/lib/session.server";
import bcrypt from "bcrypt"; // hoặc bcryptjs tùy theo thư viện bạn đang cài đặt

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 1. Tìm user trong Database thật bằng Prisma
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // 2. Kiểm tra user tồn tại, có passwordHash và khớp mật khẩu không
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // 3. Tạo session đăng nhập
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}