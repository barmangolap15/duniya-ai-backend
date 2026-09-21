# LevelUp — Gamified Learning & Verified Talent Platform

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/barmangolap15/duniya-ai-backend)

- **Frontend (Live on Firebase)**: [https://duniyaai-ddc79.web.app](https://duniyaai-ddc79.web.app)
- **Backend Blueprint**: [`render.yaml`](./render.yaml)

LevelUp is an industry-standard gamified learn-by-doing platform that bridges the gap between learning to code and proving real-world competence. Instead of static certificate pdfs, students build real applications in a live browser sandbox that produce 100% verified, runnable portfolios reviewed by mentors and scouted by recruiters.

---

## 🌟 The 4 Ecosystem Portals

LevelUp connects four key stakeholders around verified proof-of-work:

1. **👨‍🎓 Students & Public Portfolio (`/portfolio/[id]`)**:
   - Duolingo-style progressive step-by-step code guidance with real-time DOM validation.
   - CodeMirror 6 tabbed editor (HTML, CSS, JavaScript) with debounced live preview iframe.
   - Shareable Public Portfolio with verified code badges, project inspect modal, and live interactive demo viewer.
   - XP progression, streaks, and achievement levels.

2. **👨‍👩‍👧 Parent Section (`/parent`)**:
   - Comprehensive parental oversight into their child's learning velocity and study hours.
   - Streak health tracking, track completion percentage, and curriculum milestones.
   - Read staff mentor feedback commendations on their child's actual code.
   - Send motivational "Cheer" boosts that reward student accounts with encouragement +15 XP!

3. **👩‍🏫 Mentor Section (`/mentor`)**:
   - Interactive code review workbench with split-screen code inspection (HTML/CSS/JS) and live sandboxed execution.
   - Evaluation rubric: 5-star ratings and constructive engineering feedback notes.
   - Approve & endorse submissions (+35 bonus XP to students) or request revisions.
   - Mentor statistics dashboard tracking reviews given and mentees guided.

4. **💼 Recruiter Section (`/recruiter`)**:
   - Searchable talent directory of junior and apprentice engineers.
   - Filter candidates by career track, verified skills (HTML, CSS, JS), and level.
   - Direct link to inspect runnable sandboxed portfolios.
   - Bookmark candidates to a saved recruiting pipeline shortlist.
   - Dispatch official job and interview invitations.

---

## ⚡ Instant Demo Accounts

Explore all roles immediately (Password for all: `12345678`):

| Role | Name | Email | Direct Link |
|------|------|-------|-------------|
| **Student** | Alex Rivera | `student@levelup.com` | [Student Dashboard](http://localhost:3000/dashboard) |
| **Top Student** | Sarah Chen | `sarah@levelup.com` | [Public Showcase](http://localhost:3000/portfolio/cmu13h32g000itjwla1ph77nc) |
| **Parent** | David Rivera | `parent@levelup.com` | [Parent Section](http://localhost:3000/parent) |
| **Staff Mentor** | Elena Rostova | `mentor@levelup.com` | [Mentor Hub](http://localhost:3000/mentor) |
| **Tech Recruiter** | Rachel Adams | `recruiter@levelup.com` | [Recruiter Portal](http://localhost:3000/recruiter) |

> **Tip:** You can also use the **Demo Role Switcher** widget inside the web app sidebar to switch between any of these roles with 1 click!

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS + TanStack Query |
| **Code Editor** | CodeMirror 6 (One Dark Theme, HTML, CSS, JavaScript) |
| **Backend** | NestJS (Modular Architecture, Controllers, Services, Guards) |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | JWT (bcryptjs password hashing, Passport JWT guard) |
| **Sound & UX** | Web Audio API sound synthesis, Framer Motion animations |

---

## 🚀 Running the Application

### 1. Database & Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```
Backend runs at **http://localhost:4000**

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at **http://localhost:3000**

---

## 📡 Complete API Overview

### Authentication & Users
- `POST /auth/register` — Create new student account
- `POST /auth/login` — Sign in and receive JWT token
- `GET /auth/me` — Get authenticated user details & role
- `GET /users/public/:id` — **Public** portfolio profile & verified projects
- `PATCH /users/me` — Update bio, headline, GitHub & LinkedIn links

### Career Quiz & Roadmap
- `GET /quiz/questions` — Retrieve swipe career assessment questions
- `POST /quiz/submit` — Submit answers, determine career track, generate roadmap
- `GET /dashboard` — Retrieve active missions, velocity, streaks, and progress

### Missions & Sandboxed Submissions
- `GET /missions` — List all missions grouped by courses
- `GET /missions/:id` — Mission details with starter code and progressive steps
- `POST /submissions/autosave` — Debounced code autosave
- `POST /submissions/submit` — Submit mission code and claim XP

### Parent Section (`/parent`)
- `GET /parent/children` — List linked children, study hours, streaks, and mentor reviews
- `POST /parent/link` — Link a child by student email
- `POST /parent/cheer` — Send motivational cheer note with +15 XP boost

### Mentor Section (`/mentor`)
- `GET /mentor/queue` — Submissions queue (filter by SUBMITTED, APPROVED, ALL)
- `POST /mentor/review/:submissionId` — Submit 1-5 star review, feedback, and approval
- `GET /mentor/stats` — Metrics for evaluations completed, average rating, and active mentees

### Recruiter Section (`/recruiter`)
- `GET /recruiter/candidates` — Search talent directory by query, track, and skill badges
- `POST /recruiter/bookmark/:studentId` — Toggle saving a candidate to shortlist
- `GET /recruiter/saved` — View saved talent shortlist
- `POST /recruiter/outreach/:studentId` — Dispatch interview invitations
