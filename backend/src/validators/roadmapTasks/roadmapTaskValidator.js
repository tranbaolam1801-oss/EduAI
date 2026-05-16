import { body, param } from "express-validator";

export const roadmapTaskIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã nhiệm vụ học tập không hợp lệ.")
];

export const updateRoadmapTaskProgressValidator = [
  ...roadmapTaskIdValidator,
  body("progress_percent")
    .isInt({ min: 0, max: 100 })
    .withMessage("Tiến độ học tập phải từ 0 đến 100."),
  body("study_minutes")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("Số phút học phải lớn hơn hoặc bằng 0."),
  body("note")
    .optional({ values: "falsy" })
    .isLength({ max: 1000 })
    .withMessage("Ghi chú tiến độ không được vượt quá 1000 ký tự.")
];
