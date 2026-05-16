import { Router } from "express";

import { getSkills } from "../../controllers/skills/skillController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { listSkillsValidator } from "../../validators/skills/skillValidator.js";

const skillRoutes = Router();

skillRoutes.get("/", listSkillsValidator, validateRequest, asyncHandler(getSkills));

export default skillRoutes;
