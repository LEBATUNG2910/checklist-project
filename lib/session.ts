// lib/session.ts
// Encode/decode session — KHÔNG import next/headers
// Safe to use anywhere

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.warn("SESSION_SECRET not set — using fallback. Set it in .env.local and Vercel.");
    return "workai_fallback_secret_change_me";
  }
  return secret;
}

export function encodeSession(data: SessionUser): string {
  const json = JSON.stringify(data);
  const secret = getSecret();
  // btoa works in both Node.js (18+) and Edge Runtime
  const payload = `${secret}::${json}`;
  return btoa(unescape(encodeURIComponent(payload)));
}

export function decodeSession(token: string): SessionUser | null {
  try {
    const secret = getSecret();
    const decoded = decodeURIComponent(escape(atob(token)));
    const separatorIndex = decoded.indexOf("::");
    if (separatorIndex === -1) return null;
    const tokenSecret = decoded.slice(0, separatorIndex);
    const json = decoded.slice(separatorIndex + 2);
    if (tokenSecret !== secret) return null;
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}