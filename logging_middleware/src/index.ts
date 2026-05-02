import axios from "axios";

// Allowed values
type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";

// Backend only packages
type BackendPackage = "cache" | "controller" | "cron_job" | 
                      "handler" | "repository" | "route" | "service";

// Frontend only packages
type FrontendPackage = "api" | "page" | "state" | "style";

// Both
type SharedPackage = "auth" | "config" | "middleware" | "utils";

type Package = BackendPackage | FrontendPackage | SharedPackage;

const BASE_URL = "http://20.244.56.144/evaluation-service";

let authToken: string = "";

// Call this once at app startup to set the token
export const setAuthToken = (token: string): void => {
  authToken = token;
};

// Main Log function
export const Log = async (
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/logs`,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(`[LOG SENT] ${level} - ${message}`, response.data);
  } catch (error) {
    // Only time we use console - when logging itself fails
    console.error("[LOG FAILED]", error);
  }
};
