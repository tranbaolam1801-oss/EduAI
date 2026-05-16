import { body } from "express-validator";

export const userSkillValidator = [
  body("skill_id").isInt({ min: 1 }).withMessage("Mã kỹ năng không hợp lệ."),
  body("current_level")
    .isInt({ min: 0, max: 100 })
    .withMessage("Mức kỹ năng phải từ 0 đến 100."),
  body("confidence_level")
    .optional({ values: "falsy" })
    .isInt({ min: 0, max: 100 })
    .withMessage("Độ tự tin phải từ 0 đến 100."),
  body("source")
    .optional({ values: "falsy" })
    .isIn(["SELF_ASSESSMENT", "QUIZ", "PROJECT", "AI_EVALUATION", "ADMIN"])
    .withMessage("Nguồn đánh giá kỹ năng không hợp lệ.")
];
