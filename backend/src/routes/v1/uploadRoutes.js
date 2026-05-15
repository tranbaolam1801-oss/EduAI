import { Router } from "express";

import { uploadFile } from "../../controllers/upload/uploadController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { uploadSingleFile } from "../../middlewares/uploadMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { uploadFolderValidator } from "../../validators/upload/uploadValidator.js";

const uploadRoutes = Router();

uploadRoutes.post(
  "/:folder",
  uploadFolderValidator,
  validateRequest,
  (req, res, next) => uploadSingleFile(req, res, next),
  asyncHandler(uploadFile)
);

export default uploadRoutes;
