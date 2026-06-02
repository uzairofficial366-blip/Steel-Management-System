# Smart Shop Management Platform

Full-stack Smart Shop Management Platform with React + Vite + TypeScript frontend, Node.js + Express + TypeScript backend, and Neon PostgreSQL via Prisma.

## Backend

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Set `DATABASE_URL` in `backend/.env` to your Neon PostgreSQL connection string before running Prisma commands.
Use the `postgresql://...` connection string from Neon, not the `https://console.neon.tech/...` browser URL.

```bash
npm run check-db
npm run seed
```

## Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The public website opens at `http://localhost:5173/`.

## Demo Users

| Role | User ID | Password |
| --- | --- | --- |
| Admin | `admin` | `Admin@123` |
| Admin | `AdurRahman` | `AdurRahman` |
| Manager | `manager` | `Manager@123` |
| Salesman | `salesman` | `Salesman@123` |
| Accountant | `accountant` | `Accountant@123` |
| Customer | `customer1` | `Customer@123` |
