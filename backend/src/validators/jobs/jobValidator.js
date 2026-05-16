import { query } from "express-validator";

const workingTypes = ["FULL_TIME", "PART_TIME", "INTERNSHIP", "REMOTE", "HYBRID"];

export const jobListValidator = [
  query("career_id").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("Mã nghề nghiệp không hợp lệ."),
  query("location")
    .optional({ values: "falsy" })
    .isLength({ min: 1, max: 150 })
    .withMessage("Khu vực tìm việc không hợp lệ."),
  query("working_type")
    .optional({ values: "falsy" })
    .isIn(workingTypes)
    .withMessage("Hình thức làm việc không hợp lệ."),
  query("salary_min")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Mức lương tối thiểu không hợp lệ."),
  query("salary_max")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Mức lương tối đa không hợp lệ."),
  query("limit")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("Số lượng công việc không hợp lệ.")
];
