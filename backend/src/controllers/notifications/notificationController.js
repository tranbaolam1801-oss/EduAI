import {
  listMyNotifications,
  readAllNotifications,
  readNotification
} from "../../services/notifications/notificationService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getMyNotifications = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách thông báo thành công.",
    data: await listMyNotifications(req.auth.user_id, req.query.limit ? Number(req.query.limit) : 20)
  });

export const markNotificationRead = async (req, res) =>
  sendSuccess(res, {
    message: "Đánh dấu đã đọc thông báo thành công.",
    data: await readNotification(Number(req.params.id), req.auth.user_id)
  });

export const markAllNotificationsRead = async (req, res) =>
  sendSuccess(res, {
    message: "Đánh dấu đã đọc toàn bộ thông báo thành công.",
    data: await readAllNotifications(req.auth.user_id)
  });
