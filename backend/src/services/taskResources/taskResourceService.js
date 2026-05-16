import { AppError } from "../../models/common/appError.js";
import { findResourceById } from "../../repositories/resources/resourceRepository.js";
import { findRoadmapTaskByIdAndUserId, getTaskResourcesByTaskId } from "../../repositories/roadmapTasks/roadmapTaskRepository.js";
import { createTaskResourceLink, findTaskResourceLink } from "../../repositories/taskResources/taskResourceRepository.js";

export const createTaskResource = async (userId, payload) => {
  const task = await findRoadmapTaskByIdAndUserId(payload.task_id, userId);

  if (!task) {
    throw new AppError("Không tìm thấy nhiệm vụ học tập.", 404, "ROADMAP_TASK_NOT_FOUND");
  }

  const resource = await findResourceById(payload.resource_id);

  if (!resource) {
    throw new AppError("Tài liệu học tập không tồn tại.", 404, "RESOURCE_NOT_FOUND");
  }

  const existingLink = await findTaskResourceLink(payload.task_id, payload.resource_id);

  if (existingLink) {
    throw new AppError(
      "Tài liệu này đã được gắn với nhiệm vụ học tập.",
      400,
      "TASK_RESOURCE_ALREADY_EXISTS"
    );
  }

  await createTaskResourceLink({
    taskId: payload.task_id,
    resourceId: payload.resource_id,
    priorityOrder: payload.priority_order ?? 1
  });

  return getTaskResourcesByTaskId(payload.task_id);
};
