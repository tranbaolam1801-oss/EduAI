import sql from "mssql";

import { env } from "./env.js";

const databaseConfig = {
  server: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  options: {
    encrypt: env.dbEncrypt,
    trustServerCertificate: env.dbTrustServerCertificate
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise;

export const getDatabasePool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(databaseConfig);
  }

  return poolPromise;
};

export const closeDatabasePool = async () => {
  if (!poolPromise) {
    return;
  }

  const pool = await poolPromise;
  await pool.close();
  poolPromise = undefined;
};

export const checkDatabaseConnection = async () => {
  const pool = await getDatabasePool();
  const result = await pool.request().query("SELECT 1 AS is_alive;");
  return result.recordset[0];
};
