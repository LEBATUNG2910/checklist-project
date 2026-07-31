// app/api/auth/me/route.ts
// Trả về thông tin user từ session — Header fetch từ đây

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session.server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }
  return NextResponse.json(session);
}