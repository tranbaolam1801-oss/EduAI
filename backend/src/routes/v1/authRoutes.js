import { Router } from "express";

import { getIdentity, loginUser } from "../../controllers/auth/authController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { loginValidator } from "../../validators/auth/authValidator.js";

const authRoutes = Router();

authRoutes.post("/login", loginValidator, validateRequest, asyncHandler(loginUser));
authRoutes.get("/identity", authenticateRequest, asyncHandler(getIdentity));

export default authRoutes;
