import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Email must be valid."),
  body("password").isString().notEmpty().withMessage("Password is required.")
];
