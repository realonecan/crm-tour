# 🧭 TASKS.md

## Overview
This file defines the **development roadmap** for the Tour CRM System.  
Each phase contains small, clear, actionable steps for **AgentCoder** to execute sequentially.

Goal: build a working **CRM backend (Express + Prisma)** and **CRM frontend (Next.js + Tailwind)**.

---

## 🧩 Phase 1 — Backend Foundation (Express + Prisma)

### 1. Setup
- Initialize backend folder: `/backend`
- Install dependencies:
  ```bash
  npm install express cors dotenv @prisma/client prisma
Create entry file: backend/app.ts

Enable express.json() and cors()

Add health route GET /api/health → { ok: true }

2. Prisma Integration
Create /prisma/schema.prisma using DATA_MODEL.md

Run:

bash
Copy code
npx prisma generate
npx prisma migrate dev
Add /prisma/client.ts exporting PrismaClient instance

3. Core Routes (Public)
Implement base folder structure:

Copy code
backend/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── middlewares/
 └── utils/
Create routes:

/api/v1/tours

/api/v1/bookings

/api/v1/leads

/api/v1/customers

/api/v1/dashboard

/api/v1/users

Each route file connects to its controller.

4. Controllers & Services
Follow API_SPEC.md to create matching controllers and services:

tours.controller.ts, tourService.ts

bookings.controller.ts, bookingService.ts

leads.controller.ts, leadService.ts

customers.controller.ts, customerService.ts

users.controller.ts, userService.ts

dashboard.controller.ts

Each controller:

Validates request

Calls service

Returns { success: true, data }

5. Middleware & Utilities
Create:

authMiddleware.ts — decodes demo JWT

roleGuard.ts — checks user role

errorHandler.ts — catches all API errors

validation.ts — optional Zod schemas

responses.ts — success/error response helpers

Standardize error format:

json
Copy code
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
6. Seed Data
Create /prisma/seed.ts:

Categories (6–8)

Tours (6–10)

TourDates (2–3 each)

Customers (10)

Bookings (12–15)

Leads (8–10)

Users (2 demo: admin, manager)

Run:

bash
Copy code
npx prisma db seed
✅ Backend Checkpoint
After Phase 1:

API responds at http://localhost:3000/api/v1

/tours, /bookings, /leads, /dashboard all return mock or real data

Role-based access verified

💻 Phase 2 — CRM Frontend (Next.js + Tailwind)
1. Setup
Initialize /frontend:

bash
Copy code
npx create-next-app@latest frontend
Install:

bash
Copy code
npm install axios react-query @tanstack/react-query tailwindcss shadcn-ui
Configure Tailwind and shadcn components.

2. Global Layout & Auth
Create simple login form (demo mode)

Store JWT token in localStorage or cookies

Add layout with sidebar and topbar

3. Dashboard Page
Fetch /api/v1/dashboard/stats

Display KPI cards and charts (bookings, revenue)

Use Recharts or similar for visualization

4. Modules (Pages)
Create pages matching backend routes:

Page	API Endpoint
/tours	/api/v1/tours
/bookings	/api/v1/bookings
/leads	/api/v1/leads
/customers	/api/v1/customers
/users	/api/v1/users

Each page:

Uses React Query to fetch data

Displays table + filter bar

Provides modals for CRUD actions

5. Reusable Components
DataTable.tsx — sortable, paginated list

ModalForm.tsx — reusable form dialog

StatusBadge.tsx — colored tag for status

KPIBox.tsx — for dashboard cards

ConfirmDialog.tsx — reusable confirmation popup

✅ Frontend Checkpoint
After Phase 2:

Admin can login (demo)

Dashboard shows live stats

Tours and Bookings modules fully functional

🔁 Phase 3 — Integration & Finalization
1. Connect Frontend → Backend
Configure .env.local:

bash
Copy code
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
All pages use Axios / React Query to call backend.

Handle loading and error states properly.

2. Validation & Security
Apply input validation using Zod

Sanitize all form fields

Ensure Admin-only routes are protected by role check

3. Testing
Test endpoints using Postman or Thunder Client

Check CRUD operations and RBAC rules

Verify Booking.status and Lead.status transitions

4. Deployment
Backend:

Deploy to Render / Railway / Replit

Use PostgreSQL in production

Frontend:

Deploy to Vercel

🧾 Final Deliverables
Fully working backend API

Functional CRM dashboard UI

Clean Prisma schema + seed data

Documented routes and roles

Demo accounts:

graphql
Copy code
admin@demo.com / admin123
manager@demo.com / manager123
🧠 Notes for AgentCoder
Follow ARCHITECTURE.md for folder structure.

Use the Prisma models from DATA_MODEL.md.

Implement endpoints exactly as defined in API_SPEC.md.

Return consistent response format.

Maintain modular, clean code separation (controllers → services → DB).