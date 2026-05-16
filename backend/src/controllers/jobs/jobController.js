import { listJobs, listRecommendedJobs } from "../../services/jobs/jobService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

const readListParams = (query) => ({
  careerId: query.career_id ? Number(query.career_id) : null,
  location: query.location || null,
  workingType: query.working_type || null,
  salaryMin: query.salary_min ? Number(query.salary_min) : null,
  salaryMax: query.salary_max ? Number(query.salary_max) : null,
  limit: query.limit ? Number(query.limit) : 20
});

export const getJobs = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách cơ hội nghề nghiệp thành công.",
    data: await listJobs(req.auth?.user_id ?? null, readListParams(req.query))
  });

export const getRecommendedJobs = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách cơ hội nghề nghiệp phù hợp thành công.",
    data: await listRecommendedJobs(req.auth.user_id, readListParams(req.query))
  });
