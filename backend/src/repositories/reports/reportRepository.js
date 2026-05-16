import { getDatabasePool } from "../../config/database.js";

export const getCareerReadinessOverview = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT TOP 1
      ucg.goal_id,
      ucg.career_id,
      c.career_name,
      ucg.priority_order,
      ucg.target_deadline,
      ucg.status,
      COUNT(cs.skill_id) AS total_required_skills,
      SUM(CASE WHEN ISNULL(us.current_level, 0) >= cs.required_level THEN 1 ELSE 0 END) AS matched_skills,
      CAST(AVG(CAST(cs.required_level AS DECIMAL(10, 2))) AS DECIMAL(10, 2)) AS average_required_level,
      CAST(AVG(CAST(ISNULL(us.current_level, 0) AS DECIMAL(10, 2))) AS DECIMAL(10, 2)) AS average_current_level,
      CAST(
        CASE
          WHEN COUNT(cs.skill_id) = 0 THEN 0
          ELSE 100.0 * SUM(CASE WHEN ISNULL(us.current_level, 0) >= cs.required_level THEN 1 ELSE 0 END) / COUNT(cs.skill_id)
        END AS DECIMAL(10, 2)
      ) AS readiness_percent
    FROM UserCareerGoals ucg
    JOIN Careers c ON c.career_id = ucg.career_id
    LEFT JOIN CareerSkills cs ON cs.career_id = ucg.career_id
    LEFT JOIN UserSkills us
      ON us.user_id = ucg.user_id
     AND us.skill_id = cs.skill_id
    WHERE ucg.user_id = @userId
      AND ucg.status = N'ACTIVE'
    GROUP BY
      ucg.goal_id,
      ucg.career_id,
      c.career_name,
      ucg.priority_order,
      ucg.target_deadline,
      ucg.status
    ORDER BY ucg.priority_order ASC, ucg.goal_id ASC;
  `);

  return result.recordset[0] || null;
};

export const getCareerReadinessPriorityGaps = async (userId, careerId, limit = 10) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("careerId", careerId).input("limit", limit).query(`
    SELECT TOP (@limit)
      skill_id,
      skill_name,
      current_level,
      required_level,
      gap_level,
      importance_weight
    FROM vw_SkillGapAnalysis
    WHERE user_id = @userId
      AND career_id = @careerId
      AND gap_level > 0
    ORDER BY gap_level DESC, importance_weight DESC, skill_name;
  `);

  return result.recordset;
};

export const getCareerReadinessStrengths = async (userId, careerId, limit = 5) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("careerId", careerId).input("limit", limit).query(`
    SELECT TOP (@limit)
      s.skill_id,
      s.skill_name,
      us.current_level,
      cs.required_level,
      cs.importance_weight
    FROM CareerSkills cs
    JOIN Skills s ON s.skill_id = cs.skill_id
    JOIN UserSkills us
      ON us.skill_id = cs.skill_id
     AND us.user_id = @userId
    WHERE cs.career_id = @careerId
      AND us.current_level >= cs.required_level
    ORDER BY cs.importance_weight DESC, us.current_level DESC, s.skill_name;
  `);

  return result.recordset;
};

export const getCareerReadinessJobSignals = async (userId, careerId, limit = 3) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("careerId", careerId).input("limit", limit).query(`
    SELECT TOP (@limit)
      j.job_id,
      j.job_title,
      j.location,
      co.company_name,
      jm.match_percent
    FROM JobPostings j
    JOIN Companies co ON co.company_id = j.company_id
    LEFT JOIN vw_JobMatchScore jm
      ON jm.job_id = j.job_id
     AND jm.user_id = @userId
    WHERE j.status = N'OPEN'
      AND j.career_id = @careerId
    ORDER BY ISNULL(jm.match_percent, 0) DESC, j.posted_date DESC, j.job_id DESC;
  `);

  return result.recordset;
};
