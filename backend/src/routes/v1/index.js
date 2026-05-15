import { Router } from "express";

import authRoutes from "./authRoutes.js";
import systemRoutes from "./systemRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const v1Routes = Router();

v1Routes.use("/system", systemRoutes);
v1Routes.use("/auth", authRoutes);
v1Routes.use("/uploads", uploadRoutes);

export default v1Routes;
