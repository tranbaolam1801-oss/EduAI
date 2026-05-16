import { getDatabasePool } from "../../config/database.js";

export const getRecommendationsByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      recommendation_id,
      user_id,
      recommendation_type,
      title,
      content,
      priority_score,
      status,
      created_at
    FROM AIRecommendations
    WHERE user_id = @userId
    ORDER BY priority_score DESC, created_at DESC, recommendation_id DESC;
  `);

  return result.recordset;
};

export const createRecommendation = async ({
  userId,
  recommendationType,
  title,
  content,
  priorityScore,
  status
}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("recommendationType", recommendationType)
    .input("title", title)
    .input("content", content)
    .input("priorityScore", priorityScore ?? 0)
    .input("status", status ?? "NEW")
    .query(`
      INSERT INTO AIRecommendations (
        user_id,
        recommendation_type,
        title,
        content,
        priority_score,
        status
      )
      OUTPUT
        INSERTED.recommendation_id,
        INSERTED.user_id,
        INSERTED.recommendation_type,
        INSERTED.title,
        INSERTED.content,
        INSERTED.priority_score,
        INSERTED.status,
        INSERTED.created_at
      VALUES (
        @userId,
        @recommendationType,
        @title,
        @content,
        @priorityScore,
        @status
      );
    `);

  return result.recordset[0];
};
