import { Router } from "express";

import { getCompanyById } from "../../controllers/companies/companyController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { companyIdValidator } from "../../validators/companies/companyValidator.js";

const companyRoutes = Router();

companyRoutes.get("/:id", companyIdValidator, validateRequest, asyncHandler(getCompanyById));

export default companyRoutes;
