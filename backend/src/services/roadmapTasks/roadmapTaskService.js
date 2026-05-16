import { AppError } from "../../models/common/appError.js";
import {
  findRoadmapTaskByIdAndUserId,
  getTaskProgressLogsByTaskIdAndUserId,
  getTaskResourcesByTaskId,
  updateTaskProgress
} from "../../repositories/roadmapTasks/roadmapTaskRepository.js";

export const getRoadmapTaskDetail = async (userId, taskId) => {
  const task = await findRoadmapTaskByIdAndUserId(taskId, userId);

  if (!task) {
    throw new AppError("Không tìm thấy nhiệm vụ học tập.", 404, "ROADMAP_TASK_NOT_FOUND");
  }

  const [resources, progressLogs] = await Promise.all([
    getTaskResourcesByTaskId(taskId),
    getTaskProgressLogsByTaskIdAndUserId(taskId, userId)
  ]);

  return {
    ...task,
    resources,
    progress_logs: progressLogs
  };
};

export const patchRoadmapTaskProgress = async (userId, taskId, payload) => {
  const task = await findRoadmapTaskByIdAndUserId(taskId, userId);

  if (!task) {
    throw new AppError("Không tìm thấy nhiệm vụ học tập.", 404, "ROADMAP_TASK_NOT_FOUND");
  }

  await updateTaskProgress({
    userId,
    taskId,
    progressPercent: payload.progress_percent,
    studyMinutes: payload.study_minutes ?? 0,
    note: payload.note ?? null
  });

  return getRoadmapTaskDetail(userId, taskId);
};
