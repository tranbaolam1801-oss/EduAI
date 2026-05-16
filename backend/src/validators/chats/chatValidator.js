import { body, param } from "express-validator";

export const createChatSessionValidator = [
  body("title")
    .optional({ values: "falsy" })
    .isLength({ min: 1, max: 200 })
    .withMessage("Tiêu đề phiên trò chuyện không hợp lệ.")
];

export const chatSessionIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Mã phiên trò chuyện không hợp lệ.")
];

export const createChatMessageValidator = [
  ...chatSessionIdValidator,
  body("message_content")
    .isString()
    .trim()
    .isLength({ min: 1, max: 4000 })
    .withMessage("Nội dung tin nhắn không hợp lệ.")
];
