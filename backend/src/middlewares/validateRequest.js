import { validationResult } from "express-validator";

import { AppError } from "../models/common/appError.js";

export const validateRequest = (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(
    new AppError("Invalid request data.", 400, "VALIDATION_ERROR", result.array())
  );
};
