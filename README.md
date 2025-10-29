# 🗺️ TourCRM

A modern, full-stack Customer Relationship Management system designed specifically for tour operators and travel agencies.

## ✨ Features

- **📊 Dashboard** - Real-time analytics and key metrics
- **🎫 Bookings Management** - Track and manage tour bookings with status workflows
- **👥 Customer Management** - Comprehensive customer profiles with activity timelines
- **🎯 Lead Tracking** - Kanban-style lead pipeline management
- **📅 Calendar View** - Visual tour schedule with color-coded categories
- **🏔️ Tour Management** - Complete tour catalog with categories and pricing
- **👤 User Management** - Role-based access control (Admin, Manager, Guide)
- **⚙️ Settings** - Customizable categories and system configuration

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS** for modern, responsive UI
- **React Query** for efficient data fetching and caching
- **React Router** for navigation
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL (Supabase)
- **JWT** authentication
- **Bcrypt** for password hashing

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Git

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/realonecan/crm-tour.git
cd crm-tour
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Seed database with demo data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Default Credentials

After seeding the database, you can login with:

- **Admin**: `admin@demo.com` / `demo123`
- **Manager**: `manager@demo.com` / `demo123`

## 📁 Project Structure

```
crm-tour/
├── backend/                # Node.js + Express API
│   ├── prisma/            # Database schema and migrations
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, validation, etc.
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── server.ts      # Entry point
│   └── package.json
│
├── frontend/              # React + TypeScript UI
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/          # Utilities and API client
│   │   ├── pages/        # Page components
│   │   └── main.tsx      # Entry point
│   └── package.json
│
└── docs/                 # Documentation
```

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tourcrm"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

## 📝 Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with demo data
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 API Documentation

The API follows RESTful conventions and is organized by resource:

- `/api/v1/auth` - Authentication endpoints
- `/api/v1/users` - User management
- `/api/v1/customers` - Customer management
- `/api/v1/tours` - Tour catalog
- `/api/v1/categories` - Tour categories
- `/api/v1/bookings` - Booking management
- `/api/v1/leads` - Lead tracking
- `/api/v1/dates` - Tour dates/schedules
- `/api/v1/dashboard` - Analytics and metrics

## 🚢 Deployment

### Backend (Render/Railway)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Import project from GitHub
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables
5. Deploy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for tour operators worldwide

## 🆘 Support

For support, email support@tourcrm.com or open an issue on GitHub.
