import { Router } from "express";

import {
  getCareerReadiness,
  getLearningSummary
} from "../../controllers/reports/reportController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";

const reportRoutes = Router();

reportRoutes.use(authenticateRequest);
reportRoutes.get("/learning-summary", asyncHandler(getLearningSummary));
reportRoutes.get("/career-readiness", asyncHandler(getCareerReadiness));

export default reportRoutes;
