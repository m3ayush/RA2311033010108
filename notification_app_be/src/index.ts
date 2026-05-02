/**
 * Backend Application Entry Point
 * Sets up Express server with CORS, routes, and error handling.
 */

import express from "express";
import cors from "cors";
import { config } from "./config";
import notificationRoutes from "./routes/notifications";
import { errorHandler, requestLogger } from "./middleware/errorHandler";
import { createLogger } from "logging-middleware";

const Log = createLogger({
  email: config.email,
  name: config.name,
  rollNo: config.rollNo,
  accessCode: config.accessCode,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  baseUrl: config.baseUrl,
});

const app = express();

// Middleware
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, async () => {
  await Log(
    "backend",
    "info",
    "config",
    `Server started on port ${config.port}`
  );
  await Log(
    "backend",
    "info",
    "config",
    `CORS enabled for ${config.frontendUrl}`
  );
});

export default app;
