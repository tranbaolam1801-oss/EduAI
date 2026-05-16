import { body, param } from "express-validator";

export const generateRoadmapValidator = [
  body("career_id").isInt({ min: 1 }).withMessage("Mã nghề nghiệp không hợp lệ."),
  body("target_completion_months")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 60 })
    .withMessage("Thời gian mục tiêu phải từ 1 đến 60 tháng.")
];

export const roadmapIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã lộ trình học không hợp lệ.")
];
