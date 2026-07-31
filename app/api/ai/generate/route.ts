import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/ai/client";
import { buildGenerateTaskPrompt, ColumnInfo } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, columns } = body as {
      userInput: string;
      columns: ColumnInfo[];
    };

    // Validate input
    if (!userInput?.trim()) {
      return NextResponse.json(
        { error: "userInput is required" },
        { status: 400 }
      );
    }

    if (!columns?.length) {
      return NextResponse.json(
        { error: "columns is required" },
        { status: 400 }
      );
    }

    // Build prompt and call Gemini
    const prompt = buildGenerateTaskPrompt(userInput.trim(), columns);
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Strip markdown code fences if Gemini adds them
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    // Parse and validate the JSON response
    let parsed: {
      title: string;
      description: string;
      platformName: string;
      columnId: string;
    };

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Gemini returned invalid JSON:", raw);
      return NextResponse.json(
        { error: "AI returned invalid response. Please try again." },
        { status: 500 }
      );
    }

    // Validate required fields
    const VALID_PLATFORMS = ["Gmail", "Slack", "GitHub", "Messenger", "Discord"];
    const validColumnIds = columns.map((c) => c.id);

    if (!parsed.title) {
      return NextResponse.json({ error: "AI did not return a title" }, { status: 500 });
    }

    // Fallback if AI returns invalid values
    if (!VALID_PLATFORMS.includes(parsed.platformName)) {
      parsed.platformName = "Gmail";
    }
    if (!validColumnIds.includes(parsed.columnId)) {
      parsed.columnId = columns[0].id;
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}