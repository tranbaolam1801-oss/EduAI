import { Router } from "express";

import { getHealth, getProtectedSession } from "../../controllers/system/systemController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";

const systemRoutes = Router();

systemRoutes.get("/health", asyncHandler(getHealth));
systemRoutes.get("/session", authenticateRequest, asyncHandler(getProtectedSession));

export default systemRoutes;
