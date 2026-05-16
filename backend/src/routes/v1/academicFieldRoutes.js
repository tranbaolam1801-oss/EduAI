import { Router } from "express";

import { getAcademicFields } from "../../controllers/academicFields/academicFieldController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const academicFieldRoutes = Router();

academicFieldRoutes.get("/", asyncHandler(getAcademicFields));

export default academicFieldRoutes;
