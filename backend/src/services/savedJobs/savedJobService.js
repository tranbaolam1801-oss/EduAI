import { AppError } from "../../models/common/appError.js";
import { findJobById } from "../../repositories/jobs/jobRepository.js";
import { createSavedJob, findSavedJob, getSavedJobsByUserId } from "../../repositories/savedJobs/savedJobRepository.js";

export const saveJob = async (userId, payload) => {
  const job = await findJobById(payload.job_id, userId);

  if (!job) {
    throw new AppError("Không tìm thấy cơ hội nghề nghiệp.", 404, "JOB_NOT_FOUND");
  }

  const existing = await findSavedJob(userId, payload.job_id);

  if (existing) {
    throw new AppError("Vị trí này đã được lưu trước đó.", 400, "SAVED_JOB_ALREADY_EXISTS");
  }

  return createSavedJob({
    userId,
    jobId: payload.job_id,
    status: payload.status ?? "SAVED"
  });
};

export const listMySavedJobs = async (userId) => getSavedJobsByUserId(userId);
