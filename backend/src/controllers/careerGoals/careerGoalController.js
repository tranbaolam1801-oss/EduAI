import {
  createOrUpdateCareerGoal,
  getMyCareerGoals
} from "../../services/careerGoals/careerGoalService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const saveCareerGoal = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Lưu nghề mục tiêu thành công.",
    data: await createOrUpdateCareerGoal(req.auth.user_id, req.body)
  });

export const getCareerGoals = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách nghề mục tiêu thành công.",
    data: await getMyCareerGoals(req.auth.user_id)
  });
