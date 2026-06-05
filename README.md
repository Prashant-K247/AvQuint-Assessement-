# Task Manager Application

A full-stack task management application built with **Node.js/Express** backend and **React/Vite** frontend, featuring user authentication and task management functionality.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

Task Manager is a modern web application that allows users to:
- Create an account and securely authenticate
- Create, read, update, and delete tasks
- Mark tasks as completed or pending
- Track tasks with timestamps

The application uses JWT (JSON Web Tokens) for secure authentication and MongoDB for data persistence.

---

## Tech Stack

### Backend
- **Runtime**: Node.js (with ES modules)
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs password hashing
- **Utilities**: cors, dotenv, nodemon

### Frontend
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **Routing**: React Router DOM v7.17.0
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS v4.3.0
- **Linting**: ESLint

---

## Project Structure

```
Task_manager/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express server entry point
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   └── task.controller.js    # Task CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # JWT verification
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   └── Task.js               # Task schema
│   │   └── routes/
│   │       ├── auth.routes.js        # Auth endpoints
│   │       └── task.routes.js        # Task endpoints
│   ├── package.json
│   ├── .env                          # Environment variables
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.jsx                   # Main app with routes
│   │   ├── index.css                 # Global styles
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js                # Axios configuration
│   │   └── assets/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
└── .git/                             # Git repository
```

---

## Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **MongoDB**: Local instance or MongoDB Atlas connection string
- **Git**: For version control

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Task_manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/task_manager
# JWT_SECRET=your-secret-key
# JWT_EXPIRY=7d

# Start development server
npm run dev
```

### 3. Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Access the application at `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/task_manager
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task_manager

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRY=7d
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

**Note**: Keep `.env` files private and never commit them to version control.

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Mode

**Backend:**
```bash
cd backend
npm install --production
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Available Scripts

**Backend**:
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

**Frontend**:
- `npm run dev` - Start development server
- `npm run build` - Build optimized production bundle
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Task Endpoints

**All task endpoints require JWT authentication:**
```
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt_token>

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation"
}
```

**Response (201):**
```json
{
  "_id": "task_id",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation",
  "status": "pending",
  "userId": "user_id",
  "createdAt": "2024-01-15T10:35:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <jwt_token>
```

**Response (200):** Array of task objects

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

**Response (200):** Updated task object

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

#### Toggle Task Status
```http
PATCH /api/tasks/:id/toggle
Authorization: Bearer <jwt_token>
```

Toggles status between "pending" and "completed".

**Response (200):** Updated task object

### Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Architecture

### System Design

```
┌──────────────────────────────────────┐
│      React Frontend (Vite)           │
│  - Pages: Login, Register, Dashboard │
│  - Context: Authentication State     │
│  - Services: Axios API Client        │
└──────────────┬───────────────────────┘
               │ HTTP/HTTPS
               ▼
┌──────────────────────────────────────┐
│    Node.js/Express Backend           │
│  - Routes: /api/auth, /api/tasks     │
│  - Controllers: Business Logic       │
│  - Middleware: JWT Authentication   │
│  - Models: User & Task Schemas       │
└──────────────┬───────────────────────┘
               │ Database Queries
               ▼
         ┌────────────────┐
         │    MongoDB     │
         │   Database     │
         └────────────────┘
```

### Authentication Flow

1. User registers/logs in
2. Backend hashes password with bcryptjs
3. JWT token generated on successful login
4. Frontend stores token in localStorage
5. Token sent with every protected request
6. Middleware verifies token and extracts user ID
7. Controller processes request with user context

### Data Models

**User**:
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Task**:
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ["pending", "completed"]),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

### Features

✅ User authentication with JWT  
✅ Password encryption with bcryptjs  
✅ Complete task CRUD operations  
✅ Task status management  
✅ User-specific task isolation  
✅ Responsive design with Tailwind CSS  
✅ Protected routes with JWT middleware  
✅ Comprehensive error handling  

---


### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String ("pending" | "completed"),
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

