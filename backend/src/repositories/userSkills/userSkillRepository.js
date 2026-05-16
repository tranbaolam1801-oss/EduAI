import { getDatabasePool } from "../../config/database.js";

export const upsertUserSkill = async ({
  userId,
  skillId,
  currentLevel,
  confidenceLevel,
  source
}) => {
  const pool = await getDatabasePool();
  await pool
    .request()
    .input("user_id", userId)
    .input("skill_id", skillId)
    .input("current_level", currentLevel)
    .input("confidence_level", confidenceLevel ?? null)
    .input("source", source)
    .execute("sp_UpsertUserSkill");

  return findUserSkillByUserAndSkill(userId, skillId);
};

export const findUserSkillByUserAndSkill = async (userId, skillId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("skillId", skillId)
    .query(`
      SELECT
        us.user_id,
        us.skill_id,
        s.skill_name,
        s.category_id,
        sc.category_name,
        us.current_level,
        us.confidence_level,
        us.source,
        us.last_assessed_at
      FROM UserSkills us
      JOIN Skills s ON s.skill_id = us.skill_id
      LEFT JOIN SkillCategories sc ON sc.category_id = s.category_id
      WHERE us.user_id = @userId AND us.skill_id = @skillId;
    `);

  return result.recordset[0] || null;
};

export const getUserSkillsByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      us.user_id,
      us.skill_id,
      s.skill_name,
      s.category_id,
      sc.category_name,
      s.difficulty_level,
      us.current_level,
      us.confidence_level,
      us.source,
      us.last_assessed_at
    FROM UserSkills us
    JOIN Skills s ON s.skill_id = us.skill_id
    LEFT JOIN SkillCategories sc ON sc.category_id = s.category_id
    WHERE us.user_id = @userId
    ORDER BY sc.category_name, s.skill_name;
  `);

  return result.recordset;
};
