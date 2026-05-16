import { param, query } from "express-validator";

export const notificationListValidator = [
  query("limit")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("Số lượng thông báo không hợp lệ.")
];

export const notificationIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã thông báo không hợp lệ.")
];
