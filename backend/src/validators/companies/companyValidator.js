import { param } from "express-validator";

export const companyIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã công ty không hợp lệ.")
];
