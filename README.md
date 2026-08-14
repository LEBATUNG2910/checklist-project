<div align="center">

# 🧠 WorkAI

### AI-powered Task Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Prisma_Postgres-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-Google_OAuth_2.0-red?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Animation-Framer_Motion-pink?style=for-the-badge" />
</p>

<br />

> **WorkAI** is a modern, AI-powered task management web app that helps individuals and teams organize work, track progress, and stay on top of priorities — all in one place.

<br />

**[🚀 Live Demo](https://checklist-project-three.vercel.app)** · **[📖 Docs](#-getting-started)** · **[🐛 Report Bug](https://github.com/issues)**

</div>

---

## ✨ Features

### 🎯 Task Management
- **Kanban Board** — sticky-note style cards with rotation animation, paginated columns
- **List View** — grouped by column with status badges
- **Table View** — spreadsheet-style with sortable columns
- **Task Detail Panel** — slide-in panel with inline editing, move between columns, priority badge
- **Done Button** — one-click task completion with animation, synced to database

### 🤖 AI-Powered
- **AI Task Generation** — type your plan in natural language, AI creates a structured task card (supports Vietnamese & English)
- **AI Auto-Prioritize** — analyzes all tasks and sorts them by urgency (🔴 High / 🟡 Medium / 🟢 Low) with automatic reorder
- Powered by **Google Gemini 1.5 Flash** with automatic fallback model

### 🔐 Authentication
- **Google OAuth 2.0** — one-click sign in with Google
- **Email + Password** — traditional signup/login with SHA-256 hashed passwords
- **Session cookies** — secure, httpOnly, 7-day expiry
- **Route protection** — middleware guards all pages

### 📬 Messages & Feeds
- **6 Platform Feeds** — Microsoft Teams, Slack, GitHub, Messenger, Gmail, Discord
- **3 Tabs per feed** — Messages (real task data) · Advertisement · Social Media
- **Gmail-style UI** — hover actions, star, archive, unread indicators

### 🔔 Notifications
- **Real-time notifications** — generated from actual board data (high priority tasks, tasks in review)
- **Bell dropdown** — mark individual or all-read, live unread count badge

### 🔍 Search
- **Global search** — searches across all tasks AND all platform messages simultaneously
- **Highlighted matches** — yellow highlight on matching keywords
- **Click to navigate** — click task result opens detail panel, click message switches platform

### 📊 Dashboard
- Metrics cards, charts, active contributors, project timeline

### ⚙️ Settings
- **Profile** — edit name, bio, avatar
- **Account** — account info, sign out
- **Appearance** — theme (Light/Dark/System), accent color, font size, compact mode
- **Notifications** — toggle granular alert preferences
- **Security** — change password, danger zone

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Animation** | Framer Motion |
| **State Management** | Zustand (with localStorage persist) |
| **Database** | PostgreSQL via Prisma Postgres |
| **ORM** | Prisma v7 with `@prisma/adapter-pg` |
| **AI** | Google Gemini 1.5 Flash |
| **Auth** | Custom Google OAuth 2.0 + Email/Password |
| **Deployment** | Vercel |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
checklist/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── generate/      ← AI task generation
│   │   │   └── prioritize/    ← AI auto-prioritize
│   │   ├── auth/
│   │   │   ├── google/        ← OAuth redirect
│   │   │   ├── callback/      ← OAuth callback
│   │   │   ├── login/         ← Email/password login
│   │   │   ├── signup/        ← Email/password signup
│   │   │   ├── logout/        ← Clear session
│   │   │   └── me/            ← Get current user
│   │   ├── columns/           ← GET board columns + tasks
│   │   └── tasks/
│   │       └── [id]/
│   │           ├── route.ts   ← PUT/DELETE task
│   │           └── move/      ← Move task to column
│   ├── home/
│   │   ├── components/        ← All page components
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx           ← Login + Signup modal
│   └── settings/
│       ├── components/        ← Settings tab components
│       └── page.tsx
├── lib/
│   ├── ai/
│   │   ├── client.ts          ← Gemini client + fallback
│   │   └── prompts.ts         ← Prompt templates
│   ├── db/
│   │   └── prisma.ts          ← Prisma client singleton
│   ├── session.ts             ← Session encode/decode
│   ├── session.server.ts      ← Server-only session (next/headers)
│   ├── users.ts               ← File-based user storage (email auth)
│   ├── mock-data.tsx          ← Seed/fallback data
│   ├── mock-messages.ts       ← Platform message mock data
│   ├── mock-notifications.ts  ← Notification mock data
│   └── mock-ads.ts            ← Ads + social posts mock data
├── prisma/
│   ├── schema.prisma          ← DB schema
│   └── seed.ts                ← Seed script
├── store/
│   ├── taskStore.ts           ← Board state + API calls
│   ├── uiStore.ts             ← Active menu + mobile state
│   ├── searchStore.ts         ← Search query + bar position
│   └── notificationStore.ts   ← Notifications from task data
├── types/
│   └── dashboard.ts           ← Shared TypeScript types
├── middleware.ts               ← Route protection
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A PostgreSQL database (Prisma Postgres, Supabase, Neon, etc.)
- Google Cloud project with OAuth 2.0 credentials
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/workai.git
cd workai
```

### 2. Install dependencies

```bash
npm install
npm install @prisma/adapter-pg pg
npm install -D tsx @types/pg
```

### 3. Set up environment variables

Create a `.env.local` file:

```env
# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session
SESSION_SECRET=your_random_secret_32_chars

# AI
GEMINI_API_KEY=your_gemini_api_key

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed
```

### 5. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized origins: `http://localhost:3000`
4. Add redirect URI: `http://localhost:3000/api/auth/callback`

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Update `NEXT_PUBLIC_BASE_URL` to your Vercel domain
5. Update Google OAuth redirect URI to `https://yourdomain.vercel.app/api/auth/callback`
6. Deploy

---

## 📸 Screenshots

| Kanban Board | Task Detail | Login |
|---|---|---|
| Sticky-note style cards | Slide-in edit panel | Google OAuth |

| AI Prioritize | Search | Settings |
|---|---|---|
| Auto-sort by urgency | Global search with highlight | 5-tab settings page |

---

## 🗺 Roadmap

- [ ] Due dates & deadline reminders
- [ ] Dark mode implementation
- [ ] Real-time dashboard metrics
- [ ] Drag & drop Kanban
- [ ] Email notifications
- [ ] Team workspaces
- [ ] Export to CSV/PDF
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Lê Bá Tùng**

- 🎓 IT Graduate — Swinburne University of Technology, Ho Chi Minh City
- 💼 Fullstack Developer (React · Next.js · TypeScript · NestJS · MongoDB)
- 🌐 [GitHub](https://github.com/yourusername)
- 📧 [Email](mailto:youremail@gmail.com)
- 🔗 [LinkedIn](https://linkedin.com/in/yourprofile)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**⭐ Star this repo if you found it useful!**

Made with ❤️ by Lê Bá Tùng

</div>
