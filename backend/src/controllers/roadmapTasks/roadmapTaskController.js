import {
  getRoadmapTaskDetail,
  patchRoadmapTaskProgress
} from "../../services/roadmapTasks/roadmapTaskService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getRoadmapTask = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy chi tiết nhiệm vụ học tập thành công.",
    data: await getRoadmapTaskDetail(req.auth.user_id, Number(req.params.id))
  });

export const updateRoadmapTaskProgress = async (req, res) =>
  sendSuccess(res, {
    message: "Cập nhật tiến độ học tập thành công.",
    data: await patchRoadmapTaskProgress(req.auth.user_id, Number(req.params.id), req.body)
  });
