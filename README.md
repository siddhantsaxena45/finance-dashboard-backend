# Finance Data Processing and Access Control Backend

**Live Deployed API:** [https://finance-dashboard-backend-r4am.onrender.com](https://finance-dashboard-backend-r4am.onrender.com)

## Overview
This project is an internship assignment demonstrating clean backend development skills. It implements a fully functioning Finance Dashboard API with a strict focus on robust data access control, RESTful routing, and clean architectural separation of concerns without unnecessary complexity.

## Tech Stack & Architecture Decisions
* **Language & Framework**: Node.js (v20) & Express.js. Perfect for handling non-blocking network I/O with concise, readable syntax.
* **Database**: SQLite (via the native `sqlite` async drivers). 
    * *Why SQLite?* It provides immediate, persistent, relational data modeling (matching enterprise patterns) while eliminating the need for evaluators to do complex local Postgres and Docker environment setups.
* **Module System**: `ES Modules` (ES6 import/export) are used natively across the entire codebase.

## Core Features
1. **Financial Records Management**: Complete CRUD operations for financial transactions. Supports granular filtering natively in SQL by matching `type`, `category`, or `date`.
2. **Advanced Dashboard Analytics**: Generates complex aggregated data endpoints dynamically. Accurately calculates total income, total expenses, net balance, category-wise spending arrays, **monthly historical trends**, and displays the 5 most recent activities continuously.
3. **Role-Based Access Control (RBAC)**: Roles (`Viewer`, `Analyst`, `Admin`) rigorously dictate permissions utilizing decoupled Express middleware evaluating user context.
4. **User Management**: Admins can securely fetch user lists, mint new users, and manipulate permission roles and account statuses natively.

## Thoughtful Enhancements
1. **Soft Deletes**: Records and Users are flagged dynamically with `isDeleted = 1` rather than being hard-wiped via traditional SQL `DELETE`. This structurally preserves ledger analytics and prevents referential data corruption over time.
2. **Search Engine**: Instantly search records globally matching specific keywords inside notes and categories. Example: `GET /api/records?search=salary`
3. **Pagination Support**: Large DB payload sizes are strictly chunked using limit constraints and mathematical offsets. Example: `GET /api/records?limit=10&page=2`
4. **Cloud Deployable**: Custom-configured via `engines` to be entirely cloud-native. Actively bypasses binary compiler mismatches to deploy instantly on Linux environments like Render.

## Roles & Permissions Matrix
* **Viewer**: Can view generalized dashboard data and read non-destructive records. Cannot create, update, or delete records.
* **Analyst**: Can view dashboard data and records. Cannot modify database states.
* **Admin**: Has absolute full scope. Can manage users, provision new accounts, create records, and update ledger details safely.

## Setup & Running Locally
1. Clone the repository and navigate cleanly into the application root folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the server locally:
   ```bash
   npm start
   ```
4. The API will be safely available at `http://localhost:3000`. The server creates and actively seeds a persistent local `.sqlite` database upon first launch!

## Deployment Config (Render.com)
When deploying this backend to Render, we instruct their CI servers to strictly compile the SQLite hardware bindings natively against the runner's internal GLIBC to ensure maximal compatibility.
* **Node Version Expected**: `20.x`
* **Build Command**: `npm install --build-from-source sqlite3`
* **Start Command**: `npm start`

## JWT API Authentication
Authentication securely utilizes industry-standard JSON Web Tokens (JWT). All secured endpoints strictly require a valid `Bearer <token>` inside the `Authorization` header to navigate.

To retrieve a JWT Token, execute the login endpoint:

```bash
POST /api/users/login
Content-Type: application/json
{
  "username": "admin"
}
```

The SQLite database comes pre-seeded out of the box with three test users representing the core isolated roles:
1. `admin` (Admin)
2. `analyst` (Analyst)
3. `viewer` (Viewer)

If requested tokens naturally expire sequentially or correlate to a user who was dynamically marked 'inactive' or softly deleted by an Admin, system access is actively caught and denied by the robust Auth Middleware.
