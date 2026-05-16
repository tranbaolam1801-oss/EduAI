import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(configDirectory, "..");
const backendRoot = resolve(sourceRoot, "..");
const workspaceRoot = resolve(backendRoot, "..");

dotenv.config({ path: resolve(workspaceRoot, ".env") });
dotenv.config({ path: resolve(backendRoot, ".env"), override: true });

const uploadRoot = resolve(workspaceRoot, "storage", "uploads");

const toNumber = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 3000),
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: toNumber(process.env.DB_PORT, 1433),
  dbName: process.env.DB_NAME || "AI_LearningCareerDB",
  dbUser: process.env.DB_USER || "sa",
  dbPassword: process.env.DB_PASSWORD || "",
  dbEncrypt: (process.env.DB_ENCRYPT || "false").toLowerCase() === "true",
  dbTrustServerCertificate:
    (process.env.DB_TRUST_SERVER_CERTIFICATE || "true").toLowerCase() === "true",
  uploadRoot,
  uploadMaxFileSize: toNumber(process.env.UPLOAD_MAX_FILE_SIZE, 5 * 1024 * 1024),
  uploadFolders: [
    "avatars",
    "certificates",
    "projects",
    "challenge-submissions",
    "resources"
  ],
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",
  backendApiBasePath: process.env.BACKEND_API_BASE_PATH || "/api/v1"
};
