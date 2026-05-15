import app from "./app.js";
import { closeDatabasePool } from "./config/database.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`Backend server is running on port ${env.port}.`);
});

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down backend server.`);
  server.close(async () => {
    await closeDatabasePool();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
