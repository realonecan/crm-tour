# Tour CRM System

A simple full-stack CRM platform for managing tours, bookings, leads, and customers.  
Built with **Node.js**, **Express**, **Prisma**, and **Next.js**.

---

##  Tech Stack
- **Backend:** Node.js + Express + Prisma (SQLite → PostgreSQL)
- **Frontend:** Next.js + Tailwind CSS + shadcn/ui
- **Auth:** Demo login (Admin / Manager)
- **Validation:** Zod / express-validator

---

##  Features
- Dashboard with KPIs and charts  
- Tour and schedule management  
- Booking and payment tracking  
- Lead management and conversion  
- Customer timelines  
- Role-based access (Admin / Manager)

---

## Setup

```bash
# Install deps
npm install

# Setup Prisma
npx prisma migrate dev
npx prisma db seed

# Run backend
npm run dev

# (Optional) Run frontend
cd frontend && npm run dev
Backend runs on http://localhost:3000

Demo Accounts
Role	Email	Password
Admin	admin@demo.com	admin123
Manager	manager@demo.com	manager123

 Structure
backend/     - Express API + Prisma
frontend/    - Next.js CRM UI
prisma/      - schema & seed
docs/        - specs & architecture
API Base
/api/v1
Example:

GET /api/v1/tours
POST /api/v1/bookings
PATCH /api/v1/leads/:id/status