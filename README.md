# Finance Data Processing and Access Control Backend

**Live Deployed API:** [https://finance-dashboard-backend-r4am.onrender.com](https://finance-dashboard-backend-r4am.onrender.com)

## Overview
This project is an internship assignment demonstrating clean backend development skills. It implements a Finance Dashboard API with a strict focus on data access control, RESTful routing, and clean architecture without unnecessary complexity.

## Tech Stack & Architecture Decisions
* **Language & Framework**: Node.js (v20) & Express.js. Perfect for handling non-blocking network I/O with concise, readable syntax.
* **Database**: SQLite (via the `sqlite3` and `sqlite` async drivers). 
    * *Why SQLite?* It provides immediate, persistent, relational data modeling (matching enterprise patterns) while eliminating the need for evaluators to do complex local Docker/Postgres environment setups.
* **Module System**: `ES Modules` (ES6 import/export) are used natively across the codebase.

## Core Features
1. **Financial Records Management**: Complete CRUD operations for financial transactions. Supports filtering by exactly matching `type`, `category`, or `date`.
2. **Dashboard Analytics**: Generates aggregated data endpoints dynamically—calculating total income, total expenses, net balance, and category-wise spending.
3. **Role-Based Access Control (RBAC)**: Roles (`Viewer`, `Analyst`, `Admin`) rigorously dictate permissions utilizing reusable Express middlewares.
4. **User Management**: Admins can fetch user lists, create users, and manipulate roles/statuses.

## Thoughtful Enhancements
1. **Soft Deletes**: Records and Users are flagged dynamically with `isDeleted = 1` rather than being hard-wiped via traditional SQL `DELETE`. This structurally preserves ledger analytics and prevents referential data corruption over time.
2. **Search Engine**: Instantly search records globally matching specific keywords inside notes and categories. Example: `GET /api/records?search=salary`
3. **Pagination Support**: Large result sets are strictly chunked using limit constraints and mathematical offsets. Example: `GET /api/records?limit=10&page=2`
4. **Cloud Deployable**: Custom-configured via `engines` to be entirely cloud-native and deploy instantly on environments like Render.com.

## Roles & Permissions
* **Viewer**: Can view dashboard data and read records. Cannot create, update, or delete records.
* **Analyst**: Can view dashboard data and records. Cannot modify.
* **Admin**: Has absolute full access. Can manage users, create records, and update details.

## Setup & Running Locally
1. Clone the repository and navigate into the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the server locally:
   ```bash
   npm start
   ```
4. The API will be available at `http://localhost:3000`. The server creates and actively seeds a local `.sqlite` database upon first launch!

## Deployment Notes (Render)
When deploying this backend to Render, we instruct their servers to strictly compile the SQLite hardware bindings natively against the runner's internal GLIBC to ensure maximal compatibility.
* **Node Version Configured**: `20.x`
* **Build Command**: `npm install --build-from-source sqlite3`
* **Start Command**: `npm start`

## JWT API Authentication
Authentication uses industry-standard JSON Web Tokens (JWT). All secured endpoints strictly require a valid `Bearer <token>` inside the `Authorization` header.

To retrieve a JWT Token, hit the login endpoint:

```bash
POST /api/users/login
Content-Type: application/json
{
  "username": "admin"
}
```

The database comes pre-seeded with three test users representing the distinct roles:
1. `admin` (Admin)
2. `analyst` (Analyst)
3. `viewer` (Viewer)

Use the token returned from the login query aggressively inside your Authorization headers to navigate and write to the API. If tokens expire or correlate to a user who was marked 'inactive' or deleted, access is actively caught and denied by the Auth Middleware.
