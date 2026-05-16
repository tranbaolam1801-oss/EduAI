import { listMySavedJobs, saveJob } from "../../services/savedJobs/savedJobService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const createSavedJob = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Lưu cơ hội nghề nghiệp thành công.",
    data: await saveJob(req.auth.user_id, req.body)
  });

export const getMySavedJobs = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách công việc đã lưu thành công.",
    data: await listMySavedJobs(req.auth.user_id)
  });
