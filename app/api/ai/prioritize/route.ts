// app/api/ai/prioritize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { model, fallbackModel } from "@/lib/ai/client";

interface TaskInput {
  id: string;
  title: string;
  description?: string;
  columnTitle: string;
}

interface PriorityResult {
  id: string;
  priority: "high" | "medium" | "low";
  reason: string;
}

interface GeminiError {
  status?: number;
  message?: string;
}

async function callGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    const e = err as GeminiError;
    if (e?.status === 503 || e?.message?.includes("503")) {
      const result = await fallbackModel.generateContent(prompt);
      return result.response.text().trim();
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tasks } = (await req.json()) as { tasks: TaskInput[] };

    if (!tasks?.length) {
      return NextResponse.json({ error: "No tasks provided." }, { status: 400 });
    }

    const prompt = `
You are a project management AI. Analyze these tasks and assign a priority level to each.

Tasks:
${tasks
  .map(
    (t, i) =>
      `${i + 1}. [ID: ${t.id}] [Column: ${t.columnTitle}] Title: "${t.title}"${
        t.description ? ` | Description: "${t.description}"` : ""
      }`
  )
  .join("\n")}

Priority rules:
- "high": urgent, blocking others, deadline soon, critical bug/issue, or in "In Review" column waiting for approval
- "medium": important but not blocking, in progress, moderate complexity
- "low": planned tasks, nice-to-have, or in backlog/todo with no urgency

Return ONLY a valid JSON array, no explanation, no markdown, no backticks:
[
  { "id": "task_id", "priority": "high" | "medium" | "low", "reason": "one short sentence" },
  ...
]
`;

    const raw = await callGemini(prompt);
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let results: PriorityResult[];
    try {
      results = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid response." },
        { status: 500 }
      );
    }

    const validPriorities = ["high", "medium", "low"];
    results = results.map((r) => ({
      ...r,
      priority: validPriorities.includes(r.priority)
        ? r.priority
        : "medium",
    })) as PriorityResult[];

    return NextResponse.json({ results });
  } catch (err) {
    const e = err as GeminiError;
    if (e?.status === 503 || e?.message?.includes("503")) {
      return NextResponse.json(
        { error: "AI is currently overloaded. Please try again." },
        { status: 503 }
      );
    }
    console.error("Prioritize error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}