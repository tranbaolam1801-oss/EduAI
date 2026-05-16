import { query } from "express-validator";

const difficultyLevels = ["BASIC", "INTERMEDIATE", "ADVANCED"];
const resourceTypes = ["COURSE", "VIDEO", "BOOK", "ARTICLE", "EXERCISE", "PROJECT", "PODCAST"];

export const resourceListValidator = [
  query("skill_id")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("Mã kỹ năng không hợp lệ."),
  query("difficulty_level")
    .optional({ values: "falsy" })
    .isIn(difficultyLevels)
    .withMessage("Mức độ tài liệu không hợp lệ."),
  query("resource_type")
    .optional({ values: "falsy" })
    .isIn(resourceTypes)
    .withMessage("Loại tài liệu không hợp lệ."),
  query("is_free")
    .optional({ values: "falsy" })
    .isIn(["true", "false", "1", "0"])
    .withMessage("Trạng thái miễn phí không hợp lệ."),
  query("minimum_rating")
    .optional({ values: "falsy" })
    .isFloat({ min: 0, max: 5 })
    .withMessage("Điểm đánh giá phải từ 0 đến 5."),
  query("limit")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("Số lượng tài liệu không hợp lệ.")
];

export const resourceRecommendValidator = resourceListValidator;
