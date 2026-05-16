import { listResources, recommendResources } from "../../services/resources/resourceService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

const parseBoolean = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return value === "true" || value === "1";
};

export const getResources = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách tài liệu học tập thành công.",
    data: await listResources({
      skillId: req.query.skill_id ? Number(req.query.skill_id) : null,
      difficultyLevel: req.query.difficulty_level || null,
      resourceType: req.query.resource_type || null,
      isFree: parseBoolean(req.query.is_free),
      minimumRating: req.query.minimum_rating ? Number(req.query.minimum_rating) : null,
      limit: req.query.limit ? Number(req.query.limit) : 50
    })
  });

export const getRecommendedResources = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách tài liệu gợi ý thành công.",
    data: await recommendResources({
      skillId: req.query.skill_id ? Number(req.query.skill_id) : null,
      difficultyLevel: req.query.difficulty_level || null,
      resourceType: req.query.resource_type || null,
      isFree: parseBoolean(req.query.is_free),
      minimumRating: req.query.minimum_rating ? Number(req.query.minimum_rating) : null,
      limit: req.query.limit ? Number(req.query.limit) : 12
    })
  });
