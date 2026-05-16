import { Router } from "express";

import {
  getRoadmapTask,
  updateRoadmapTaskProgress
} from "../../controllers/roadmapTasks/roadmapTaskController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  roadmapTaskIdValidator,
  updateRoadmapTaskProgressValidator
} from "../../validators/roadmapTasks/roadmapTaskValidator.js";

const roadmapTaskRoutes = Router();

roadmapTaskRoutes.use(authenticateRequest);
roadmapTaskRoutes.get("/:id", roadmapTaskIdValidator, validateRequest, asyncHandler(getRoadmapTask));
roadmapTaskRoutes.patch(
  "/:id/progress",
  updateRoadmapTaskProgressValidator,
  validateRequest,
  asyncHandler(updateRoadmapTaskProgress)
);

export default roadmapTaskRoutes;
