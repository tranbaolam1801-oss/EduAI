import {
  generateRoadmap,
  getMyRoadmaps,
  getRoadmapDetail,
  getRoadmapStages
} from "../../services/roadmaps/roadmapService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const createRoadmap = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Tạo lộ trình học thành công.",
    data: await generateRoadmap(req.auth.user_id, req.body)
  });

export const getRoadmaps = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách lộ trình học thành công.",
    data: await getMyRoadmaps(req.auth.user_id)
  });

export const getRoadmapById = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy chi tiết lộ trình học thành công.",
    data: await getRoadmapDetail(req.auth.user_id, Number(req.params.id))
  });

export const getStagesByRoadmapId = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách giai đoạn học thành công.",
    data: await getRoadmapStages(req.auth.user_id, Number(req.params.id))
  });
