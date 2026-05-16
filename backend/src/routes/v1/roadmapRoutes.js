import { Router } from "express";

import {
  createRoadmap,
  getRoadmapById,
  getRoadmaps,
  getStagesByRoadmapId
} from "../../controllers/roadmaps/roadmapController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { generateRoadmapValidator, roadmapIdValidator } from "../../validators/roadmaps/roadmapValidator.js";

const roadmapRoutes = Router();

roadmapRoutes.use(authenticateRequest);
roadmapRoutes.post("/generate", generateRoadmapValidator, validateRequest, asyncHandler(createRoadmap));
roadmapRoutes.get("/me", asyncHandler(getRoadmaps));
roadmapRoutes.get("/:id", roadmapIdValidator, validateRequest, asyncHandler(getRoadmapById));
roadmapRoutes.get("/:id/stages", roadmapIdValidator, validateRequest, asyncHandler(getStagesByRoadmapId));

export default roadmapRoutes;
