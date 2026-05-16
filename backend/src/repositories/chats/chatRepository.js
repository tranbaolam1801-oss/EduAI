import { getDatabasePool } from "../../config/database.js";

export const createChatSession = async (userId, title) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("title", title ?? null)
    .query(`
      INSERT INTO ChatSessions (user_id, title)
      OUTPUT
        INSERTED.session_id,
        INSERTED.user_id,
        INSERTED.title,
        INSERTED.created_at
      VALUES (@userId, @title);
    `);

  return result.recordset[0];
};

export const findChatSessionByIdAndUserId = async (sessionId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("sessionId", sessionId)
    .input("userId", userId)
    .query(`
      SELECT
        session_id,
        user_id,
        title,
        created_at
      FROM ChatSessions
      WHERE session_id = @sessionId
        AND user_id = @userId;
    `);

  return result.recordset[0] || null;
};

export const getChatSessionsByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      cs.session_id,
      cs.user_id,
      cs.title,
      cs.created_at,
      latest_message.message_content AS latest_message_content,
      latest_message.sender_type AS latest_message_sender_type,
      latest_message.created_at AS latest_message_created_at,
      COUNT(cm.message_id) AS message_count
    FROM ChatSessions cs
    LEFT JOIN ChatMessages cm ON cm.session_id = cs.session_id
    OUTER APPLY (
      SELECT TOP 1
        message_content,
        sender_type,
        created_at
      FROM ChatMessages
      WHERE session_id = cs.session_id
      ORDER BY created_at DESC, message_id DESC
    ) latest_message
    WHERE cs.user_id = @userId
    GROUP BY
      cs.session_id,
      cs.user_id,
      cs.title,
      cs.created_at,
      latest_message.message_content,
      latest_message.sender_type,
      latest_message.created_at
    ORDER BY latest_message.created_at DESC, cs.created_at DESC;
  `);

  return result.recordset;
};

export const createChatMessage = async ({ sessionId, senderType, messageContent }) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("sessionId", sessionId)
    .input("senderType", senderType)
    .input("messageContent", messageContent)
    .query(`
      INSERT INTO ChatMessages (
        session_id,
        sender_type,
        message_content
      )
      OUTPUT
        INSERTED.message_id,
        INSERTED.session_id,
        INSERTED.sender_type,
        INSERTED.message_content,
        INSERTED.created_at
      VALUES (
        @sessionId,
        @senderType,
        @messageContent
      );
    `);

  return result.recordset[0];
};

export const getChatMessagesBySessionId = async (sessionId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("sessionId", sessionId).query(`
    SELECT
      message_id,
      session_id,
      sender_type,
      message_content,
      created_at
    FROM ChatMessages
    WHERE session_id = @sessionId
    ORDER BY created_at ASC, message_id ASC;
  `);

  return result.recordset;
};
