import { Router } from "express";

import {
  createMyProfile,
  getProfile,
  updateProfile
} from "../../controllers/profiles/profileController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createProfileValidator,
  updateProfileValidator
} from "../../validators/profiles/profileValidator.js";

const profileRoutes = Router();

profileRoutes.use(authenticateRequest);
profileRoutes.post("/", createProfileValidator, validateRequest, asyncHandler(createMyProfile));
profileRoutes.get("/me", asyncHandler(getProfile));
profileRoutes.put("/me", updateProfileValidator, validateRequest, asyncHandler(updateProfile));

export default profileRoutes;
