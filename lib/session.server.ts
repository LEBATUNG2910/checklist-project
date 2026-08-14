// lib/session.server.ts
// ONLY use in Server Components and API Routes — has next/headers

import { cookies } from "next/headers";
import { SessionUser, encodeSession, decodeSession } from "./session";

const SESSION_COOKIE = "workai_session";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    secure: true,                    // always true — Vercel is always HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,      // 30 ngày thay vì 7 ngày
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}