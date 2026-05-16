import { Router } from "express";

import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from "../../controllers/notifications/notificationController.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticateRequest } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  notificationIdValidator,
  notificationListValidator
} from "../../validators/notifications/notificationValidator.js";

const notificationRoutes = Router();

notificationRoutes.use(authenticateRequest);
notificationRoutes.get("/me", notificationListValidator, validateRequest, asyncHandler(getMyNotifications));
notificationRoutes.patch("/read-all", asyncHandler(markAllNotificationsRead));
notificationRoutes.patch("/:id/read", notificationIdValidator, validateRequest, asyncHandler(markNotificationRead));

export default notificationRoutes;
