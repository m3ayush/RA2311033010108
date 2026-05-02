/**
 * Logging Middleware — Main Module
 * 
 * Provides a reusable Log() function that sends structured log entries
 * to the evaluation service API. This is the ONLY logging mechanism
 * allowed in the project (no console.log or built-in loggers).
 * 
 * Usage:
 *   import { createLogger } from "logging-middleware";
 *   const Log = createLogger(config);
 *   await Log("backend", "error", "handler", "received string, expected bool");
 */

import axios from "axios";
import {
  Stack,
  LogLevel,
  Package,
  LogResponse,
  LoggerConfig,
  VALID_STACKS,
  VALID_LEVELS,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  SHARED_PACKAGES,
} from "./types";
import { getAuthToken, clearTokenCache } from "./auth";

/**
 * Validate that a package is valid for the given stack.
 */
function validatePackage(stack: Stack, pkg: string): boolean {
  const sharedValid = (SHARED_PACKAGES as string[]).includes(pkg);

  if (stack === "backend") {
    return sharedValid || (BACKEND_PACKAGES as string[]).includes(pkg);
  }

  if (stack === "frontend") {
    return sharedValid || (FRONTEND_PACKAGES as string[]).includes(pkg);
  }

  return false;
}

/**
 * Create a configured logger instance.
 * Returns a Log function bound to the provided credentials.
 * 
 * @param config - API credentials for authentication
 * @returns Log function: (stack, level, package, message) => Promise<LogResponse>
 */
export function createLogger(config: LoggerConfig) {
  const baseUrl = config.baseUrl || "http://20.207.122.201";
  const logUrl = `${baseUrl}/evaluation-service/logs`;

  /**
   * Send a log entry to the evaluation service.
   * 
   * @param stack - "backend" or "frontend"
   * @param level - "debug" | "info" | "warn" | "error" | "fatal"
   * @param pkg - Package name (must be valid for the given stack)
   * @param message - Descriptive log message
   * @returns LogResponse with logID on success
   */
  async function Log(
    stack: Stack,
    level: LogLevel,
    pkg: string,
    message: string
  ): Promise<LogResponse | null> {
    // Validate stack
    if (!(VALID_STACKS as string[]).includes(stack)) {
      // Cannot use Log itself here to avoid infinite recursion
      return null;
    }

    // Validate level
    if (!(VALID_LEVELS as string[]).includes(level)) {
      return null;
    }

    // Validate package for the given stack
    if (!validatePackage(stack, pkg)) {
      return null;
    }

    // Validate message is non-empty
    if (!message || message.trim().length === 0) {
      return null;
    }

    try {
      // Get a valid auth token (auto-refreshes if needed)
      const token = await getAuthToken(config);

      // Send log to the evaluation service
      const response = await axios.post<LogResponse>(
        logUrl,
        {
          stack,
          level,
          package: pkg,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      // Silently fail — we don't want logging failures to crash the app.
      // In a production system, we might queue failed logs for retry.
      return null;
    }
  }

  return Log;
}

// Re-export types for consumers
export type {
  Stack,
  LogLevel,
  Package,
  LogResponse,
  LoggerConfig,
} from "./types";
export { clearTokenCache as resetAuth } from "./auth";
