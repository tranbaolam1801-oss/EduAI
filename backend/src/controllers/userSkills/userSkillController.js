import { getMyUserSkills, saveUserSkill } from "../../services/userSkills/userSkillService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const createOrUpdateUserSkill = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Lưu kỹ năng của bạn thành công.",
    data: await saveUserSkill(req.auth.user_id, req.body)
  });

export const getUserSkills = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách kỹ năng của bạn thành công.",
    data: await getMyUserSkills(req.auth.user_id)
  });
