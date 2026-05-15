import { env } from "../../config/env.js";
import { getDatabaseHealth } from "../../services/database/databaseHealthService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getHealth = async (_req, res) => {
  const database = await getDatabaseHealth();

  return sendSuccess(res, {
    message: "Backend server is running.",
    data: {
      service: "backend",
      environment: env.nodeEnv,
      port: env.port,
      database,
      timestamp: new Date().toISOString()
    }
  });
};

export const getProtectedSession = async (req, res) =>
  sendSuccess(res, {
    message: "Authenticated session is valid.",
    data: {
      user: req.auth
    }
  });
