import { Router } from "express";

import { getMe } from "../../controllers/users/userController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";

const userRoutes = Router();

userRoutes.get("/me", authenticateRequest, asyncHandler(getMe));

export default userRoutes;
