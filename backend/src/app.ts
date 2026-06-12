import cors from "cors";
import express from "express";
import type { RequestHandler } from "express";
import * as rateLimitModule from "express-rate-limit";
import * as helmetModule from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { customersRouter } from "./routes/customers.js";
import { khataRouter } from "./routes/khata.js";
import { paymentsRouter } from "./routes/payments.js";
import { productsRouter } from "./routes/products.js";
import { purchasesRouter } from "./routes/purchases.js";
import { reportsRouter } from "./routes/reports.js";
import { salesRouter } from "./routes/sales.js";
import { settingsRouter } from "./routes/settings.js";
import { suppliersRouter } from "./routes/suppliers.js";
import { usersRouter } from "./routes/users.js";
import { errorHandler } from "./utils/errors.js";

export const app = express();

const helmet = ((helmetModule as unknown as { default?: unknown }).default ?? helmetModule) as () => RequestHandler;
const rateLimit = (
  (rateLimitModule as unknown as { rateLimit?: unknown; default?: unknown }).rateLimit ??
  (rateLimitModule as unknown as { default?: unknown }).default ??
  rateLimitModule
) as (options: { windowMs: number; limit: number }) => RequestHandler;

app.set("trust proxy", 1);
app.use(helmet());

const configuredFrontendOrigins = env.frontendUrl
  ? env.frontendUrl.split(",").map((origin) => origin.trim())
  : [];

const allowedCorsOrigins = new Set(
  [
    ...configuredFrontendOrigins,

    // Local web
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",

    // Android emulator / local
    "http://10.0.2.2:5000",

    // Capacitor APK origins
    "capacitor://localhost",
    "http://localhost",
    "https://localhost",
  ].filter(Boolean),
);

// const allowedCorsOrigins = [
//   env.frontendUrl,
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "http://localhost:5000",
//   "http://127.0.0.1:3000",
//   "http://127.0.0.1:5173",
//   "http://127.0.0.1:5000",
//   "http://10.0.2.2:5000",

// ];



// app.use(
//   cors({
//     origin(origin, callback) {
//       // Allow Postman, mobile apps, same-origin requests, and server-to-server requests
//       if (!origin) {
//         return callback(null, true);
//       }

//       // Allow exact frontend/app origins
//       if (allowedCorsOrigins.has(origin)) {
//         return callback(null, true);
//       }

//       // Allow local network IPs for phone testing with laptop backend
//       const isLocalNetwork =
//         /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
//         /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
//         /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);

//       if (isLocalNetwork) {
//         return callback(null, true);
//       }

//       return callback(new Error(`CORS blocked by policy: ${origin}`));
//     },
//     credentials: true,
//   }),
// );



app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedCorsOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked by policy: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, limit: 180 }));

app.get("/", (_req, res) => {
  res.json({
    name: "Smart Shop Management Platform API",
    status: "running",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/sales", salesRouter);
app.use("/api/khata", khataRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/suppliers", suppliersRouter);

app.use(errorHandler);

export default app;
