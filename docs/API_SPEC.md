# 🌐 API_SPEC.md

## Overview
This file defines all **CRM backend REST API endpoints** for the Tour CRM System.  
Each endpoint includes:
- HTTP method and route
- Purpose
- Request body / query params
- Response format
- Role permissions

All routes share the base prefix:
/api/v1

yaml
Copy code

---

## 🧠 Auth
Simple demo login (no password hash yet).

### POST `/auth/demo`
**Purpose:** Simulate login as Admin or Manager  
**Body:**
```json
{ "role": "ADMIN" }
Response:

json
Copy code
{ "success": true, "user": { "id": 1, "name": "Admin", "role": "ADMIN", "token": "jwt_token" } }
Notes:

Used to generate JWT stored in cookie.

Role determines access permissions.

📊 Dashboard
GET /dashboard/stats?range=7d
Purpose: Fetch KPIs and chart data for given time range.
Query params:

range: 1d | 7d | 30d

Response:

json
Copy code
{
  "success": true,
  "data": {
    "ordersToday": 3,
    "ordersWeek": 18,
    "totalRevenue": 2400000,
    "activeTours": 6,
    "bookingsPerDay": [ { "date": "2025-10-01", "count": 2 }, ... ],
    "revenuePerDay": [ { "date": "2025-10-01", "sum": 400000 }, ... ],
    "statusShare": { "NEW": 8, "PAID": 5, "CANCELLED": 2 }
  }
}
🗺️ Tours
GET /tours
Purpose: List all tours (admin view).
Query params:
q, status, category

Response:

json
Copy code
{
  "success": true,
  "data": [{ "id": 1, "title": "Lashkarak Forest", "status": "PUBLISHED", "category": {...} }]
}
POST /tours
Purpose: Create a new tour.
Body:

json
Copy code
{
  "title": "Kichik Chimyon",
  "type": "Hiking",
  "duration": 2,
  "difficulty": "Medium",
  "basePrice": 250000,
  "categoryId": 1
}
Response:

json
Copy code
{ "success": true, "data": { "id": 10, "title": "Kichik Chimyon" } }
PATCH /tours/:id
Purpose: Update basic tour info.
Body: Any subset of tour fields.

PATCH /tours/:id/publish
Purpose: Publish or unpublish a tour.
Body:

json
Copy code
{ "status": "PUBLISHED" }
DELETE /tours/:id
Purpose: Delete a tour and its linked TourDates.

POST /tours/:id/gallery
Purpose: Update gallery image URLs.
Body:

json
Copy code
{ "gallery": ["https://example.com/1.jpg", "https://example.com/2.jpg"] }
🗓️ Tour Dates
POST /tours/:id/dates
Purpose: Add a new tour date.
Body:

json
Copy code
{
  "date": "2025-11-02",
  "maxGroupSize": 20,
  "priceOverride": 280000
}
DELETE /dates/:id
Purpose: Delete a specific tour date.

💰 Bookings
GET /bookings
Purpose: List all bookings.
Query params:
status, from, to, tourId, q

Response:

json
Copy code
{
  "success": true,
  "data": [
    {
      "id": 3,
      "tourDateId": 1,
      "customer": { "fullName": "Ali Karimov", "phone": "+998901234567" },
      "people": 2,
      "totalPrice": 500000,
      "status": "NEW"
    }
  ]
}
PATCH /bookings/:id/status
Purpose: Update booking status.
Body:

json
Copy code
{ "status": "PAID" }
PATCH /bookings/:id
Purpose: Update people count or note.
Body:

json
Copy code
{ "people": 3, "note": "Added one participant" }
GET /bookings/export.csv
Purpose: Export bookings in CSV format.
Response: CSV file download.

💬 Leads
GET /leads
Purpose: List all leads with filters.
Query params:
status, q, assignedTo

Response:

json
Copy code
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Aziza",
      "phone": "+998901234567",
      "status": "OPEN",
      "assignedTo": null
    }
  ]
}
PATCH /leads/:id
Purpose: Update lead info (assign, close, progress).
Body:

json
Copy code
{ "status": "IN_PROGRESS", "assignedTo": 2 }
POST /leads/:id/convert-to-booking
Purpose: Convert a lead to a booking.
Body:

json
Copy code
{ "tourDateId": 5, "people": 2, "note": "Confirmed by phone" }
Response:

json
Copy code
{ "success": true, "data": { "bookingId": 20, "status": "NEW" } }
👥 Customers
GET /customers
Purpose: Search customers by name or phone.
Query params:
q

Response:

json
Copy code
{
  "success": true,
  "data": [
    { "id": 1, "fullName": "Dilshod Nazarov", "phone": "+998901234567" }
  ]
}
GET /customers/:id
Purpose: Get customer profile with activity timeline (leads + bookings).
Response:

json
Copy code
{
  "success": true,
  "data": {
    "id": 3,
    "fullName": "Dilshod Nazarov",
    "bookings": [ ... ],
    "leads": [ ... ]
  }
}
PATCH /customers/:id
Purpose: Update contact info.
Body:

json
Copy code
{ "email": "dilshod@example.com", "telegram": "@dilshod" }
👤 Users (Admin only)
GET /users
Purpose: List all CRM users.
Response:

json
Copy code
{
  "success": true,
  "data": [
    { "id": 1, "name": "Admin", "email": "admin@demo.com", "role": "ADMIN" },
    { "id": 2, "name": "Manager", "email": "manager@demo.com", "role": "MANAGER" }
  ]
}
POST /users
Purpose: Create a new CRM user.
Body:

json
Copy code
{
  "name": "New Manager",
  "email": "new@demo.com",
  "role": "MANAGER"
}
PATCH /users/:id
Purpose: Update user role or name.
Body:

json
Copy code
{ "role": "ADMIN" }
❌ Error Format
All endpoints must use a consistent JSON error structure.

json
Copy code
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "phone is required",
    "fields": { "phone": "Required" }
  }
}
🔐 Role Permissions Summary
Resource	Admin	Manager
Dashboard	✅	✅
Tours	✅	✅ (no publish/delete)
Tour Dates	✅	✅
Bookings	✅	✅
Leads	✅	✅
Customers	✅	✅
Users	✅	❌

✅ Implementation Notes for AgentCoder
All responses use { "success": true, "data": ... } format.

Errors use standardized { "error": { code, message } } format.

Use Prisma to handle all DB operations.

Validation should be done via middleware (Zod / express-validator).

Implement pagination (?page=1&pageSize=10) for large list endpoints.

Protect all /api/v1/* routes with authMiddleware + roleGuard.