/**
 * Token Manager for Backend
 * Manages authentication tokens for calling the evaluation service API.
 */

import axios from "axios";
import { config } from "../config";
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

interface TokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;
const REFRESH_BUFFER = 60; // seconds before expiry to refresh

/**
 * Get a valid Bearer token for API calls.
 * Caches and auto-refreshes the token.
 */
export async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && now < tokenExpiresAt - REFRESH_BUFFER) {
    return cachedToken;
  }

  try {
    const url = `${config.baseUrl}/evaluation-service/auth`;

    const response = await axios.post<TokenResponse>(url, {
      email: config.email,
      name: config.name,
      rollNo: config.rollNo,
      accessCode: config.accessCode,
      clientID: config.clientID,
      clientSecret: config.clientSecret,
    });

    cachedToken = response.data.access_token;
    tokenExpiresAt = response.data.expires_in;

    await Log("backend", "info", "auth", "Authentication token refreshed successfully");

    return cachedToken;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown auth error";
    await Log("backend", "fatal", "auth", `Failed to obtain auth token: ${errMsg}`);
    throw new Error(`Authentication failed: ${errMsg}`);
  }
}
