import { body } from "express-validator";

export const registerValidator = [
  body("full_name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Vui lòng nhập họ và tên."),
  body("email").isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự."),
  body("phone")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage("Số điện thoại không hợp lệ.")
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ."),
  body("password").isString().notEmpty().withMessage("Vui lòng nhập mật khẩu.")
];
