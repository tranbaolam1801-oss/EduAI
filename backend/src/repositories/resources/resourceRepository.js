import { getDatabasePool } from "../../config/database.js";

export const getResources = async ({
  skillId,
  difficultyLevel,
  resourceType,
  isFree,
  minimumRating,
  limit
} = {}) => {
  const pool = await getDatabasePool();
  const request = pool.request();
  request.input("skillId", skillId ?? null);
  request.input("difficultyLevel", difficultyLevel ?? null);
  request.input("resourceType", resourceType ?? null);
  request.input("isFree", typeof isFree === "boolean" ? isFree : null);
  request.input("minimumRating", minimumRating ?? null);
  request.input("limit", limit ?? 50);

  const result = await request.query(`
    SELECT TOP (@limit)
      lr.resource_id,
      lr.skill_id,
      s.skill_name,
      lr.title,
      lr.resource_type,
      lr.provider,
      lr.url,
      lr.difficulty_level,
      lr.estimated_hours,
      lr.rating,
      lr.is_free
    FROM LearningResources lr
    LEFT JOIN Skills s ON s.skill_id = lr.skill_id
    WHERE (@skillId IS NULL OR lr.skill_id = @skillId)
      AND (@difficultyLevel IS NULL OR lr.difficulty_level = @difficultyLevel)
      AND (@resourceType IS NULL OR lr.resource_type = @resourceType)
      AND (@isFree IS NULL OR lr.is_free = @isFree)
      AND (@minimumRating IS NULL OR ISNULL(lr.rating, 0) >= @minimumRating)
    ORDER BY
      CASE WHEN lr.skill_id = @skillId THEN 0 ELSE 1 END,
      ISNULL(lr.rating, 0) DESC,
      lr.title;
  `);

  return result.recordset;
};

export const findResourceById = async (resourceId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("resourceId", resourceId).query(`
    SELECT
      resource_id,
      skill_id,
      title,
      resource_type,
      provider,
      url,
      difficulty_level,
      estimated_hours,
      rating,
      is_free
    FROM LearningResources
    WHERE resource_id = @resourceId;
  `);

  return result.recordset[0] || null;
};
