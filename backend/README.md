# 🚀 CRM Tour Backend API

Production-quality REST API for the Tour CRM System built with Express, Prisma, and TypeScript.

## 📋 Tech Stack

- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database (Supabase)
- **JWT** - Authentication
- **Zod** - Validation

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── server.ts              # Express app entry point
│   ├── prisma/
│   │   └── client.ts          # Prisma client instance
│   ├── routes/                # Route definitions
│   │   ├── authRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── tourRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── leadRoutes.ts
│   │   ├── customerRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── dashboardRoutes.ts
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic + DB queries
│   ├── middlewares/           # Auth, RBAC, error handling
│   └── utils/                 # Helper functions
├── prisma/
│   └── schema.prisma          # Database schema
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file is already configured with Supabase connection.

```env
DATABASE_URL=postgresql://...
PORT=3000
JWT_SECRET=supersecret
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at: **http://localhost:3000**

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/v1/auth/demo` - Demo login (ADMIN or MANAGER)

### Categories (Admin only for write)
- `GET /api/v1/categories` - List all categories
- `POST /api/v1/categories` - Create category
- `PATCH /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Tours
- `GET /api/v1/tours` - List all tours (with filters)
- `GET /api/v1/tours/:id` - Get tour by ID
- `POST /api/v1/tours` - Create tour
- `PATCH /api/v1/tours/:id` - Update tour
- `PATCH /api/v1/tours/:id/publish` - Publish/unpublish tour
- `POST /api/v1/tours/:id/gallery` - Update gallery
- `DELETE /api/v1/tours/:id` - Delete tour
- `POST /api/v1/tours/:id/dates` - Add tour date

### Tour Dates
- `DELETE /api/v1/dates/:id` - Delete tour date

### Bookings
- `GET /api/v1/bookings` - List all bookings (with filters)
- `GET /api/v1/bookings/:id` - Get booking by ID
- `POST /api/v1/bookings` - Create booking
- `PATCH /api/v1/bookings/:id/status` - Update booking status
- `PATCH /api/v1/bookings/:id` - Update booking details

### Leads
- `GET /api/v1/leads` - List all leads (with filters)
- `GET /api/v1/leads/:id` - Get lead by ID
- `POST /api/v1/leads` - Create lead
- `PATCH /api/v1/leads/:id` - Update lead
- `POST /api/v1/leads/:id/convert-to-booking` - Convert to booking

### Customers
- `GET /api/v1/customers` - List all customers
- `GET /api/v1/customers/:id` - Get customer with timeline
- `POST /api/v1/customers` - Create customer
- `PATCH /api/v1/customers/:id` - Update customer

### Users (Admin only)
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Dashboard
- `GET /api/v1/dashboard/stats?range=7d` - Get dashboard statistics

## 🔐 Authentication

All endpoints (except `/api/health` and `/api/v1/auth/demo`) require authentication.

### Demo Login

```bash
POST /api/v1/auth/demo
Content-Type: application/json

{
  "role": "ADMIN"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@demo.com",
      "role": "ADMIN",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Using the Token

Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "phone is required",
    "fields": {
      "phone": "Required"
    }
  }
}
```

## 🔒 Role-Based Access Control

| Resource | Admin | Manager |
|----------|-------|---------|
| Dashboard | ✅ | ✅ |
| Tours | ✅ | ✅ |
| Categories | ✅ | ❌ |
| Bookings | ✅ | ✅ |
| Leads | ✅ | ✅ |
| Customers | ✅ | ✅ |
| Users | ✅ | ❌ |

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Demo login
curl -X POST http://localhost:3000/api/v1/auth/demo \
  -H "Content-Type: application/json" \
  -d '{"role":"ADMIN"}'

# Get tours (with auth)
curl http://localhost:3000/api/v1/tours \
  -H "Authorization: Bearer <your-token>"
```

### Using Thunder Client / Postman

1. Import the endpoints
2. Set base URL: `http://localhost:3000/api/v1`
3. Login via `/auth/demo` to get token
4. Add token to Authorization header for other requests

## 📦 Available Scripts

```bash
npm run dev              # Start development server with ts-node
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled JavaScript
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database (when seed file is created)
```

## 🗄️ Database Schema

The database includes the following models:
- **Category** - Tour categories
- **Tour** - Tour definitions
- **TourDate** - Scheduled tour dates
- **Customer** - Customer information
- **Booking** - Tour bookings
- **Lead** - Customer inquiries
- **User** - CRM users (Admin/Manager)

See `prisma/schema.prisma` for full schema definition.

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ERROR` | Unique constraint violation |
| `INTERNAL_ERROR` | Server error |

## 🔄 Status Flows

### Booking Status
```
NEW → PAID → CANCELLED
```

### Lead Status
```
OPEN → IN_PROGRESS → CLOSED
```

### Tour Status
```
DRAFT → PUBLISHED
```

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in integer format (e.g., 250000 = 250,000 UZS)
- Phone numbers should include country code (e.g., +998901234567)
- The API uses PostgreSQL via Supabase
- JWT tokens expire after 7 days

## 🎯 Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run prisma:generate` to generate Prisma client
3. Run `npm run prisma:migrate` to sync database schema
4. Run `npm run dev` to start the server
5. Test the `/api/health` endpoint
6. Login via `/api/v1/auth/demo` to get a token
7. Start making authenticated requests!

---

Built with ❤️ for Tour CRM System
