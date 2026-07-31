// lib/session.ts
// Chỉ chứa types và encode/decode — KHÔNG import next/headers
// File này safe để import ở bất kỳ đâu

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const SECRET = process.env.SESSION_SECRET ?? "fallback_secret";

export function encodeSession(data: SessionUser): string {
  const json = JSON.stringify(data);
  return Buffer.from(`${SECRET}:${json}`).toString("base64");
}

export function decodeSession(token: string): SessionUser | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const colonIndex = decoded.indexOf(":");
    const secret = decoded.slice(0, colonIndex);
    const json = decoded.slice(colonIndex + 1);
    if (secret !== SECRET) return null;
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}