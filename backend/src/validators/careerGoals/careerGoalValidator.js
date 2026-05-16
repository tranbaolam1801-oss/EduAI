import { body } from "express-validator";

export const careerGoalValidator = [
  body("career_id").isInt({ min: 1 }).withMessage("Mã nghề nghiệp không hợp lệ."),
  body("priority_order")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 20 })
    .withMessage("Thứ tự ưu tiên không hợp lệ."),
  body("target_deadline")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Hạn mục tiêu không hợp lệ."),
  body("status")
    .optional({ values: "falsy" })
    .isIn(["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"])
    .withMessage("Trạng thái nghề mục tiêu không hợp lệ.")
];
