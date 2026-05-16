import { getDatabasePool } from "../../config/database.js";

export const getSkills = async ({ categoryId, keyword } = {}) => {
  const pool = await getDatabasePool();
  const request = pool.request();
  request.input("categoryId", categoryId ?? null);
  request.input("keyword", keyword ? `%${keyword}%` : null);

  const result = await request.query(`
    SELECT
      s.skill_id,
      s.category_id,
      sc.category_name,
      s.skill_name,
      s.description,
      s.difficulty_level
    FROM Skills s
    LEFT JOIN SkillCategories sc ON sc.category_id = s.category_id
    WHERE (@categoryId IS NULL OR s.category_id = @categoryId)
      AND (@keyword IS NULL OR s.skill_name LIKE @keyword OR s.description LIKE @keyword)
    ORDER BY sc.category_name, s.skill_name;
  `);

  return result.recordset;
};

export const findSkillById = async (skillId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("skillId", skillId).query(`
    SELECT skill_id, category_id, skill_name, description, difficulty_level
    FROM Skills
    WHERE skill_id = @skillId;
  `);

  return result.recordset[0] || null;
};
