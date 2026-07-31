// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/users";
import { createSession } from "@/lib/session.server";

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

    // Check duplicate
    const existing = findUserByEmail(email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Create user
    const user = createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    // Auto login after signup
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
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