import { Router } from "express";

import { getMyRecommendations } from "../../controllers/recommendations/recommendationController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";

const recommendationRoutes = Router();

recommendationRoutes.use(authenticateRequest);
recommendationRoutes.get("/me", asyncHandler(getMyRecommendations));

export default recommendationRoutes;
