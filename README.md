# TIMS — Typing Institute Management System

Full-stack web application for managing a typing institute. Built with React, Express, MongoDB, and Tailwind CSS.

## Tech Stack

**Frontend:** React 19, Vite 8, Redux Toolkit Query, React Router 7, Tailwind CSS 4, Recharts, react-hook-form + Zod

**Backend:** Node.js, Express 4, Mongoose 8, JWT auth, pdf-lib, ExcelJS, Joi validation, Multer

**Database:** MongoDB (Atlas)

**Storage:** Supabase S3-compatible (for uploads)

## Features

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | Stats cards (students, courses, fees, results, dead stock, expenses), bar/pie/line charts |
| **Students** | CRUD, registration, search/filter, approve/disapprove, profile with enrollments & fees tabs, file uploads (photo, signature) |
| **Courses** | CRUD, activate/deactivate toggle |
| **Enrollments** | Create, update, list by student |
| **Fees** | Create, edit, auto-generated receipt numbers, PDF receipt download |
| **Results** | Upload result PDFs by session/year/subject, view/download, delete |
| **Dead Stock** | CRUD with image upload, monthly/yearly export (PDF & Excel) |
| **Expenses** | CRUD with category filter, receipt upload/view |
| **Users** | Admin user management |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Supabase/S3 bucket (optional, for production file uploads)

### 1. Clone & Install

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/tims
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=24h
INSTITUTE_NAME=Your Institute
INSTITUTE_ADDRESS=123 Main Street
INSTITUTE_CONTACT=+91 98765 00000
PING_URL=http://localhost:5000/api/v1/health
```

### 3. Seed the Database

```bash
cd server
npm run seed    # creates admin user
node scripts/seedData.js   # populates demo data
```

Default admin credentials: `admin@typing.in` / `Admin@1234`

### 4. Run

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

### Production Build

```bash
cd client
npm run build

NODE_ENV=production node server/server.js
```

The Express server serves the built static files automatically.

## Project Structure

```
server/
  controllers/     Route handlers
  models/          Mongoose schemas
  routes/          Express routers
  middleware/      Auth, error handler, upload, audit
  services/        S3, PDF, Excel, scheduler
  utils/           Joi validators, receipt generator
  scripts/         Seed data scripts
  config/          DB connection

client/
  src/
    pages/         12 route pages
    components/    Layout (sidebar, layout, protected route) + UI (Button, Card, Input, Select, Modal, DataTable)
    services/      RTK Query API slices
    store/         Redux store + auth slice
```

## API Routes

| Prefix | Module |
|--------|--------|
| `/api/v1/auth` | Login, logout, session |
| `/api/v1/students` | Student CRUD + registration + approve |
| `/api/v1/courses` | Course CRUD + toggle |
| `/api/v1/enrollments` | Enrollment CRUD |
| `/api/v1/fees` | Fee CRUD + PDF |
| `/api/v1/results` | Result CRUD + file view |
| `/api/v1/deadstock` | Dead stock CRUD + monthly/yearly report |
| `/api/v1/expenses` | Expense CRUD + receipt |
| `/api/v1/dashboard` | Stats + charts |
| `/api/v1/users` | Admin user management |
| `/api/v1/health` | Health check |
# typing_instatute_management
# typing_instatute_management
