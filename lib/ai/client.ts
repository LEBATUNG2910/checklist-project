import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env.local");
}

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
export const fallbackModel = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });