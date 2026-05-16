import { Router } from "express";

import { getRecommendedResources, getResources } from "../../controllers/resources/resourceController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  resourceListValidator,
  resourceRecommendValidator
} from "../../validators/resources/resourceValidator.js";

const resourceRoutes = Router();

resourceRoutes.get("/", resourceListValidator, validateRequest, asyncHandler(getResources));
resourceRoutes.get(
  "/recommend",
  resourceRecommendValidator,
  validateRequest,
  asyncHandler(getRecommendedResources)
);

export default resourceRoutes;
