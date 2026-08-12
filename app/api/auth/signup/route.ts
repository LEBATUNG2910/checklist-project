// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma"; // Kết nối thẳng Database thật
import { createSession } from "@/lib/session.server";
import bcrypt from "bcrypt"; // Thêm thư viện mã hóa

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // 1. Kiểm tra trùng lặp email bằng Prisma
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 2. MÃ HÓA MẬT KHẨU (Băm 10 vòng)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo User mới trong Database thật
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword, // Lưu mật khẩu đã mã hóa
        avatar: "https://i.pravatar.cc/150?u=default", // Avatar mặc định
      }
    });

    // 4. Auto login after signup
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}