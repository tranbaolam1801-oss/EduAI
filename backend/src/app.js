import express from "express";
import path from "node:path";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import v1Routes from "./routes/v1/index.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(env.uploadRoot)));
app.use(env.backendApiBasePath, v1Routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
