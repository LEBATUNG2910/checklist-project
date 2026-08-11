export interface ColumnInfo {
  id: string;
  title: string;
}

export const buildGenerateTaskPrompt = (
  userInput: string,
  columns: ColumnInfo[]
) => {
  // Lấy ngày hiện tại để làm mốc tính toán thời gian cho AI
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return `
You are a smart project management assistant for WorkAI.

Today's date is: ${currentDate}.

The user described their plan:
"${userInput}"

The board columns are:
${columns.map((c) => `- id: "${c.id}", title: "${c.title}"`).join("\n")}

Choose platformName using THESE EXACT RULES — read every keyword carefully:
- "GitHub" → if input mentions: code, commit, pull request, PR, branch, bug, fix, deploy, repository, repo, API, backend, frontend, function, unit test, test, debug, build, script, programming, develop, feature
- "Slack" → if input mentions: meeting, discuss, team, channel, notify, update, standup, sync, call, announce, message, chat
- "Discord" → if input mentions: discord, community, server, voice, bot
- "Messenger" → if input mentions: messenger, facebook, client, customer, user feedback, support
- "Gmail" → ONLY if input is clearly about email, inbox, send email, reply email, or nothing matches above

Column selection rules:
- "col-todo" → planned future task, not started
- "col-progress" → doing it now, today, currently, đang làm, hôm nay
- "col-review" → needs review, checking, testing, QA, kiểm tra

Due Date extraction rules:
- If the user mentions a specific date or relative time (e.g., "tomorrow", "next Friday", "in 2 days", "ngày mai", "tuần sau"), calculate the exact date based on today's date.
- Format the date STRICTLY as "YYYY-MM-DD" (e.g., "2026-08-15").
- If no date or time is mentioned in the input, return null.

Return ONLY this JSON, no explanation, no markdown, no backticks:
{
  "title": "...",
  "description": "...",
  "platformName": "...",
  "columnId": "...",
  "dueDate": "YYYY-MM-DD or null"
}
`;
};