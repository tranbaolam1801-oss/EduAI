import { param } from "express-validator";

export const uploadFolderValidator = [
  param("folder")
    .isString()
    .notEmpty()
    .withMessage("Upload folder is required.")
];
