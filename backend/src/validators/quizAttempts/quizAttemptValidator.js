import { body, param } from "express-validator";

export const createQuizAttemptValidator = [
  body("quiz_id").isInt({ min: 1 }).withMessage("Mã bài kiểm tra không hợp lệ.")
];

export const submitQuizAttemptValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã lượt làm bài không hợp lệ."),
  body("answers").isArray({ min: 1 }).withMessage("Danh sách câu trả lời không hợp lệ."),
  body("answers.*.question_id").isInt({ min: 1 }).withMessage("Mã câu hỏi không hợp lệ."),
  body("answers.*.user_answer")
    .isString()
    .trim()
    .isLength({ min: 1, max: 4000 })
    .withMessage("Câu trả lời không được để trống.")
];
