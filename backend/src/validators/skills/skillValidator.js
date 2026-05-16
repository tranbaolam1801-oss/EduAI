import { query } from "express-validator";

export const listSkillsValidator = [
  query("category_id")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("Nhóm kỹ năng không hợp lệ."),
  query("keyword")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 100 })
    .withMessage("Từ khóa tìm kiếm không hợp lệ.")
];
