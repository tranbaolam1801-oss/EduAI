import { body, param, query } from "express-validator";

const difficultyLevels = ["BASIC", "INTERMEDIATE", "ADVANCED"];

export const quizListValidator = [
  query("skill_id").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("Mã kỹ năng không hợp lệ."),
  query("difficulty_level")
    .optional({ values: "falsy" })
    .isIn(difficultyLevels)
    .withMessage("Mức độ bài kiểm tra không hợp lệ."),
  query("limit")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("Số lượng bài kiểm tra không hợp lệ.")
];

export const generateQuizValidator = [
  body("skill_id").isInt({ min: 1 }).withMessage("Mã kỹ năng không hợp lệ."),
  body("difficulty_level").isIn(difficultyLevels).withMessage("Mức độ bài kiểm tra không hợp lệ."),
  body("number_of_questions")
    .isInt({ min: 1, max: 20 })
    .withMessage("Số lượng câu hỏi phải từ 1 đến 20."),
  body("time_limit_minutes")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 240 })
    .withMessage("Thời gian làm bài phải từ 1 đến 240 phút.")
];

export const quizIdValidator = [param("id").isInt({ min: 1 }).withMessage("Mã bài kiểm tra không hợp lệ.")];
