import { Router } from "express";

import { saveTaskResource } from "../../controllers/taskResources/taskResourceController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { taskResourceValidator } from "../../validators/taskResources/taskResourceValidator.js";

const taskResourceRoutes = Router();

taskResourceRoutes.use(authenticateRequest);
taskResourceRoutes.post("/", taskResourceValidator, validateRequest, asyncHandler(saveTaskResource));

export default taskResourceRoutes;
