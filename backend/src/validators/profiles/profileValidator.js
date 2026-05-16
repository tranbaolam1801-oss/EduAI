import { body } from "express-validator";

const profileRules = [
  body("field_id")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("Lĩnh vực học tập không hợp lệ."),
  body("university")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 150 })
    .withMessage("Trường học không hợp lệ."),
  body("major")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 150 })
    .withMessage("Chuyên ngành không hợp lệ."),
  body("academic_year")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 10 })
    .withMessage("Năm học không hợp lệ."),
  body("current_level")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 50 })
    .withMessage("Trình độ hiện tại không hợp lệ."),
  body("study_hours_per_week")
    .isFloat({ min: 0, max: 80 })
    .withMessage("Số giờ học mỗi tuần phải từ 0 đến 80."),
  body("target_completion_months")
    .isInt({ min: 1, max: 60 })
    .withMessage("Thời gian mục tiêu phải từ 1 đến 60 tháng."),
  body("preferred_location")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 120 })
    .withMessage("Khu vực mong muốn không hợp lệ."),
  body("career_goal_note")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 500 })
    .withMessage("Ghi chú mục tiêu nghề nghiệp không hợp lệ.")
];

export const createProfileValidator = profileRules;
export const updateProfileValidator = profileRules;
