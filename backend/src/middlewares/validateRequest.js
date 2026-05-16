import { validationResult } from "express-validator";

import { AppError } from "../models/common/appError.js";

export const validateRequest = (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(
    new AppError("Dữ liệu không hợp lệ.", 400, "VALIDATION_ERROR", result.array())
  );
};
