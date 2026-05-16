import { getDatabasePool } from "../../config/database.js";

export const getSkillGapByUserAndCareer = async (userId, careerId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("careerId", careerId)
    .query(`
      SELECT
        user_id,
        full_name,
        career_id,
        career_name,
        skill_id,
        skill_name,
        current_level,
        required_level,
        gap_level,
        importance_weight
      FROM vw_SkillGapAnalysis
      WHERE user_id = @userId AND career_id = @careerId
      ORDER BY gap_level DESC, importance_weight DESC, skill_name;
    `);

  return result.recordset;
};
