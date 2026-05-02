/**
 * Authentication module for the logging middleware.
 * Manages Bearer token lifecycle — fetches, caches, and auto-refreshes
 * tokens before they expire.
 */

import axios from "axios";
import { AuthTokenResponse, LoggerConfig } from "./types";

// Buffer time (in seconds) before token expiry to trigger refresh
const TOKEN_REFRESH_BUFFER = 60;

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Get a valid Bearer token. Uses cached token if still valid,
 * otherwise fetches a new one from the auth endpoint.
 */
export async function getAuthToken(config: LoggerConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if it's still valid (with buffer)
  if (cachedToken && now < tokenExpiresAt - TOKEN_REFRESH_BUFFER) {
    return cachedToken;
  }

  // Fetch a new token
  const baseUrl = config.baseUrl || "http://20.207.122.201";
  const url = `${baseUrl}/evaluation-service/auth`;

  const response = await axios.post<AuthTokenResponse>(url, {
    email: config.email,
    name: config.name,
    rollNo: config.rollNo,
    accessCode: config.accessCode,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
  });

  cachedToken = response.data.access_token;
  tokenExpiresAt = response.data.expires_in;

  return cachedToken;
}

/**
 * Clear the cached token (useful for testing or forced refresh).
 */
export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiresAt = 0;
}
