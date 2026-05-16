import { Router } from "express";

import {
  getCareerGoals,
  saveCareerGoal
} from "../../controllers/careerGoals/careerGoalController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { careerGoalValidator } from "../../validators/careerGoals/careerGoalValidator.js";

const careerGoalRoutes = Router();

careerGoalRoutes.use(authenticateRequest);
careerGoalRoutes.post("/", careerGoalValidator, validateRequest, asyncHandler(saveCareerGoal));
careerGoalRoutes.get("/me", asyncHandler(getCareerGoals));

export default careerGoalRoutes;
