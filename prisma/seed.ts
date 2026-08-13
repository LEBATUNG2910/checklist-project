// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Columns ──────────────────────────────────────────────────
  const todoCol = await prisma.kanbanColumn.upsert({
    where: { id: "col-todo" },
    update: {},
    create: { id: "col-todo", title: "To Do", colorClass: "bg-blue-600", order: 0 },
  });

  const progressCol = await prisma.kanbanColumn.upsert({
    where: { id: "col-progress" },
    update: {},
    create: { id: "col-progress", title: "In Progress", colorClass: "bg-slate-800", order: 1 },
  });

  const reviewCol = await prisma.kanbanColumn.upsert({
    where: { id: "col-review" },
    update: {},
    create: { id: "col-review", title: "In Review", colorClass: "bg-orange-400", order: 2 },
  });

  // ── Sample tasks ─────────────────────────────────────────────
  await prisma.kanbanTask.upsert({
    where: { id: "seed-t1" },
    update: {},
    create: {
      id: "seed-t1",
      title: "Brand Guideline Design",
      platformName: "Gmail",
      columnId: reviewCol.id,
      order: 0,
    },
  });

  await prisma.kanbanTask.upsert({
    where: { id: "seed-t2" },
    update: {},
    create: {
      id: "seed-t2",
      title: "API Gateway Implementation",
      description: "Develop and implement the API gateway for the application.",
      platformName: "GitHub",
      columnId: progressCol.id,
      order: 0,
    },
  });

  await prisma.kanbanTask.upsert({
    where: { id: "seed-t3" },
    update: {},
    create: {
      id: "seed-t3",
      title: "Competitor Analysis",
      description: "Research and analyze competitor products.",
      platformName: "Slack",
      columnId: todoCol.id,
      order: 0,
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   Columns: ${todoCol.title}, ${progressCol.title}, ${reviewCol.title}`);
  console.log("   Tasks: 3 sample tasks created");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });