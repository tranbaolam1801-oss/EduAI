import { Router } from "express";

import {
  createChatMessage,
  createChatSession,
  getChatSessionById,
  getChatSessions
} from "../../controllers/chats/chatController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  chatSessionIdValidator,
  createChatMessageValidator,
  createChatSessionValidator
} from "../../validators/chats/chatValidator.js";

const chatRoutes = Router();

chatRoutes.use(authenticateRequest);
chatRoutes.post("/sessions", createChatSessionValidator, validateRequest, asyncHandler(createChatSession));
chatRoutes.get("/sessions", asyncHandler(getChatSessions));
chatRoutes.get("/sessions/:id", chatSessionIdValidator, validateRequest, asyncHandler(getChatSessionById));
chatRoutes.post(
  "/sessions/:id/messages",
  createChatMessageValidator,
  validateRequest,
  asyncHandler(createChatMessage)
);

export default chatRoutes;
