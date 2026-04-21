# 📌 Project Management System — MERN Stack

A full-stack **Project & Workspace Management Application** developed using the **MERN Stack (MongoDB, Express.js, React.js, Node.js) with TypeScript**.

This project was built as part of practical learning and internship-level development to demonstrate real-world full-stack engineering skills including authentication, API development, role-based access, and scalable frontend architecture.

The application helps teams organize workspaces, manage projects, track tasks, and collaborate efficiently within a centralized system.

---


## 🎯 Project Objectives

- Build a scalable full-stack web application
- Implement secure authentication & authorization
- Design modular backend architecture
- Develop reusable frontend components
- Demonstrate real-world MERN development practices
- Understand full project lifecycle from setup to deployment

---

## ⚙️ Tech Stack

### 🎨 Frontend
- React.js
- TypeScript
- Tailwind CSS
- Vite
- React Context API
- Custom Hooks

### 🧠 Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Passport.js Authentication
- JWT Authorization

---

## ✨ Features

### 🔐 Authentication & Security
- User Registration & Login
- JWT Authentication
- OAuth Login Integration
- Protected API Routes
- Role-Based Access Control

### 🗂 Workspace & Project Management
- Create & Manage Workspaces
- Multiple Projects per Workspace
- Member Invitations
- Permission Management

### ✅ Task Management
- Task Creation & Assignment
- Status Tracking
- Activity Logging
- Task Discussions & Comments

### 👥 Team Collaboration
- Workspace Member Roles
- Activity Monitoring
- Discussion Threads
- Project Updates

---

## 📋 Prerequisites

Before running the project, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Local or Atlas)
- Git
- Code Editor (VS Code recommended)

---

## 📂 Project Structure

Project-Management/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── index.ts
│
└── client/
    └── src/
        ├── components/
        ├── hooks/
        ├── layout/
        ├── pages/
        ├── routes/
        └── App.tsx

---

## 🚀 Installation & Setup

### 🔧 Backend Setup

cd backend npm install cp .env.example .env

Update .env file: NODE_ENV=development PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your_secret_key JWT_EXPIRE=7d

Start backend server: npm run dev

Backend runs at: http://localhost:5000

### 🎨 Frontend Setup

cd client npm install cp .env.example .env.local

Update environment variable: VITE_API_URL=http://localhost:5000/api

Start frontend server: npm run dev

Open browser: http://localhost:5173

## 📜 Available Scripts

Backend: npm run dev npm run build npm start

Frontend: npm run dev npm run build

## 📄 License

© 2026 Mukesh --- All Rights Reserved



