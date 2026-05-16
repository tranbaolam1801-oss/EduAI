import { getDatabasePool } from "../../config/database.js";

export const getNotificationsByUserId = async (userId, limit = 20) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("limit", limit).query(`
    SELECT TOP (@limit)
      notification_id,
      user_id,
      title,
      content,
      notification_type,
      is_read,
      created_at
    FROM Notifications
    WHERE user_id = @userId
    ORDER BY is_read ASC, created_at DESC, notification_id DESC;
  `);

  return result.recordset;
};

export const findNotificationByIdAndUserId = async (notificationId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("notificationId", notificationId)
    .input("userId", userId)
    .query(`
      SELECT
        notification_id,
        user_id,
        title,
        content,
        notification_type,
        is_read,
        created_at
      FROM Notifications
      WHERE notification_id = @notificationId
        AND user_id = @userId;
    `);

  return result.recordset[0] || null;
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("notificationId", notificationId)
    .input("userId", userId)
    .query(`
      UPDATE Notifications
      SET is_read = 1
      OUTPUT
        INSERTED.notification_id,
        INSERTED.user_id,
        INSERTED.title,
        INSERTED.content,
        INSERTED.notification_type,
        INSERTED.is_read,
        INSERTED.created_at
      WHERE notification_id = @notificationId
        AND user_id = @userId;
    `);

  return result.recordset[0] || null;
};

export const markAllNotificationsAsRead = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    UPDATE Notifications
    SET is_read = 1
    WHERE user_id = @userId
      AND is_read = 0;
  `);

  return Number(result.rowsAffected?.[0] || 0);
};

export const createNotification = async ({ userId, title, content, notificationType = "SYSTEM" }) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("title", title)
    .input("content", content ?? null)
    .input("notificationType", notificationType)
    .query(`
      INSERT INTO Notifications (
        user_id,
        title,
        content,
        notification_type
      )
      OUTPUT
        INSERTED.notification_id,
        INSERTED.user_id,
        INSERTED.title,
        INSERTED.content,
        INSERTED.notification_type,
        INSERTED.is_read,
        INSERTED.created_at
      VALUES (
        @userId,
        @title,
        @content,
        @notificationType
      );
    `);

  return result.recordset[0];
};
