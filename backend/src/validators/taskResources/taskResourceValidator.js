import { body } from "express-validator";

export const taskResourceValidator = [
  body("task_id").isInt({ min: 1 }).withMessage("Mã nhiệm vụ học tập không hợp lệ."),
  body("resource_id").isInt({ min: 1 }).withMessage("Mã tài liệu học tập không hợp lệ."),
  body("priority_order")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("Thứ tự ưu tiên tài liệu không hợp lệ.")
];
