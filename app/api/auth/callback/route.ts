// app/api/auth/callback/route.ts
// Nhận code từ Google → đổi lấy token → lấy profile → tạo session

import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session.server";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // User từ chối login
  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=access_denied`);
  }

  try {
    // 1. Đổi code lấy access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Token error:", tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=token_failed`);
    }

    // 2. Dùng access_token lấy thông tin user
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();

    if (!profile.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=profile_failed`);
    }

    // 3. Tạo session cookie
    await createSession({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.picture,
    });

    // 4. Redirect về trang chính
    return NextResponse.redirect(`${baseUrl}/home`);
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}