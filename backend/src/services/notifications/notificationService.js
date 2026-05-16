import { AppError } from "../../models/common/appError.js";
import {
  findNotificationByIdAndUserId,
  getNotificationsByUserId,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "../../repositories/notifications/notificationRepository.js";

export const listMyNotifications = async (userId, limit) => getNotificationsByUserId(userId, limit);

export const readNotification = async (notificationId, userId) => {
  const notification = await findNotificationByIdAndUserId(notificationId, userId);

  if (!notification) {
    throw new AppError("Không tìm thấy thông báo.", 404, "NOTIFICATION_NOT_FOUND");
  }

  return markNotificationAsRead(notificationId, userId);
};

export const readAllNotifications = async (userId) => {
  const updatedCount = await markAllNotificationsAsRead(userId);

  return {
    updated_count: updatedCount,
    notifications: await getNotificationsByUserId(userId, 20)
  };
};
