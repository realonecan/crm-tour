## Overview
The **Tour CRM System** is a modular full-stack application for managing tours, bookings, leads, and customers.  
It has two parts:
1. **Backend (API Server)** — built with Node.js + Express + Prisma  
2. **Frontend (CRM Dashboard)** — built with Next.js + Tailwind + shadcn/ui  

The goal: provide a clean, maintainable architecture that allows Admins and Managers to manage all tour operations through one dashboard.

---

## 🧩 System Layers

### 1. Frontend (Next.js CRM)
- Located in `/frontend`
- Renders all Admin and Manager interfaces
- Communicates with backend via REST API (`/api/v1`)
- Uses React Query or Axios for data fetching
- UI built with Tailwind + shadcn/ui components

**Main pages:**
| Path | Purpose |
|------|----------|
| `/dashboard` | KPIs, bookings stats |
| `/tours` | List / Create / Edit / Publish tours |
| `/bookings` | Manage booking statuses (NEW, PAID, CANCELLED) |
| `/leads` | Handle leads and assign to managers |
| `/customers` | Show customer timelines |
| `/users` | Manage Admin/Manager roles (Admin only) |

---

### 2. Backend (Express API)
- Located in `/backend`
- Serves REST API under `/api/v1`
- Uses **Prisma ORM** to interact with SQLite (dev) or PostgreSQL (prod)
- Handles validation, authentication, and role-based access control

**Folder structure:**
backend/
├── app.ts # Express app entry
├── routes/ # Route definitions
│ ├── tours.routes.ts
│ ├── bookings.routes.ts
│ ├── leads.routes.ts
│ ├── customers.routes.ts
│ ├── users.routes.ts
│ └── dashboard.routes.ts
├── controllers/ # Request handlers (logic)
│ ├── tours.controller.ts
│ ├── bookings.controller.ts
│ ├── leads.controller.ts
│ ├── customers.controller.ts
│ └── users.controller.ts
├── services/ # Business logic + DB queries
│ ├── tourService.ts
│ ├── bookingService.ts
│ ├── leadService.ts
│ ├── customerService.ts
│ └── userService.ts
├── middlewares/
│ ├── authMiddleware.ts
│ ├── roleGuard.ts
│ └── errorHandler.ts
├── utils/
│ ├── validation.ts
│ ├── pricing.ts
│ └── responses.ts
├── prisma/
│ └── client.ts
└── index.ts # Server launcher

yaml
Copy code

---

## 🧱 Core Components

### 🧠 Controllers
Each controller:
- Receives validated HTTP requests
- Calls service layer functions
- Returns standardized JSON responses
- Handles all CRUD + state transitions (e.g., Booking: NEW → PAID → CANCELLED)

**Example:**  
`bookings.controller.ts`
```ts
// PATCH /bookings/:id/status
updateBookingStatus(req, res) {
  const { status } = req.body;
  const updated = await bookingService.updateStatus(req.params.id, status);
  res.json(updated);
}
⚙️ Services
Each service encapsulates DB operations and business rules.
All use Prisma Client imported from prisma/client.ts.

Example:
bookingService.ts

ts
Copy code
export async function updateStatus(id, status) {
  return prisma.booking.update({
    where: { id },
    data: { status },
  });
}
🔒 Middleware
File	Purpose
authMiddleware.ts	Validates JWT or demo session
roleGuard.ts	Checks if user is Admin or Manager
errorHandler.ts	Formats error responses uniformly

🗄️ Database Schema (High-Level)
Model	Key Fields	Relations
Category	title, slug, icon, color	1-to-many → Tour
Tour	title, type, duration, difficulty, basePrice, status	many-to-1 → Category
TourDate	tourId, date, maxGroupSize, priceOverride	many-to-1 → Tour
Customer	fullName, phone, email, telegram	1-to-many → Booking
Booking	tourDateId, customerId, people, totalPrice, status	many-to-1 → TourDate, Customer
Lead	name, phone, email, message, tourId, status, assignedTo	optional → Tour, User
User	name, email, role (ADMIN / MANAGER)	1-to-many → Lead.assignedTo

🔄 Status Flows
Booking
scss
Copy code
NEW → (payment) → PAID → (cancel) → CANCELLED
Lead
sql
Copy code
OPEN → (assign) → IN_PROGRESS → (convert/close) → CLOSED
Tour
scss
Copy code
DRAFT → (publish) → PUBLISHED → (unpublish) → DRAFT
Each transition triggers validation rules (e.g., cannot mark PAID if group size exceeded).

🔐 Role-Based Access (RBAC)
Action	Admin	Manager
Manage tours/dates	✅	✅
Manage categories	✅	❌
Manage bookings/leads	✅	✅
Manage users	✅	❌
View dashboard	✅	✅

Role checking is enforced via roleGuard.ts middleware.

🌐 API Base
All routes are prefixed with:

bash
Copy code
/api/v1
Examples:

GET /api/v1/tours

POST /api/v1/tours/:id/dates

PATCH /api/v1/bookings/:id/status

GET /api/v1/leads?status=OPEN

GET /api/v1/dashboard/stats?range=7d

Full endpoint list is in API_SPEC.md.

🧠 Data Flow Example
Booking Confirmation Flow
Frontend sends POST /bookings

Backend validates fields (customer, people count)

Service checks group size in TourDate

Prisma creates Customer (if not exists)

Prisma creates Booking with totalPrice

Returns success JSON to frontend

Optional: triggers email/SMS webhook

🧩 Deployment Overview
Component	Recommended Platform
Backend API	Render / Railway / Replit
Database	SQLite (dev) → PostgreSQL (prod)
Frontend (CRM)	Vercel
Auth	Demo JWT / NextAuth (future)

🧭 Development Guidelines
Use consistent folder names and naming conventions.

Use Prisma migrations for schema changes.

Always validate incoming data via Zod or validator middleware.

All responses follow standard format:

json
Copy code
{ "success": true, "data": {...} }
or

json
Copy code
{ "error": { "code": "VALIDATION_ERROR", "message": "phone is required" } }
Keep controllers thin — heavy logic goes in services/.

✅ Summary
The CRM follows a clean separation of concerns:

java
Copy code
Frontend UI (Next.js)
   ↓ REST API
Backend (Express)
   ↓
Service Layer
   ↓
Prisma ORM
   ↓
SQLite / PostgreSQL