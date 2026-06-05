import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
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
import { suppliersRouter } from "./routes/suppliers.js";
import { usersRouter } from "./routes/users.js";
import { errorHandler } from "./utils/errors.js";

export const app = express();

app.use(helmet());
const allowedCorsOrigins = [
  env.frontendUrl,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5000",
  "http://10.0.2.2:5000",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedCorsOrigins.includes(origin) || /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
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
app.use("/api/suppliers", suppliersRouter);

app.use(errorHandler);
