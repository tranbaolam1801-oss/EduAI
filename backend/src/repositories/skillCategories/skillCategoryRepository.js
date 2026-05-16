import { getDatabasePool } from "../../config/database.js";

export const getSkillCategories = async () => {
  const pool = await getDatabasePool();
  const result = await pool.request().query(`
    SELECT category_id, category_name, description
    FROM SkillCategories
    ORDER BY category_name;
  `);

  return result.recordset;
};
