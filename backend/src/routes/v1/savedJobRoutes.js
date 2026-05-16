import { Router } from "express";

import { createSavedJob, getMySavedJobs } from "../../controllers/savedJobs/savedJobController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createSavedJobValidator } from "../../validators/savedJobs/savedJobValidator.js";

const savedJobRoutes = Router();

savedJobRoutes.use(authenticateRequest);
savedJobRoutes.post("/", createSavedJobValidator, validateRequest, asyncHandler(createSavedJob));
savedJobRoutes.get("/me", asyncHandler(getMySavedJobs));

export default savedJobRoutes;
