import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  if (!(error instanceof AppError)) {
    console.error(error);
  }
  res.status(statusCode).json({
    message: error instanceof AppError
      ? error.message
      : "Backend cannot reach the database. Put the Neon postgresql:// connection string in backend/.env DATABASE_URL, then restart the API.",
  });
}
