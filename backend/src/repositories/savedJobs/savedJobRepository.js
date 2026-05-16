import { getDatabasePool } from "../../config/database.js";

export const findSavedJob = async (userId, jobId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("jobId", jobId)
    .query(`
      SELECT
        user_id,
        job_id,
        saved_at,
        status
      FROM SavedJobs
      WHERE user_id = @userId AND job_id = @jobId;
    `);

  return result.recordset[0] || null;
};

export const createSavedJob = async ({ userId, jobId, status = "SAVED" }) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("jobId", jobId)
    .input("status", status)
    .query(`
      INSERT INTO SavedJobs (
        user_id,
        job_id,
        status
      )
      OUTPUT
        INSERTED.user_id,
        INSERTED.job_id,
        INSERTED.saved_at,
        INSERTED.status
      VALUES (
        @userId,
        @jobId,
        @status
      );
    `);

  return result.recordset[0];
};

export const getSavedJobsByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      sj.user_id,
      sj.job_id,
      sj.saved_at,
      sj.status AS saved_job_status,
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
      j.status AS job_status
    FROM SavedJobs sj
    JOIN JobPostings j ON j.job_id = sj.job_id
    JOIN Companies co ON co.company_id = j.company_id
    LEFT JOIN Careers c ON c.career_id = j.career_id
    WHERE sj.user_id = @userId
    ORDER BY sj.saved_at DESC, sj.job_id DESC;
  `);

  return result.recordset;
};
