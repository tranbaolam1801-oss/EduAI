import { Router } from "express";

import {
  getChallengeById,
  getChallengeList,
  getMyChallengeList,
  joinChallengeById
} from "../../controllers/challenges/challengeController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  challengeIdValidator,
  challengeListValidator
} from "../../validators/challenges/challengeValidator.js";

const challengeRoutes = Router();

challengeRoutes.use(authenticateRequest);
challengeRoutes.get("/", challengeListValidator, validateRequest, asyncHandler(getChallengeList));
challengeRoutes.get("/me", asyncHandler(getMyChallengeList));
challengeRoutes.get("/:id", challengeIdValidator, validateRequest, asyncHandler(getChallengeById));
challengeRoutes.post("/:id/join", challengeIdValidator, validateRequest, asyncHandler(joinChallengeById));

export default challengeRoutes;
