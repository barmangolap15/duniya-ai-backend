# LevelUp / DuniyaAI — Firebase Deployment

## 🌐 Live Production Deployment
- **Frontend URL**: [https://duniyaai-ddc79.web.app](https://duniyaai-ddc79.web.app)
- **Firebase Project Console**: [https://console.firebase.google.com/project/duniyaai-ddc79/overview](https://console.firebase.google.com/project/duniyaai-ddc79/overview)
- **Status**: Live, SSL Active, Global CDN Deployed

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    Client["Browser Users (Students, Mentors, Parents)"]

    subgraph Firebase["Firebase & Google Cloud Platform"]
        Hosting["Firebase App Hosting / Hosting\n(Next.js 14 App Router)"]
        CloudRun["Google Cloud Run / Firebase Functions v2\n(NestJS Backend API Container)"]
        CloudSQL[("Google Cloud SQL for PostgreSQL\n(Managed Relational Database)")]
    end

    Client -->|HTTPS / Port 443| Hosting
    Hosting -->|/api/* Rewrites| CloudRun
    CloudRun -->|Prisma Client / DATABASE_URL| CloudSQL
```

### Why this architecture?
1. **Frontend (Next.js 14)**: Uses **Firebase App Hosting** (Google's official hosting for modern Next.js App Router applications). It handles server-side rendering (SSR), dynamic routes (`/mission/[id]`, `/portfolio/[id]`), and static asset optimization automatically.
2. **Backend (NestJS API)**: Containerized with Docker and hosted on **Google Cloud Run** (which is the serverless container engine backing Firebase 2nd-generation services).
3. **Database (PostgreSQL + Prisma)**: Firebase's native databases (Firestore / Realtime Database) are NoSQL document stores. LevelUp uses relational integrity (Students, Mentors, Parents, Submissions, Reviews, Threads). In the Firebase / GCP ecosystem, this runs on **Google Cloud SQL for PostgreSQL** (or serverless Postgres providers like Neon / Supabase).
4. **Single Custom Domain & Zero CORS**: Firebase Hosting rewrites any `/api/**` traffic directly to your backend Cloud Run container, eliminating CORS configuration issues completely.

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Set up PostgreSQL on Google Cloud SQL (or Neon/Supabase)

1. Enable Cloud SQL in your Google Cloud / Firebase console.
2. Create a **PostgreSQL 15 or 17** instance (e.g. `levelup-db`).
3. Set your database user (`postgres`) and password.
4. Copy your connection string:
   ```bash
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_CLOUD_SQL_IP:5432/levelup?schema=public"
   ```

---

### Step 2: Deploy Backend to Google Cloud Run (Firebase Container)

Install the Google Cloud CLI (`gcloud`) or Firebase CLI:

```bash
# 1. Login to Google Cloud / Firebase
gcloud auth login
gcloud config set project YOUR_FIREBASE_PROJECT_ID

# 2. Build and deploy the container from backend directory
cd backend

gcloud builds submit --tag gcr.io/YOUR_FIREBASE_PROJECT_ID/levelup-backend

gcloud run deploy levelup-backend \
  --image gcr.io/YOUR_FIREBASE_PROJECT_ID/levelup-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://...,JWT_SECRET=your-production-secret-key,PORT=4000"
```

Once deployed, Google Cloud Run will output a public service URL (e.g., `https://levelup-backend-xyz-uc.a.run.app`).

---

### Step 3: Deploy Frontend to Firebase App Hosting

Firebase App Hosting is designed natively for Next.js 14:

```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase App Hosting in your project root
cd /Users/golapbarman/duniya_ai
firebase apphosting:backends:create --project YOUR_FIREBASE_PROJECT_ID
```

Follow the interactive prompts to connect your GitHub repository and branch. Firebase App Hosting will:
- Detect Next.js 14 automatically.
- Build the production bundle.
- Deploy with global CDN caching and SSL.

#### Alternative: Deploy via Firebase Hosting with Web Frameworks
```bash
# In frontend directory
cd frontend
firebase experiments:enable webframeworks
firebase init hosting
firebase deploy --only hosting
```

---

## 🔒 Production Environment Variables Checklist

| Service | Variable | Value / Description |
| :--- | :--- | :--- |
| **Backend** | `DATABASE_URL` | PostgreSQL connection string (`Cloud SQL` or `Neon`) |
| **Backend** | `JWT_SECRET` | 32+ character random string for signing JWT tokens |
| **Backend** | `PORT` | `4000` (or `8080` for default Cloud Run) |
| **Frontend** | `NEXT_PUBLIC_API_URL` | Optional if using Firebase Hosting rewrites (`/api`), or your Cloud Run URL |
