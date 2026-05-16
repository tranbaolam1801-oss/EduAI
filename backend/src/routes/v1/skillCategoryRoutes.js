import { Router } from "express";

import { getSkillCategories } from "../../controllers/skillCategories/skillCategoryController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const skillCategoryRoutes = Router();

skillCategoryRoutes.get("/", asyncHandler(getSkillCategories));

export default skillCategoryRoutes;
