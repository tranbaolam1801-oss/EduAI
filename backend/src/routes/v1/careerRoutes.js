import { Router } from "express";

import { getCareerById, getCareers } from "../../controllers/careers/careerController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  careerIdValidator,
  listCareersValidator
} from "../../validators/careers/careerValidator.js";

const careerRoutes = Router();

careerRoutes.get("/", listCareersValidator, validateRequest, asyncHandler(getCareers));
careerRoutes.get("/:id", careerIdValidator, validateRequest, asyncHandler(getCareerById));

export default careerRoutes;
