/**
 * Backend Configuration Module
 * Loads environment variables and provides typed config object.
 */

import dotenv from "dotenv";
import path from "path";

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const config = {
  // API credentials
  email: process.env.EMAIL || "",
  name: process.env.NAME || "",
  rollNo: process.env.ROLL_NO || "",
  accessCode: process.env.ACCESS_CODE || "",
  clientID: process.env.CLIENT_ID || "",
  clientSecret: process.env.CLIENT_SECRET || "",

  // Server settings
  port: parseInt(process.env.PORT || "5000", 10),
  baseUrl: process.env.BASE_URL || "http://20.207.122.201",

  // Frontend URL for CORS
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
