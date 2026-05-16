import { param, query } from "express-validator";

export const listCareersValidator = [
  query("field_id")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("Lĩnh vực không hợp lệ."),
  query("keyword")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ max: 100 })
    .withMessage("Từ khóa tìm kiếm không hợp lệ.")
];

export const careerIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã nghề nghiệp không hợp lệ.")
];
