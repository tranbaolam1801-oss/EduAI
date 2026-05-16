import { getCareerDetail, listCareers } from "../../services/careers/careerService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getCareers = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách nghề nghiệp thành công.",
    data: await listCareers({
      fieldId: req.query.field_id ? Number(req.query.field_id) : null,
      keyword: req.query.keyword || null
    })
  });

export const getCareerById = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy chi tiết nghề nghiệp thành công.",
    data: await getCareerDetail(Number(req.params.id))
  });
