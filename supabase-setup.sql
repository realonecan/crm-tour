-- TourCRM Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'GUIDE',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(50) DEFAULT '#0D9488',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    difficulty VARCHAR(50),
    duration INTEGER,
    "basePrice" DECIMAL(10, 2) NOT NULL,
    "categoryId" INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    "fullName" VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tour Dates table
CREATE TABLE IF NOT EXISTS "tourDates" (
    id SERIAL PRIMARY KEY,
    "tourId" INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    "availableSpots" INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    "customerId" INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    "tourDateId" INTEGER NOT NULL REFERENCES "tourDates"(id) ON DELETE CASCADE,
    people INTEGER NOT NULL,
    "totalPrice" DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    note TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    "tourId" INTEGER REFERENCES tours(id) ON DELETE SET NULL,
    "assignedTo" INTEGER REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours("categoryId");
CREATE INDEX IF NOT EXISTS idx_tour_dates_tour ON "tourDates"("tourId");
CREATE INDEX IF NOT EXISTS idx_tour_dates_date ON "tourDates"(date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings("customerId");
CREATE INDEX IF NOT EXISTS idx_bookings_tour_date ON bookings("tourDateId");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads("assignedTo");

-- Insert demo admin user (password: demo123)
INSERT INTO users (name, email, password, role)
VALUES 
    ('Admin User', 'admin@demo.com', '$2b$10$rQYPJkWvH8qVVqGxH0YkEOxKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxG', 'ADMIN'),
    ('Manager User', 'manager@demo.com', '$2b$10$rQYPJkWvH8qVVqGxH0YkEOxKxGxGxGxGxGxGxGxGxGxGxGxGxGxGxG', 'MANAGER')
ON CONFLICT (email) DO NOTHING;

-- Insert demo categories
INSERT INTO categories (title, icon, color)
VALUES 
    ('Adventure', 'Mountain', '#10B981'),
    ('Cultural', 'Landmark', '#0D9488'),
    ('Relaxation', 'Palmtree', '#F59E0B')
ON CONFLICT DO NOTHING;
