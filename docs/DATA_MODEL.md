## Overview
This document defines the **data schema** for the Tour CRM System using **Prisma ORM**.  
All entities are relational and designed to support both the **Mini App (public)** and **CRM Dashboard (admin/manager)** sides.

---

## ⚙️ Database Overview
The database uses a relational model optimized for read/write efficiency.  
Main entities:

- Category  
- Tour  
- TourDate  
- Customer  
- Booking  
- Lead  
- User  

Each entity includes timestamps (`createdAt`, `updatedAt`) for audit and sorting.

---

## 🧱 Prisma Models

### 1. `Category`
Represents a tour category (e.g., Hiking, Auto, Camping).

```prisma
model Category {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  icon      String?
  color     String?

  tours     Tour[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
2. Tour
Main tour definition with general info and defaults.

prisma
Copy code
model Tour {
  id           Int        @id @default(autoincrement())
  title        String
  slug         String     @unique
  type         String
  duration     Int        // in days
  difficulty   String
  basePrice    Int
  status       String     @default("DRAFT") // DRAFT | PUBLISHED
  cover        String?
  gallery      String[]
  description  String?
  inclusions   String[]
  exclusions   String[]
  meetingPoint String?

  categoryId   Int
  category     Category   @relation(fields: [categoryId], references: [id])

  tourDates    TourDate[]
  leads        Lead[]

  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}
3. TourDate
Represents a specific scheduled date for a tour.

prisma
Copy code
model TourDate {
  id            Int        @id @default(autoincrement())
  tourId        Int
  date          DateTime
  maxGroupSize  Int
  priceOverride Int?

  tour          Tour       @relation(fields: [tourId], references: [id])
  bookings      Booking[]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}
4. Customer
Holds all client information, unique by phone number.

prisma
Copy code
model Customer {
  id        Int        @id @default(autoincrement())
  fullName  String
  phone     String     @unique
  email     String?
  telegram  String?

  bookings  Booking[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
5. Booking
Tracks reservations made by customers for a specific tour date.

prisma
Copy code
model Booking {
  id          Int        @id @default(autoincrement())
  tourDateId  Int
  customerId  Int
  people      Int
  totalPrice  Int
  status      String     @default("NEW") // NEW | PAID | CANCELLED
  note        String?

  tourDate    TourDate   @relation(fields: [tourDateId], references: [id])
  customer    Customer   @relation(fields: [customerId], references: [id])

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
Rules:

people >= 1

totalPrice is computed as (tourDate.priceOverride ?? tour.basePrice) * people

Server always recalculates totalPrice (never trust client input)

6. Lead
Public inquiry or interest submitted via the Mini App.

prisma
Copy code
model Lead {
  id          Int       @id @default(autoincrement())
  name        String
  phone       String
  email       String?
  message     String?
  status      String     @default("OPEN") // OPEN | IN_PROGRESS | CLOSED

  tourId      Int?
  tour        Tour?      @relation(fields: [tourId], references: [id])

  assignedTo  Int?
  assigned    User?      @relation(fields: [assignedTo], references: [id])

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
7. User
System user (Admin or Manager) for CRM access.

prisma
Copy code
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String?
  role      String    @default("MANAGER") // ADMIN | MANAGER

  leads     Lead[]    @relation("UserLeads")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
🔄 Relations Summary
Relationship	Type	Description
Category → Tour	1 → N	Each category has many tours
Tour → TourDate	1 → N	Each tour can have multiple dates
TourDate → Booking	1 → N	Each date has many bookings
Customer → Booking	1 → N	Each customer can book multiple tours
Tour → Lead	1 → N	Each tour can have multiple leads
User → Lead	1 → N	Managers/Admins can be assigned leads

🧮 Derived Fields & Computed Logic
Field	Computed Logic
Booking.totalPrice	priceOverride ?? basePrice * people
Booking.status	Updated via status change endpoints
Lead.status	OPEN → IN_PROGRESS → CLOSED
Tour.status	DRAFT → PUBLISHED → DRAFT

🧠 Indexes
Indexes that improve query performance:

prisma
Copy code
@@index([status])
@@index([tourId])
@@index([customerId])
@@index([date])
Apply to Tour, Booking, and TourDate for filtering efficiency.

🌱 Seed Data Recommendations
Used in /prisma/seed.ts for local demo.

Entity	Sample Count	Notes
Categories	6–8	Пеший, Авто, Кемпинг, Водный тур, ...
Tours	6–10	Each linked to Category
TourDates	2–3 per tour	Use future weekends
Customers	10	Random Uzbek names & phones
Bookings	12–15	Mixed NEW/PAID/CANCELLED
Leads	8–10	Random messages + statuses
Users	2	admin@demo.com, manager@demo.com

🧾 Example Prisma Relation Diagram
markdown
Copy code
Category ──< Tour ──< TourDate ──< Booking >── Customer
                     │
                     └──< Lead >── User
✅ Notes for AgentCoder
Always generate createdAt and updatedAt automatically.

Use snake_case to camelCase mapping in code (Prisma uses camelCase by default).

Implement referential integrity — if a Tour is deleted, its TourDates and Bookings should cascade.

Use enum types for statuses if possible for cleaner validation.

Example:

prisma
Copy code
enum BookingStatus {
  NEW
  PAID
  CANCELLED
}

enum LeadStatus {
  OPEN
  IN_PROGRESS
  CLOSED
}
📦 Output File
The Prisma schema generated from this doc should be saved at:

bash
Copy code
/prisma/schema.prisma
Run:

bash
Copy code
npx prisma generate
npx prisma migrate dev