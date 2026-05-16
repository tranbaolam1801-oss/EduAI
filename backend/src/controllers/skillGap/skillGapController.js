import { getMySkillGap } from "../../services/skillGap/skillGapService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getSkillGap = async (req, res) =>
  sendSuccess(res, {
    message: "Phân tích khoảng cách kỹ năng thành công.",
    data: await getMySkillGap(req.auth.user_id, Number(req.query.career_id))
  });
