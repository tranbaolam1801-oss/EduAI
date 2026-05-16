import { body } from "express-validator";

const statuses = ["SAVED", "APPLIED", "REJECTED", "INTERVIEW"];

export const createSavedJobValidator = [
  body("job_id").isInt({ min: 1 }).withMessage("Mã công việc không hợp lệ."),
  body("status")
    .optional({ values: "falsy" })
    .isIn(statuses)
    .withMessage("Trạng thái lưu công việc không hợp lệ.")
];
