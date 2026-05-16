import { Router } from "express";

import { getJobs, getRecommendedJobs } from "../../controllers/jobs/jobController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { jobListValidator } from "../../validators/jobs/jobValidator.js";

const jobRoutes = Router();

jobRoutes.get("/", jobListValidator, validateRequest, asyncHandler(getJobs));
jobRoutes.get(
  "/recommend",
  authenticateRequest,
  jobListValidator,
  validateRequest,
  asyncHandler(getRecommendedJobs)
);

export default jobRoutes;
