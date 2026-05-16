import { Router } from "express";

import { getSkillGap } from "../../controllers/skillGap/skillGapController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { skillGapValidator } from "../../validators/skillGap/skillGapValidator.js";

const skillGapRoutes = Router();

skillGapRoutes.get("/", authenticateRequest, skillGapValidator, validateRequest, asyncHandler(getSkillGap));

export default skillGapRoutes;
