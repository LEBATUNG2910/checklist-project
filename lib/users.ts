// lib/users.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  createdAt: string;
}

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]", "utf-8");
}

export function getAllUsers(): StoredUser[] {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as StoredUser[];
}

export function findUserByEmail(email: string): StoredUser | null {
  return getAllUsers().find((u) => u.email === email) ?? null;
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
}): StoredUser {
  const users = getAllUsers();

  // Dùng pravatar với hash từ email — trả PNG, không cần config
  const emailHash = crypto.createHash("md5").update(data.email).digest("hex");

  const newUser: StoredUser = {
    id: `u_${Date.now()}`,
    name: data.name,
    email: data.email,
    passwordHash: hashPassword(data.password),
    avatar: `https://i.pravatar.cc/150?u=${emailHash}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
  return newUser;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}