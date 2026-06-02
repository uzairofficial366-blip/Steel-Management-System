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
app.use(cors({ origin: env.frontendUrl, credentials: true }));
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
