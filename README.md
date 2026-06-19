# The Athenaeum — Online Library System

A full-stack library management system: members can browse the catalog and borrow/return books, and admins can manage the book inventory and track all borrow records.

- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node.js + Express + JWT auth
- **Database:** MongoDB (local or Atlas) via Mongoose

---

## 1. Prerequisites

Install these before you start:

1. **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
2. **VS Code** — [code.visualstudio.com](https://code.visualstudio.com)
3. **MongoDB** — pick ONE option:
   - **Option A (local):** Install MongoDB Community Server — [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community), then make sure the `mongod` service is running.
   - **Option B (cloud, easier):** Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register), and get your connection string (Database → Connect → Drivers).

Verify Node is installed:
```bash
node -v
npm -v
```

---

## 2. Project structure

```
online-library-system/
├── backend/              # Express API
│   ├── src/
│   │   ├── config/       # DB connection + seed script
│   │   ├── controllers/  # Route logic
│   │   ├── middleware/   # Auth + error handling
│   │   ├── models/       # Mongoose schemas (User, Book, Borrow)
│   │   ├── routes/       # Express routers
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/              # React app
    ├── src/
    │   ├── api/           # Axios calls to the backend
    │   ├── components/    # Navbar, BookCard, ProtectedRoute
    │   ├── context/        # AuthContext (global login state)
    │   ├── pages/          # Catalog, Login, Admin pages, etc.
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## 3. Open the project in VS Code

```bash
cd online-library-system
code .
```

Open **two integrated terminals** in VS Code (Terminal → New Terminal, then click the `+` to split): one for the backend, one for the frontend.

---

## 4. Backend setup

In **Terminal 1**:

```bash
cd backend
npm install
```

Configure your environment:

```bash
cp .env.example .env
```

Open `backend/.env` in VS Code and set `MONGO_URI`:

- **Local MongoDB:** leave the default —
  `mongodb://127.0.0.1:27017/library_system`
- **MongoDB Atlas:** paste your connection string, e.g.
  `mongodb+srv://<username>:<password>@cluster0.mongodb.net/library_system?retryWrites=true&w=majority`
  (replace `<username>`/`<password>` with your Atlas database user credentials)

Also change `JWT_SECRET` to any long random string of your own.

**Seed the database** with an admin account, a sample member, and 6 sample books:

```bash
npm run seed
```

You should see output ending with login credentials. This is safe to re-run any time — it clears and re-creates the sample data.

**Start the backend:**

```bash
npm run dev
```

You should see:
```
MongoDB connected: ...
Server running on http://localhost:5000
```

Verify it's working by visiting **http://localhost:5000/api/health** in your browser — you should see `{"status":"ok", ...}`.

---

## 5. Frontend setup

In **Terminal 2**:

```bash
cd frontend
npm install
```

Configure your environment:

```bash
cp .env.example .env
```

The default `frontend/.env` already points to `http://localhost:5000/api`, which matches the backend default — no changes needed unless you changed the backend `PORT`.

**Start the frontend:**

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 6. Try it out

Log in with the seeded accounts:

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@library.com   | admin123   |
| Member | member@library.com  | member123  |

- As a **member**: browse the catalog, open a book, click **Borrow this book**, then check **My Books** to see it and return it.
- As an **admin**: use **Manage Books** to add/edit/delete titles, and **Borrow Records** to see everyone's activity and force a return.

You can also click **Sign up** to create your own member account (new sign-ups are always created as members; only the seed script creates an admin).

---

## 7. How borrowing works

- Each book has `totalCopies` and `availableCopies`.
- Borrowing atomically decrements `availableCopies` only if a copy is free (prevents two users grabbing the last copy at the same time).
- Each loan is due **14 days** after borrowing.
- A loan shows as **overdue** automatically once the due date passes, without needing a background job.
- Returning a book increments `availableCopies` back and marks the record `returned`.

---

## 8. API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint                    | Access        | Description                       |
|--------|------------------------------|---------------|------------------------------------|
| POST   | `/auth/register`             | Public        | Create a member account            |
| POST   | `/auth/login`                | Public        | Log in, returns a JWT              |
| GET    | `/auth/me`                   | Private       | Get current user profile           |
| GET    | `/books`                     | Public        | List books (search, genre, page)   |
| GET    | `/books/:id`                 | Public        | Get one book                       |
| GET    | `/books/genres/list`         | Public        | List distinct genres               |
| POST   | `/books`                     | Admin         | Create a book                      |
| PUT    | `/books/:id`                 | Admin         | Update a book                      |
| DELETE | `/books/:id`                 | Admin         | Delete a book                      |
| POST   | `/borrow/:bookId`             | Private       | Borrow a book                      |
| PUT    | `/borrow/:borrowId/return`    | Private       | Return a book                      |
| GET    | `/borrow/my`                  | Private       | Your own borrow history            |
| GET    | `/borrow`                     | Admin         | All borrow records (filter by `?status=`) |

Private routes require an `Authorization: Bearer <token>` header — the frontend handles this automatically once you're logged in.

---

## 9. Troubleshooting

- **"MongoDB connection error"** — make sure `mongod` is running locally, or that your Atlas connection string, username, password, and IP allowlist (Atlas → Network Access → allow your IP or `0.0.0.0/0` for testing) are correct.
- **Frontend shows "Could not load the catalog"** — the backend isn't running, or `frontend/.env`'s `VITE_API_URL` doesn't match the backend's actual port.
- **CORS errors in browser console** — make sure `backend/.env`'s `CLIENT_URL` matches the URL the frontend is actually running on (default `http://localhost:5173`).
- **"Duplicate value for field: isbn"** — you're trying to add a book with an ISBN that already exists; ISBNs must be unique.
- Want a fresh start? Re-run `npm run seed` in the backend folder.

---

## 10. Going to production (optional)

- Deploy the backend (e.g. Render, Railway, Fly.io) and set real environment variables there — especially a strong `JWT_SECRET` and your production `MONGO_URI`.
- Deploy the frontend (e.g. Vercel, Netlify) with `VITE_API_URL` pointing at your deployed backend URL.
- Update `CLIENT_URL` in the backend's environment to your deployed frontend URL so CORS allows it.
