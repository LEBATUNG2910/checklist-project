// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Sửa thành DIRECT_URL để chạy lệnh db push / migrate không bị treo trên Supabase
    url: process.env.DIRECT_URL!, 
  },
});