/**
 * Type definitions for the logging middleware.
 * Defines all allowed values for stack, level, and package fields
 * as specified by the evaluation service API.
 */

// Stack represents which part of the application is logging
export type Stack = "backend" | "frontend";

// Log severity levels in ascending order
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

// Backend-only packages
export type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

// Frontend-only packages
export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

// Shared packages (used by both stacks)
export type SharedPackage = "auth" | "config" | "middleware" | "utils";

// Combined package type based on stack
export type Package = BackendPackage | FrontendPackage | SharedPackage;

// Log entry structure sent to the API
export interface LogEntry {
  stack: Stack;
  level: LogLevel;
  package: string;
  message: string;
}

// Successful log response from the API
export interface LogResponse {
  logID: string;
  message: string;
}

// Auth token response from the API
export interface AuthTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

// Configuration required for the logging middleware
export interface LoggerConfig {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
  baseUrl?: string;
}

// Allowed values for validation
export const VALID_STACKS: Stack[] = ["backend", "frontend"];

export const VALID_LEVELS: LogLevel[] = ["debug", "info", "warn", "error", "fatal"];

export const BACKEND_PACKAGES: BackendPackage[] = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service"
];

export const FRONTEND_PACKAGES: FrontendPackage[] = [
  "api", "component", "hook", "page", "state", "style"
];

export const SHARED_PACKAGES: SharedPackage[] = [
  "auth", "config", "middleware", "utils"
];
