import { param, query } from "express-validator";

const challengeStatuses = ["OPEN", "CLOSED", "DRAFT"];

export const challengeListValidator = [
  query("status")
    .optional({ values: "falsy" })
    .isIn(challengeStatuses)
    .withMessage("Trạng thái thử thách không hợp lệ."),
  query("limit")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("Số lượng thử thách không hợp lệ.")
];

export const challengeIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã thử thách không hợp lệ.")
];
