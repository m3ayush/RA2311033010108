/**
 * Error Handling Middleware
 * Catches unhandled errors and returns structured error responses.
 */

import { Request, Response, NextFunction } from "express";
import { createLogger } from "logging-middleware";
import { config } from "../config";

const Log = createLogger({
  email: config.email,
  name: config.name,
  rollNo: config.rollNo,
  accessCode: config.accessCode,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  baseUrl: config.baseUrl,
});

/**
 * Global error handler middleware.
 * Logs the error and returns a 500 response.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  Log(
    "backend",
    "error",
    "middleware",
    `Unhandled error on ${req.method} ${req.path}: ${err.message}`
  );

  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
}

/**
 * Request logging middleware.
 * Logs every incoming request with method, path, and query params.
 */
export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const queryStr = Object.keys(req.query).length > 0
    ? ` | query: ${JSON.stringify(req.query)}`
    : "";

  Log(
    "backend",
    "info",
    "middleware",
    `${req.method} ${req.path}${queryStr}`
  );

  next();
}
