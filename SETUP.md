# Setup

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
