# Gemini M&E System Backup & State

## 1. Project Overview
- **Project Name:** M_and_E_System
- **Frontend Framework:** Next.js + Vanilla JS Dashboard
- **Backend Framework:** Laravel (PHP 8.2)
- **Database:** PostgreSQL
- **GitHub Repository:** `https://github.com/hengsna/system-document.git`

## 2. Server & Deployment Configuration

### Frontend (Vercel)
- **Hosting Platform:** Vercel (Free)
- **Root Directory:** `survey-builder`
- **Framework Preset:** Next.js
- **Links:** 
  - Survey Builder: `/`
  - Admin Dashboard: `/dashboard.html`

### Backend (Render)
- **Hosting Platform:** Render.com (Web Service - Free Tier)
- **Root Directory:** `m_e_backend`
- **Environment:** PHP
- **Build Command:** `composer install && php artisan migrate --force`
- **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`

### Database (Render PostgreSQL)
- **Host:** `dpg-db16p46gekts73cfn700-a.ohio-postgres.render.com`
- **Database Name:** `m_and_e_system_db`
- **Username:** `m_and_e_system_db_user`
- **Password:** `uiBJwCfQvxLO7vPQOWgWQOF2R763HyMd`
- *Note: These credentials have already been hardcoded into `m_e_backend/.env.example` and pushed to GitHub.*

## 3. Administrator Credentials
When logging into the system, use the following super-admin credentials:
- **Username:** `chveasna`
- **Password:** `admin123$`

## 4. Pending Tasks for Future Sessions
To fully complete the system linkage in the next session, the following steps must be taken:
1. Finish deploying the Laravel backend on Render.
2. Copy the final live Render URL (e.g., `https://m-and-e-backend.onrender.com`).
3. Open `survey-builder/public/admin_logic.js`.
4. Change the first line from `const API_BASE = 'http://127.0.0.1:8000/api';` to the new live Render URL.
5. Commit and push the code to GitHub so Vercel updates the frontend to talk to the live backend.
