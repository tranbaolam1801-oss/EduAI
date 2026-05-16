import { listSkills } from "../../services/skills/skillService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getSkills = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách kỹ năng thành công.",
    data: await listSkills({
      categoryId: req.query.category_id ? Number(req.query.category_id) : null,
      keyword: req.query.keyword || null
    })
  });
