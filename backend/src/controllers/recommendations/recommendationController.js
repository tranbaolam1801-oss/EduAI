import { listMyRecommendations } from "../../services/recommendations/recommendationService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getMyRecommendations = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách gợi ý AI thành công.",
    data: await listMyRecommendations(req.auth.user_id)
  });
