import { listSkillCategories } from "../../services/skillCategories/skillCategoryService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getSkillCategories = async (_req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách nhóm kỹ năng thành công.",
    data: await listSkillCategories()
  });
