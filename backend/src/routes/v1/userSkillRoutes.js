import { Router } from "express";

import {
  createOrUpdateUserSkill,
  getUserSkills
} from "../../controllers/userSkills/userSkillController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { userSkillValidator } from "../../validators/userSkills/userSkillValidator.js";

const userSkillRoutes = Router();

userSkillRoutes.use(authenticateRequest);
userSkillRoutes.post("/", userSkillValidator, validateRequest, asyncHandler(createOrUpdateUserSkill));
userSkillRoutes.get("/me", asyncHandler(getUserSkills));

export default userSkillRoutes;
