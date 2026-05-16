import { Router } from "express";

import {
  createQuizAttempt,
  getMyQuizAttempts,
  submitQuizAttempt
} from "../../controllers/quizAttempts/quizAttemptController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createQuizAttemptValidator,
  submitQuizAttemptValidator
} from "../../validators/quizAttempts/quizAttemptValidator.js";

const quizAttemptRoutes = Router();

quizAttemptRoutes.use(authenticateRequest);
quizAttemptRoutes.post("/", createQuizAttemptValidator, validateRequest, asyncHandler(createQuizAttempt));
quizAttemptRoutes.post("/:id/submit", submitQuizAttemptValidator, validateRequest, asyncHandler(submitQuizAttempt));
quizAttemptRoutes.get("/me", asyncHandler(getMyQuizAttempts));

export default quizAttemptRoutes;
