import { Router } from "express";

import {
  getAnalyticsDashboard,
  getAnalyticsQuizResults,
  getAnalyticsRoadmapProgress,
  getAnalyticsSkillGap
} from "../../controllers/analytics/analyticsController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";

const analyticsRoutes = Router();

analyticsRoutes.use(authenticateRequest);
analyticsRoutes.get("/dashboard", asyncHandler(getAnalyticsDashboard));
analyticsRoutes.get("/skill-gap", asyncHandler(getAnalyticsSkillGap));
analyticsRoutes.get("/roadmap-progress", asyncHandler(getAnalyticsRoadmapProgress));
analyticsRoutes.get("/quiz-results", asyncHandler(getAnalyticsQuizResults));

export default analyticsRoutes;
