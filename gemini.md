# Gemini M&E System Backup & State

## 1. Project Overview
- **Project Name:** M_and_E_System
- **Frontend & Backend:** Next.js (App Router API Routes) + Vanilla JS Dashboard
- **Database:** MongoDB Atlas (`M_E_System` database)
- **GitHub Repository:** `https://github.com/hengsna/system-document.git`
- **Important Note:** The Laravel backend (`m_e_backend`) has been completely abandoned. All database logic was successfully ported to Next.js API Routes (`survey-builder/app/api`).

## 2. Local Development Configuration
- **Root Directory:** `survey-builder`
- **Start Command:** `npm run dev` (run inside `survey-builder`)
- **Dashboard URL:** `http://localhost:3000/dashboard.html`
- **Database Connection:** Stored in `survey-builder/.env.local` using `MONGODB_URI`.

## 3. Administrator Credentials
When logging into the system on the dashboard, use the following super-admin credentials:
- **Username:** `admin`
- **Password:** `admin123@`

## 4. Work Accomplished Today
- Successfully ported all Laravel API routes (`/api/login`, `/api/users`, `/api/roles`, `/api/locations`) to Next.js API routes.
- Wrote a Node script to bypass UI setup and directly inject the `admin` user into the MongoDB database.
- Upgraded the Survey Builder (`Toolbar.tsx`) with **Save Draft** and **Deploy Survey** buttons connected to a new `/api/surveys` route to write directly to MongoDB.

## 5. Pending Tasks for Future Sessions
- Continue building out specific module logic in the Dashboard UI.
- Allow regular users to fetch and submit "Deployed" surveys.
