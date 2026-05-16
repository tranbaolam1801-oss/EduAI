import { getDatabasePool } from "../../config/database.js";

export const getJobs = async ({
  userId,
  careerId,
  location,
  workingType,
  salaryMin,
  salaryMax,
  limit = 20
} = {}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId ?? null)
    .input("careerId", careerId ?? null)
    .input("location", location ? `%${location}%` : null)
    .input("workingType", workingType ?? null)
    .input("salaryMin", salaryMin ?? null)
    .input("salaryMax", salaryMax ?? null)
    .input("limit", limit)
    .query(`
      SELECT TOP (@limit)
        j.job_id,
        j.company_id,
        co.company_name,
        j.career_id,
        c.career_name,
        j.job_title,
        j.job_description,
        j.location,
        j.working_type,
        j.salary_min,
        j.salary_max,
        j.contact_email,
        j.apply_url,
        j.posted_date,
        j.deadline,
        j.status,
        jm.match_percent
      FROM JobPostings j
      JOIN Companies co ON co.company_id = j.company_id
      LEFT JOIN Careers c ON c.career_id = j.career_id
      LEFT JOIN vw_JobMatchScore jm ON jm.job_id = j.job_id AND jm.user_id = @userId
      WHERE j.status = N'OPEN'
        AND (@careerId IS NULL OR j.career_id = @careerId)
        AND (@location IS NULL OR j.location LIKE @location)
        AND (@workingType IS NULL OR j.working_type = @workingType)
        AND (@salaryMin IS NULL OR ISNULL(j.salary_max, j.salary_min) >= @salaryMin)
        AND (@salaryMax IS NULL OR ISNULL(j.salary_min, j.salary_max) <= @salaryMax)
      ORDER BY ISNULL(jm.match_percent, 0) DESC, j.posted_date DESC, j.job_id DESC;
    `);

  return result.recordset;
};

export const findJobById = async (jobId, userId = null) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("jobId", jobId)
    .input("userId", userId ?? null)
    .query(`
      SELECT
        j.job_id,
        j.company_id,
        co.company_name,
        j.career_id,
        c.career_name,
        j.job_title,
        j.job_description,
        j.location,
        j.working_type,
        j.salary_min,
        j.salary_max,
        j.contact_email,
        j.apply_url,
        j.posted_date,
        j.deadline,
        j.status,
        jm.match_percent
      FROM JobPostings j
      JOIN Companies co ON co.company_id = j.company_id
      LEFT JOIN Careers c ON c.career_id = j.career_id
      LEFT JOIN vw_JobMatchScore jm ON jm.job_id = j.job_id AND jm.user_id = @userId
      WHERE j.job_id = @jobId;
    `);

  return result.recordset[0] || null;
};

export const getJobSkills = async (jobId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("jobId", jobId).query(`
    SELECT
      js.job_id,
      js.skill_id,
      s.skill_name,
      s.difficulty_level,
      js.required_level
    FROM JobSkills js
    JOIN Skills s ON s.skill_id = js.skill_id
    WHERE js.job_id = @jobId
    ORDER BY js.required_level DESC, s.skill_name;
  `);

  return result.recordset;
};
