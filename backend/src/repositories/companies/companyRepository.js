import { getDatabasePool } from "../../config/database.js";

export const findCompanyById = async (companyId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("companyId", companyId).query(`
    SELECT
      company_id,
      company_name,
      industry,
      website,
      email_public,
      phone_public,
      address,
      city,
      country
    FROM Companies
    WHERE company_id = @companyId;
  `);

  return result.recordset[0] || null;
};

export const getCompanyJobs = async (companyId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("companyId", companyId).query(`
    SELECT
      job_id,
      career_id,
      job_title,
      job_description,
      location,
      working_type,
      salary_min,
      salary_max,
      contact_email,
      apply_url,
      posted_date,
      deadline,
      status
    FROM JobPostings
    WHERE company_id = @companyId
    ORDER BY posted_date DESC, job_id DESC;
  `);

  return result.recordset;
};
