# Setup

## How the app is built

- **Database (MySQL):** Stores users, products, and orders. You run the schema once to create tables and sample data.
- **Backend (Node + Express):** Runs on port 3000. Connects to MySQL and exposes API routes: GET products, POST login, POST orders.
- **Frontend (React + Vite):** Runs on port 5173. Shows pages (Home, Products, Login, Order) and calls the backend via `/api/...`. Vite proxies `/api` to the backend so the browser doesn’t block requests.

Run the database and schema first, then the backend, then the frontend.

---

## Database (DBngin + TablePlus)

1. Install DBngin, add a MySQL server, set root password, start it (port 3306).
2. In TablePlus: new MySQL connection — host `127.0.0.1`, port `3306`, user `root`, your password. Charset `utf8mb4` if available.
3. Run `backend/db/schema.sql` (File → Run SQL file).

## Backend

```bash
cd taski-app/backend
cp .env.example .env
```

Set `DB_PASSWORD` in `.env`, then:

```bash
npm install
npm start
```

## Frontend

```bash
cd taski-app/frontend
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). Default login: `admin` / `admin`.
