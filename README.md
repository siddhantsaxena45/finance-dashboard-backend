# Finance Data Processing and Access Control Backend

## Overview
This project is an internship assignment demonstrating backend development skills. It implements a Finance Dashboard backend with a focus on data access control, routing, and clean architecture without unnecessary complexity.

## Tech Stack
* **Language**: Node.js
* **Framework**: Express.js
* **Database**: SQLite (via `sqlite3` and `sqlite`) mapped cleanly into async model wrappers.
* **Why**: Node.js and Express are lightweight, readable, and widely used. An SQLite database maintains professional data durability without complex local environment setups like Docker or Postgres configurations. 

## Features
1. **User Management**: Admins can fetch user lists and change roles or statuses.
2. **Access Control**: Roles (`Viewer`, `Analyst`, `Admin`) dictate the operations a user can execute. Handled through reusable middleware.
3. **Financial Records**: CRUD operations for transactions. Filtering via type, category, or date.
4. **Dashboard Summaries**: Dynamic calculations for total income, expenses, category breakdown, and net balance.
5. **Soft Deletes**: Records and Users are flagged with `isDeleted` rather than being hard-wiped, maintaining ledger integrity safely.
6. **Search & Pagination**: Instantly search records globally using `?search=value`. Large sets can be strictly chunked using `?limit=10&page=2`.

## Roles
* **Viewer**: Can view dashboard data and records. Cannot create, update, or delete.
* **Analyst**: Can view dashboard data and records.
* **Admin**: Has full access. Can manage users, create records, and update details.

## Setup & Running
1. Install Node.js
2. Run `npm install`
3. Run `node src/server.js` 
4. The server will start at `http://localhost:3000`

## API Authentication (Simulated)
For simplicity and ease of testing, authentication is simulated via the `x-user-id` HTTP Header.

To authenticate, attach `x-user-id` to your requests. The seeded users are:
- `x-user-id: 1` (Admin)
- `x-user-id: 2` (Analyst)
- `x-user-id: 3` (Viewer)

*In a production environment, this would be replaced with actual JWT verification.*

## File Structure
* `src/models/`: Data layer simulating SQL/NoSQL wrappers
* `src/middleware/`: Authentication and Role guard logic
* `src/controllers/`: Business logic and HTTP response mapping
* `src/routes/`: Express Routes mapping paths to controllers
* `src/app.js`: Express configuration
* `src/server.js`: Web server startup
