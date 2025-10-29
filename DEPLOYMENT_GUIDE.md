# 🚀 TourCRM Deployment Guide

## Complete Step-by-Step Guide to Make Your App Public

---

## 📋 **What You Need to Provide Me**

### 1. **Supabase Project Details**
Please provide the following from your Supabase project:

1. **Project URL**: `https://[your-project-ref].supabase.co`
2. **Anon/Public Key**: Found in Project Settings → API
3. **Service Role Key** (keep this secret!): Found in Project Settings → API
4. **Database Password**: The password you set when creating the project

### 2. **How to Find These:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on **Settings** (gear icon) → **API**
4. Copy:
   - Project URL
   - `anon` `public` key
   - `service_role` key (secret!)

---

## 🗄️ **Step 1: Set Up Supabase Database**

### **A. Create Database Tables**

I'll provide you with SQL scripts to run in Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Paste the SQL I'll provide
4. Click "Run"

### **B. Enable Row Level Security (RLS)**

For security, we'll set up RLS policies so users can only access their own data.

---

## 🔐 **Step 2: Configure Authentication**

### **A. Enable Email/Password Auth**
1. Go to Authentication → Providers
2. Enable "Email" provider
3. Disable email confirmation for now (or configure SMTP)

### **B. Create Admin User**
1. Go to Authentication → Users
2. Click "Add User"
3. Create admin account with your email

---

## 🌐 **Step 3: Deploy Backend**

### **Option A: Deploy to Render.com (Recommended - Free)**

1. **Create Account**: https://render.com
2. **Create New Web Service**
3. **Connect GitHub** (I'll help you push code to GitHub first)
4. **Configure**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables (I'll provide these)

### **Option B: Deploy to Railway.app**

1. **Create Account**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Add Environment Variables**

---

## 🎨 **Step 4: Deploy Frontend**

### **Option A: Deploy to Vercel (Recommended - Free)**

1. **Create Account**: https://vercel.com
2. **Import Project** from GitHub
3. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables (I'll provide)

### **Option B: Deploy to Netlify**

1. **Create Account**: https://netlify.com
2. **Add New Site** → Import from Git
3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## 📝 **Step 5: Environment Variables**

### **Backend (.env)**
```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-role-key"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=production
```

### **Frontend (.env)**
```env
VITE_API_URL="https://your-backend-url.onrender.com/api/v1"
VITE_SUPABASE_URL="https://[project-ref].supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

---

## ✅ **What I Need From You Right Now:**

### **Immediate Actions:**

1. **Share Supabase Credentials**:
   ```
   Project URL: _________________
   Anon Key: ____________________
   Service Role Key: ____________
   Database Password: ___________
   ```

2. **Choose Deployment Platform**:
   - Backend: Render / Railway / Other?
   - Frontend: Vercel / Netlify / Other?

3. **GitHub Repository** (if you have one):
   - Repo URL: ___________________
   - Or should I help you create one?

---

## 🔄 **Migration Steps** (I'll Handle This)

Once you provide the Supabase details, I will:

1. ✅ Create Prisma schema for PostgreSQL
2. ✅ Generate SQL migration scripts
3. ✅ Update backend to use Supabase
4. ✅ Configure authentication with Supabase Auth
5. ✅ Test database connections
6. ✅ Prepare deployment configurations
7. ✅ Create deployment scripts

---

## 📱 **After Deployment**

### **Your Friend Can Access:**
- **URL**: `https://your-app-name.vercel.app`
- **Login**: With credentials you create in Users section

### **You Can:**
- Add users through the Users page
- Users will be stored in Supabase
- Everything will be persistent and accessible online

---

## 🆘 **Need Help?**

I'm here to guide you through each step. Just provide:
1. Supabase credentials
2. Preferred deployment platforms
3. Any questions you have

Let's make your TourCRM public! 🚀
