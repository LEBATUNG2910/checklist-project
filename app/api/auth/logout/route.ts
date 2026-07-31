// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session.server";

export async function GET() {
  await deleteSession();
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/login`
  );
}