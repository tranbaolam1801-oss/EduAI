import { Router } from "express";

import { generateQuiz, getQuizById, getQuizList } from "../../controllers/quizzes/quizController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  generateQuizValidator,
  quizIdValidator,
  quizListValidator
} from "../../validators/quizzes/quizValidator.js";

const quizRoutes = Router();

quizRoutes.get("/", quizListValidator, validateRequest, asyncHandler(getQuizList));
quizRoutes.post("/generate", authenticateRequest, generateQuizValidator, validateRequest, asyncHandler(generateQuiz));
quizRoutes.get("/:id", quizIdValidator, validateRequest, asyncHandler(getQuizById));

export default quizRoutes;
