# 📚 Lumina Book Store

<p align="center">
  <img src="image/logo.png" alt="Lumina Book Store Logo" width="180"/>
</p>

<p align="center">
A modern Full-Stack Book Store Web Application built with React, TypeScript, Vite, Supabase, Clerk Authentication, and Tailwind CSS.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF)

![1785571838961](image/README/1785571838961.png)

</p>

---

# 📖 About

**Lumina Book Store** is a modern full-stack bookstore application that allows customers to browse books, manage shopping carts and wishlists, place orders, and securely authenticate using Clerk Authentication.

The application also includes a complete **Admin Dashboard** where administrators can manage books, categories, inventory, users, and customer orders.

Designed with scalability and modern UI principles, this project demonstrates production-ready architecture using React, TypeScript, Supabase, and Tailwind CSS.

---

# ✨ Features

## 👤 Customer Features

- 🔐 Secure Login & Registration
- 👤 User Profile
- 📚 Browse Books
- 🔍 Search Books
- 🗂 Browse Categories
- ⭐ Featured Books
- 🔥 Best Sellers
- 🆕 New Arrivals
- ❤️ Wishlist
- 🛒 Shopping Cart
- 💳 Checkout
- 📦 Order History
- 🌙 Dark / Light Mode
- 📱 Responsive Design

---

## 🛠 Admin Features

- 📊 Dashboard Analytics
- 📚 Manage Books
- ➕ Add New Books
- ✏ Edit Books
- ❌ Delete Books
- 🗂 Manage Categories
- 👥 Manage Users
- 📦 Manage Orders
- 📉 Inventory Management
- ⚙ Store Settings
- 📈 Sales Reports
- 🚨 Inventory Alerts

---

# 🚀 Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Context API

## Backend

- Supabase
- PostgreSQL

## Authentication

- Clerk Authentication

## Charts

- Recharts

---

# 📂 Folder Structure

```text
Lumina-Book-Store
│
├── src
│   ├── components
│   ├── layouts
│   ├── lib
│   ├── pages
│   ├── utils
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── supabase
│
├── image
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

# 🗄 Database

Supabase PostgreSQL Database

## Tables

- Profiles
- Books
- Categories
- Cart Items
- Wishlist Items
- Orders
- Order Items
- Reviews

---

# 🔐 Authentication

Authentication is handled using **Clerk**.

Features include

- Secure Sign Up
- Secure Login
- Session Management
- Protected Routes
- Admin Authentication

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/lumina-book-store.git
```

---

## Go to Project Folder

```bash
cd lumina-book-store
```

---

## Install Dependencies

```bash
npm install
```

---

# ⚙ Environment Variables

Create a **.env** file in the root directory.

```env
VITE_SUPABASE_URL=your_supabase_project_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

# ▶ Run Development Server

```bash
npm run dev
```

Application will run at

```
http://localhost:5173
```

---

# 📦 Build Project

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

---

# 📄 Available Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| npm run dev       | Start development server     |
| npm run build     | Build production version     |
| npm run preview   | Preview production build     |
| npm run lint      | Run ESLint                   |
| npm run typecheck | Run TypeScript Type Checking |

---

# 📱 Pages

## Customer

- Home
- Books
- Book Details
- Categories
- Wishlist
- Cart
- Checkout
- Orders
- Profile
- Login
- Register

---

## Admin

- Dashboard
- Books
- Categories
- Orders
- Users
- Inventory
- Settings

---

# 🎯 Project Highlights

- Modern UI Design
- Responsive Layout
- Clerk Authentication
- Supabase Backend
- PostgreSQL Database
- Secure API Integration
- Reusable Components
- TypeScript Support
- Protected Routes
- Clean Folder Structure
- Production Ready Architecture

---

# 🔒 Security

- Clerk Authentication
- Protected Routes
- Supabase Row Level Security (RLS)
- Environment Variables
- PostgreSQL Security

---

# 🌍 Responsive Design

Optimized for

- 💻 Desktop
- 💼 Laptop
- 📱 Mobile
- 📟 Tablet

---

# 🚀 Future Improvements

- Stripe Payment Integration
- PayPal Support
- AI Book Recommendations
- Coupon System
- Discount Management
- Email Notifications
- Admin Reports
- Sales Analytics
- PDF Invoice Generation
- Multi-language Support
- Push Notifications

---

# 🤝 Contributing

Contributions are welcome.

1. Fork this repository
2. Create your feature branch

```bash
git checkout -b feature/YourFeature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to your branch

```bash
git push origin feature/YourFeature
```

5. Open a Pull Request

---

# 👨‍💻 Developer

## Ahmad Raza

Software Engineering Student

Full Stack Web Developer

React & TypeScript Developer

AI Enthusiast

---

# 📬 Connect With Me

### GitHub

[github.com/Raza11220](https://github.com/Raza11220/)

### LinkedIn

[www.linkedin.com/in/ahmad-raza112200](https://www.linkedin.com/in/ahmad-raza112200/)

### Email

cathode1122@gmail.com

---

# ⭐ Show Your Support

If you like this project, don't forget to ⭐ **Star** this repository.

It helps others discover the project and motivates future development.

---

Made with ❤️ by **Ahmad Raza**

</p>
