import { query } from "express-validator";

export const skillGapValidator = [
  query("career_id").isInt({ min: 1 }).withMessage("Mã nghề nghiệp không hợp lệ.")
];
