import { getDatabasePool } from "../../config/database.js";

export const getCareers = async ({ fieldId, keyword } = {}) => {
  const pool = await getDatabasePool();
  const request = pool.request();
  request.input("fieldId", fieldId ?? null);
  request.input("keyword", keyword ? `%${keyword}%` : null);

  const result = await request.query(`
    SELECT
      c.career_id,
      c.field_id,
      af.field_name,
      c.career_name,
      c.description,
      c.market_demand_level,
      c.avg_salary_min,
      c.avg_salary_max,
      COUNT(cs.skill_id) AS required_skill_count
    FROM Careers c
    LEFT JOIN AcademicFields af ON af.field_id = c.field_id
    LEFT JOIN CareerSkills cs ON cs.career_id = c.career_id
    WHERE (@fieldId IS NULL OR c.field_id = @fieldId)
      AND (@keyword IS NULL OR c.career_name LIKE @keyword OR c.description LIKE @keyword)
    GROUP BY
      c.career_id,
      c.field_id,
      af.field_name,
      c.career_name,
      c.description,
      c.market_demand_level,
      c.avg_salary_min,
      c.avg_salary_max
    ORDER BY c.career_name;
  `);

  return result.recordset;
};

export const findCareerById = async (careerId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("careerId", careerId).query(`
    SELECT
      c.career_id,
      c.field_id,
      af.field_name,
      c.career_name,
      c.description,
      c.market_demand_level,
      c.avg_salary_min,
      c.avg_salary_max
    FROM Careers c
    LEFT JOIN AcademicFields af ON af.field_id = c.field_id
    WHERE c.career_id = @careerId;
  `);

  return result.recordset[0] || null;
};

export const getCareerSkills = async (careerId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("careerId", careerId).query(`
    SELECT
      cs.career_id,
      cs.skill_id,
      s.skill_name,
      s.difficulty_level,
      cs.required_level,
      cs.importance_weight,
      cs.is_required
    FROM CareerSkills cs
    JOIN Skills s ON s.skill_id = cs.skill_id
    WHERE cs.career_id = @careerId
    ORDER BY cs.importance_weight DESC, s.skill_name;
  `);

  return result.recordset;
};
